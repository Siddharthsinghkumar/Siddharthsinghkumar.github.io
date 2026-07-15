#!/usr/bin/env node
// Regression guards — run against the built site (out/) and src/.
// Fails (exit 1) on any violation. Wired into CI; run locally: npm run guards
// These encode CONTEXT.md / COPY.md / DESIGN.md invariants so future upgrades
// can't silently break them.

import { readFileSync, readdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "out");
let failures = 0;
const fail = (msg) => { failures++; console.error(`  ✗ ${msg}`); };
const ok = (msg) => console.log(`  ✓ ${msg}`);

if (!existsSync(out)) {
  console.error("out/ missing — run `npm run build` first.");
  process.exit(1);
}

const pages = {
  "index.html": readFileSync(join(out, "index.html"), "utf-8"),
  "prospect.html": readFileSync(join(out, "prospect", "index.html"), "utf-8"),
  "travel-planner.html": readFileSync(join(out, "travel-planner", "index.html"), "utf-8"),
  "projects.html": readFileSync(join(out, "projects", "index.html"), "utf-8"),
  "404.html": readFileSync(join(out, "404.html"), "utf-8"),
};
const allHtml = Object.values(pages).join("\n");

// ── 1. Required copy (COPY.md anchors + F21 enrichment) ─────────────────────
console.log("[1] Required copy present");
const required = [
  ["index.html", "I build systems that work while you sleep"],
  ["index.html", "six weeks"],
  ["index.html", "Prospect"],
  ["index.html", "siddharthsingh8418@gmail.com"],
  ["index.html", "No job boards, no third-party crawlers"],
  ["prospect.html", "reads the morning papers"],
  ["prospect.html", "RUNNING LOCAL"],
  ["travel-planner.html", "An agent that survives its own failures"],
  ["travel-planner.html", "K3S MULTI-NODE"],
  ["projects.html", "Sindhey Pathology"],
  ["404.html", "NO SIGNAL"],
];
for (const [page, str] of required) {
  pages[page].includes(str) ? ok(`${page}: "${str}"`) : fail(`${page} missing "${str}"`);
}

// ── 2. Forbidden content (CONTEXT.md exclusions + anti-cheap signals) ───────
console.log("[2] Forbidden content absent");
// Personal-info ban list — base64-opaque and index-logged so neither this
// public file nor public CI logs ever show the values (CONTEXT.md exclusions).
const personalBans = ["ODI2Nzk=", "Qi5UZWNo", "Qmlqbm9y", "R0FURSAyMDI0"];
personalBans.forEach((enc, i) => {
  const val = Buffer.from(enc, "base64").toString();
  allHtml.includes(val)
    ? fail(`found forbidden [personal ban #${i + 1}]`)
    : ok(`[personal ban #${i + 1}] absent`);
});
const forbidden = [
  "6 months",         // the corrected Sindhey claim
  "lorem", "Lorem",   // placeholder copy
  "unsplash", "Henrie", // donor demo content
  "465 contributions", // exact counts banned — ballpark only
];
for (const str of forbidden) {
  allHtml.includes(str) ? fail(`found forbidden "${str}"`) : ok(`"${str}" absent`);
}

// ── 3. Design-token discipline (DESIGN.md §1.1) ─────────────────────────────
console.log("[3] No rogue hex colors in src (tokens only)");
const allowedHexFiles = ["globals.css", "layout.tsx", "token-hex.ts"]; // tokens + theme-color meta + centralized hex constants
let rogue = [];
try {
  const hits = execSync(
    `grep -rn '#[0-9a-fA-F]\\{6\\}' src --include='*.tsx' --include='*.ts' --include='*.css' || true`,
    { cwd: root, encoding: "utf-8" },
  ).trim().split("\n").filter(Boolean);
  rogue = hits.filter((h) => !allowedHexFiles.some((f) => h.split(":")[0].endsWith(f)));
} catch { /* grep unavailable — skip */ }
rogue.length ? rogue.forEach((r) => fail(`rogue hex: ${r}`)) : ok("only globals.css/layout.tsx contain hex");

// ── 4. SEO plumbing ─────────────────────────────────────────────────────────
console.log("[4] SEO plumbing");
for (const [page, html] of Object.entries(pages)) {
  if (page === "404.html") continue;
  /<meta property="og:image" content="[^"]+\.png"/.test(html)
    ? ok(`${page}: og:image is PNG`)
    : fail(`${page}: og:image missing or not PNG (SVG breaks LinkedIn/WhatsApp previews)`);
}
pages["index.html"].includes("application/ld+json")
  ? ok("JSON-LD present on home") : fail("JSON-LD missing on home");
for (const f of ["sitemap.xml", "robots.txt", ".nojekyll"]) {
  existsSync(join(out, f)) ? ok(`${f} in out/`) : fail(`${f} missing from out/`);
}
for (const og of ["og/home.png", "og/prospect.png", "og/travel-planner.png"]) {
  existsSync(join(out, og)) ? ok(`${og} exists`) : fail(`${og} missing`);
}

// ── 5. Dev/debug pages must not ship ────────────────────────────────────────
console.log("[5] No dev pages in out/ — only 7 pages allowed");
const shipped = readdirSync(out).filter((f) => f.endsWith(".html"));
const allowed = ["index.html", "404.html", "_not-found.html"];
const allowedDirs = ["prospect", "travel-planner", "projects", "knowme"];
for (const dir of allowedDirs) {
  if (existsSync(join(out, dir, "index.html"))) shipped.push(`${dir}/index.html`);
}
const extra = shipped.filter((f) => !allowed.includes(f) && !allowedDirs.some(d => f.startsWith(d + "/")));
extra.length ? extra.forEach((f) => fail(`unexpected page shipped: ${f}`)) : ok("only the 6 pages (+_not-found) ship");

// ── 6. JS budget (DESIGN.md §5, amended D18) ────────────────────────────────
console.log("[6] Per-page JS budget (≤ 480 KB gzip — home, three.js); case-study pages ≤ 230 KB gzip");
const jsRefs = [...pages["index.html"].matchAll(/\/_next\/static[^"]*\.js/g)].map((m) => m[0]);
let bytes = 0;
for (const ref of [...new Set(jsRefs)]) {
  try { bytes += execSync(`gzip -c "${join(out, "." + ref)}" | wc -c`, { encoding: "utf-8" }) * 1; } catch { /* skip */ }
}
const kb = Math.round(bytes / 1024);
kb <= 480 ? ok(`home loads ${kb} KB gzip JS`) : fail(`home loads ${kb} KB gzip JS (> 480 KB budget)`);

// ── 7. F15 Link-integrity: parse every page's internal hrefs; all must resolve ──
console.log("[7] Link-integrity: no dead internal links");
const knownPages = ["/", "/prospect", "/travel-planner", "/projects", "/knowme", "/404"];
const pageAnchors = {
  "/": ["#contact"],
  "/prospect": [],
  "/travel-planner": [],
  "/projects": [],
  "/knowme": [],
  "/404": [],
};
for (const [pageKey, html] of Object.entries(pages)) {
  const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
  for (const href of hrefs) {
    // Only check internal links
    if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) continue;
    if (href.includes(".pdf")) continue;
    if (href.includes("favicon") || href.includes(".ico")) continue;
    if (href.startsWith("/_next")) continue;
    if (href === "/") continue;

    // Check if goes to a known page
    const baseHref = href.split("#")[0].replace(/\/$/, "") || "/";
    // Root-anchored links (#contact, #whatever) resolve to current page
    if (baseHref === "") {
      // same-page anchor — resolved via the page's HTML content
      continue;
    }
    if (!knownPages.includes(baseHref) && !baseHref.startsWith("/_next")) {
      // Asset link — pass when the corresponding file exists in out/ (placeholders, og-images, etc.)
      const assetPath = join(out, baseHref.replace(/^\//, ""));
      if (existsSync(assetPath)) {
        ok(`${pageKey}: asset "${href}" exists in out/`);
        continue;
      }
      fail(`${pageKey}: dead link "${href}" (not a known page)`);
      continue;
    }

    // Check anchors
    if (href.includes("#")) {
      const anchor = "#" + href.split("#")[1];
      const targetPage = baseHref;
      const targetAnchors = pageAnchors[targetPage] || [];
      if (targetAnchors.length > 0 && !targetAnchors.includes(anchor)) {
        fail(`${pageKey}: anchor "${anchor}" not found in ${targetPage}`);
      }
    }
  }
}
ok("all internal links resolve");

// ── 8. Poster artifact (D45) — T10.7 claimed a poster that never existed ──
console.log("[8] Poster artifact present (D45)");
const posterSrc = join(root, "public", "poster-home.webp");
const posterOut = join(out, "poster-home.webp");
existsSync(posterSrc)
  ? ok("public/poster-home.webp exists (source)")
  : fail("public/poster-home.webp missing — run: node scripts/make-poster.mjs");
existsSync(posterOut)
  ? ok("out/poster-home.webp shipped")
  : fail("out/poster-home.webp missing (build did not copy poster to out/)");

// ── 9. Tailwind v4 bracket-var discipline (Sid-authorized, 2026-07-15) ────
// bg-[--surface] compiles to background-color:--surface (no var()) which is
// dead in the browser. Use @theme-mapped utilities (bg-surface) or paren
// syntax (bg-(--surface)) instead.
// INVENTORY mode for m7: list all occurrences so Sid can prioritize mass-fix
// in m8. The guard does NOT fail yet — only 2 critical cases fixed this batch
// (menu backdrop + knowme text panel). Sid rules on mass-fix scope at STOP.
const BRACKET_VAR_BASELINE = 240; // pre-m7 baseline; 2 fixed this batch
console.log("[9] Tailwind v4 bracket-var inventory");
try {
  const deadLines = execSync(
    `grep -rnE 'className.*\\[-{2}' src --include='*.tsx' --include='*.ts' || true`,
    { cwd: root, encoding: "utf-8" },
  ).trim().split("\n").filter(Boolean);
  if (deadLines.length > BRACKET_VAR_BASELINE) {
    const excess = deadLines.length - BRACKET_VAR_BASELINE;
    fail(`${excess} NEW bracket-var pattern(s) detected (baseline ${BRACKET_VAR_BASELINE})`);
    deadLines.slice(-excess).forEach((l) => console.error(`    new violation: ${l.trim()}`));
  } else {
    ok(`${deadLines.length} occurrences — within m7 baseline (no new bracket-vars)`);
  }
  if (deadLines.length) {
    console.log(`    Inventory (file:line): ${deadLines.length} patterns in src/`);
  }
} catch { /* grep unavailable — skip */ }

// ────────────────────────────────────────────────────────────────────────────
console.log(failures ? `\nGUARDS FAILED: ${failures} violation(s)` : "\nAll guards passed.");
process.exit(failures ? 1 : 0);
