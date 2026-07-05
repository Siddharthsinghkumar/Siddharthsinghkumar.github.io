#!/usr/bin/env node
// Visual gate — validates that the 3D scene is perceptible in screenshots.
// Fails if pixel thresholds below spec — invisible scenes are a build failure.
// Uses Playwright's chromium for reliable screenshots at specific scroll offsets.

import { spawn } from "child_process";
import { readFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "..", "docs", "qa", "t10");
mkdirSync(outDir, { recursive: true });

let failures = 0;
const fail = (msg) => { failures++; console.error(`  ✗ ${msg}`); };
const ok = (msg) => console.log(`  ✓ ${msg}`);

let PNG;
try {
  PNG = (await import("pngjs")).PNG;
} catch {
  console.log("pngjs not installed; visual gate skipped.");
  process.exit(0);
}

const BG_R = 11, BG_G = 11, BG_B = 13;

function isScenePixel(r, g, b) {
  const dist = Math.abs(r - BG_R) + Math.abs(g - BG_G) + Math.abs(b - BG_B);
  if (dist < 24) return false;
  if (r > 220 && g > 220 && b > 220) return false;
  return true;
}

function isOrangePixel(r, g, b) {
  return r > 1.5 * g && r > 90;
}

function analyzeScreenshot(path, label) {
  if (!existsSync(path)) { fail(`${label}: screenshot missing`); return [0, 0]; }
  const png = PNG.sync.read(readFileSync(path));
  let scene = 0, orange = 0, total = png.width * png.height;
  for (let i = 0; i < png.data.length; i += 4) {
    const r = png.data[i], g = png.data[i + 1], b = png.data[i + 2];
    if (isScenePixel(r, g, b)) scene++;
    if (isOrangePixel(r, g, b)) orange++;
  }
  const sp = ((scene / total) * 100).toFixed(1);
  const op = ((orange / total) * 100).toFixed(1);
  console.log(`  ${label}: ${sp}% scene, ${op}% orange`);
  return [parseFloat(sp), parseFloat(op)];
}

async function main() {
  let chromium;
  try {
    ({ chromium } = await import("@playwright/test"));
  } catch {
    try {
      ({ chromium } = await import("playwright"));
    } catch {
      console.log("Playwright not available; visual gate skipped.");
      process.exit(0);
    }
  }

  const server = spawn("node", [join(root, "scripts", "serve-out.mjs")], { stdio: "ignore" });
  await new Promise((r) => setTimeout(r, 2500));

  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

    const waypoints = [
      { url: "http://localhost:4173/", label: "home-wp-0", minScene: 35, minOrange: 1.5, scrollFraction: 0 },
      { url: "http://localhost:4173/", label: "home-wp-20", minScene: 10, minOrange: 1.5, scrollFraction: 0.20 },
      { url: "http://localhost:4173/", label: "home-wp-55", minScene: 10, minOrange: 1.5, scrollFraction: 0.55 },
      { url: "http://localhost:4173/", label: "home-wp-95", minScene: 10, minOrange: 1.5, scrollFraction: 0.95 },
    ];

    for (const { url, label, minScene, minOrange, scrollFraction } of waypoints) {
      const outFile = join(outDir, `${label}.png`);
      await page.goto(url, { waitUntil: "networkidle" });
      await page.waitForTimeout(800);

      if (scrollFraction && scrollFraction > 0) {
        const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
        const viewportHeight = await page.evaluate(() => window.innerHeight);
        const maxScroll = Math.max(0, scrollHeight - viewportHeight);
        await page.evaluate((y) => window.scrollTo(0, Math.round(y)), maxScroll * scrollFraction);
        await page.waitForTimeout(500);
      }

      await page.screenshot({ path: outFile, fullPage: false });
      const [sp, op] = analyzeScreenshot(outFile, label);
      if (sp < minScene) fail(`${label}: scene ${sp}% < ${minScene}% min`);
      if (op < minOrange) fail(`${label}: orange ${op}% < ${minOrange}% min`);
    }

    await browser.close();
  } finally {
    server.kill();
  }

  console.log(failures ? `\nVISUAL GATE FAILED (${failures})` : "\nVisual gate passed.");
  process.exit(failures ? 1 : 0);
}

main();
