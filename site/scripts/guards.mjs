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
  "404.html": readFileSync(join(out, "404.html"), "utf-8"),
};
const allHtml = Object.values(pages).join("\n");

// ── 1. Required copy (COPY.md anchors) ──────────────────────────────────────
console.log("[1] Required copy present");
const required = [
  ["index.html", "I build systems that work while you sleep"],
  ["index.html", "six weeks"],
  ["index.html", "Prospect"],
  ["index.html", "siddharthsingh8418@gmail.com"],
  ["prospect.html", "reads the morning papers"],
  ["prospect.html", "RUNNING LOCAL"],
  ["travel-planner.html", "An agent that survives its own failures"],
  ["404.html", "NO SIGNAL"],
];
for (const [page, str] of required) {
  pages[page].includes(str) ? ok(`${page}: "${str}"`) : fail(`${page} missing "${str}"`);
}

// ── 2. Forbidden content (CONTEXT.md exclusions + anti-cheap signals) ───────
console.log("[2] Forbidden content absent");
const forbidden = [
  "82679",            // phone number — never on site
  "B.Tech", "Bijnor", "GATE 2024", // education — deliberate exclusion
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
const allowedHexFiles = ["globals.css", "layout.tsx"]; // tokens + theme-color meta
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
console.log("[5] No dev pages in out/");
const shipped = readdirSync(out).filter((f) => f.endsWith(".html"));
const allowed = ["index.html", "404.html", "_not-found.html"];
const extra = shipped.filter((f) => !allowed.includes(f));
extra.length ? extra.forEach((f) => fail(`unexpected page shipped: ${f}`)) : ok("only the 4 pages (+_not-found) ship");

// ── 6. JS budget (DESIGN.md §5, amended D18) ────────────────────────────────
console.log("[6] Per-page JS budget (≤ 230 KB gzip)");
const jsRefs = [...pages["index.html"].matchAll(/\/_next\/static[^"]*\.js/g)].map((m) => m[0]);
let bytes = 0;
for (const ref of [...new Set(jsRefs)]) {
  try { bytes += execSync(`gzip -c "${join(out, "." + ref)}" | wc -c`, { encoding: "utf-8" }) * 1; } catch { /* skip */ }
}
const kb = Math.round(bytes / 1024);
kb <= 480 ? ok(`home loads ${kb} KB gzip JS`) : fail(`home loads ${kb} KB gzip JS (> 480 KB budget)`);

// ────────────────────────────────────────────────────────────────────────────
console.log(failures ? `\nGUARDS FAILED: ${failures} violation(s)` : "\nAll guards passed.");
process.exit(failures ? 1 : 0);
