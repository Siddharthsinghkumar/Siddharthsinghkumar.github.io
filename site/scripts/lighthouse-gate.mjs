#!/usr/bin/env node
// Lighthouse merge gate — runs against the built out/ with OBSERVED (devtools)
// throttling and asserts DESIGN.md §5 budgets. Fails (exit 1) below thresholds.
// Local: node scripts/lighthouse-gate.mjs   (Chrome via Playwright or system)

import { spawn, execSync } from "child_process";
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const THRESHOLDS = { performance: 90, accessibility: 95, seo: 95 };
const HOME_PERF = 85; // home page: 3D scene buys 5 perf points (D30)
const PAGES = ["", "prospect/", "travel-planner/"];

// Find a Chrome: playwright cache → CHROME_PATH env → system chrome
function findChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  try {
    const hit = execSync(
      "find ~/.cache/ms-playwright -name chrome -type f 2>/dev/null | head -1",
      { encoding: "utf-8", shell: "/bin/bash" },
    ).trim();
    if (hit) return hit;
  } catch { /* fall through */ }
  return undefined; // let lighthouse find system chrome
}

const server = spawn("node", [join(root, "scripts", "serve-out.mjs")], { stdio: "ignore" });
await new Promise((r) => setTimeout(r, 1200));

let failures = 0;
try {
  const chrome = findChrome();
  for (const page of PAGES) {
    const outJson = join("/tmp", `lh-gate-${page.replace("/", "") || "home"}.json`);
    const args = [
      "--yes", "lighthouse", `http://localhost:4173/${page}`,
      "--throttling-method=devtools",
      "--only-categories=performance,accessibility,seo",
      "--output=json", `--output-path=${outJson}`, "--quiet",
      `--chrome-flags=--headless=new --no-sandbox`,
    ];
    if (chrome) args.push(`--chrome-path=${chrome}`);
    execSync(`npx ${args.map((a) => `'${a}'`).join(" ")}`, { stdio: "inherit", shell: "/bin/bash" });
    if (!existsSync(outJson)) { failures++; console.error(`✗ /${page}: no report`); continue; }
    const r = JSON.parse(readFileSync(outJson, "utf-8"));
    for (const [cat, min] of Object.entries(THRESHOLDS)) {
      const score = Math.round((r.categories[cat]?.score ?? 0) * 100);
      const effectiveMin = (page === "" && cat === "performance") ? HOME_PERF : min;
      const okay = score >= effectiveMin;
      if (!okay) failures++;
      console.log(`${okay ? "✓" : "✗"} /${page || ""} ${cat}: ${score} (min ${effectiveMin})`);
    }
    const cls = r.audits["cumulative-layout-shift"]?.numericValue ?? 1;
    if (cls > 0.05) { failures++; console.error(`✗ /${page}: CLS ${cls} > 0.05`); }
    else console.log(`✓ /${page || ""} CLS: ${cls.toFixed(3)}`);
  }
} finally {
  server.kill();
}
console.log(failures ? `\nLIGHTHOUSE GATE FAILED (${failures})` : "\nLighthouse gate passed.");
process.exit(failures ? 1 : 0);
