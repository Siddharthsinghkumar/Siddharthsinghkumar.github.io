#!/usr/bin/env node
// B1 / D45 — Poster as a HARD artifact.
// Serves the built out/, loads the home hero at 1600x900, hides DOM text but
// keeps the 3D canvas + CSS atmosphere, screenshots, converts to webp (sharp)
// at site/public/poster-home.webp (target <=120 KB). Used as the reduced-motion
// / WebGL-fail / no-JS hero background.
//
// Note on text hiding: the spec suggested `main { opacity: 0 }`, but the R3F
// canvas is nested inside <main> (layout.tsx wraps children in <main>), so that
// would hide the scene too. We instead hide text-bearing tags + nav/footer,
// keeping the fixed canvas and the atmosphere (div/svg) fully visible.

import { spawn } from "child_process";
import { existsSync, mkdirSync, rmSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "out");
const posterPath = join(root, "public", "poster-home.webp");
const tmpPng = join(root, "public", "poster-home.tmp.png");

if (!existsSync(out)) {
  console.error("out/ missing — run `npm run build` first.");
  process.exit(1);
}

let sharp;
try {
  sharp = (await import("sharp")).default;
} catch {
  console.error("sharp not installed — run `npm install` (devDependency).");
  process.exit(1);
}

let chromium;
try {
  ({ chromium } = await import("@playwright/test"));
} catch {
  try {
    ({ chromium } = await import("playwright"));
  } catch {
    console.error("Playwright not available.");
    process.exit(1);
  }
}

const server = spawn("node", [join(root, "scripts", "serve-out.mjs")], {
  stdio: "ignore",
});
await new Promise((r) => setTimeout(r, 2500));

try {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });

  // Skip the intro/loading overlay (sessionStorage repeat-visit flag) so we
  // capture the assembled scene, not the GooeyLoader overlay.
  await page.addInitScript(() => sessionStorage.setItem("intro-shown", "1"));

  await page.goto("http://localhost:4173/", { waitUntil: "networkidle" });

  // Wait for the WebGL canvas to mount (rIC-gated, <=1.5s) and render, then settle.
  await page.waitForSelector("canvas", { timeout: 5000 });
  await page.waitForTimeout(2500);

  // Hide DOM text + chrome; keep the fixed canvas + atmosphere layers (div/svg).
  await page.addStyleTag({
    content: `
      nav, header, footer { opacity: 0 !important; }
      main h1, main h2, main h3, main h4, main p, main a, main button,
      main span, main li, main strong, main em, main code, main label {
        opacity: 0 !important;
      }
    `,
  });
  await page.waitForTimeout(300);

  await page.screenshot({ path: tmpPng, type: "png", fullPage: false });

  // Encode to webp, targeting <=120 KB. Drop quality if over budget.
  let quality = 70;
  let buf = await sharp(tmpPng).webp({ quality }).toBuffer();
  while (buf.length > 120 * 1024 && quality > 30) {
    quality -= 10;
    buf = await sharp(tmpPng).webp({ quality }).toBuffer();
  }

  mkdirSync(join(root, "public"), { recursive: true });
  const { writeFileSync } = await import("fs");
  writeFileSync(posterPath, buf);
  rmSync(tmpPng, { force: true });

  const kb = Math.round(buf.length / 1024);
  console.log(`poster written: public/poster-home.webp (${kb} KB, webp q${quality})`);
  if (buf.length > 120 * 1024) {
    console.warn(`  ⚠ over 120 KB budget (${kb} KB) — scene may be busy; acceptable but note it.`);
  }

  await browser.close();
} finally {
  server.kill();
}
