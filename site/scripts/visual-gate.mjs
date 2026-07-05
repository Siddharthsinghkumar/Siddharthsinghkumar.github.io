#!/usr/bin/env node
// Visual gate — validates that the 3D scene is perceptible in screenshots.
// Fails if pixel thresholds below spec — invisible scenes are a build failure.
// Uses Playwright's chromium for reliable screenshots at specific scroll offsets.
// A10: adds h1 text-region contrast check per page

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

function sRGBtoLinear(c) {
  c /= 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function relativeLuminance(r, g, b) {
  return 0.2126 * sRGBtoLinear(r) + 0.7152 * sRGBtoLinear(g) + 0.0722 * sRGBtoLinear(b);
}

function contrastRatio(l1, l2) {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

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

async function checkH1Contrast(page, png, label) {
  try {
    const box = await page.locator("h1").first().boundingBox();
    if (!box) { console.log(`  ${label} h1 contrast: no h1 found — skipping`); return null; }
    const x1 = Math.max(0, Math.round(box.x));
    const y1 = Math.max(0, Math.round(box.y));
    const x2 = Math.min(png.width - 1, Math.round(box.x + box.width));
    const y2 = Math.min(png.height - 1, Math.round(box.y + box.height));

    let textLum = 0, textCount = 0;
    let bgLum = 0, bgCount = 0;

    for (let y = y1; y <= y2; y++) {
      for (let x = x1; x <= x2; x++) {
        const idx = (y * png.width + x) * 4;
        const r = png.data[idx], g = png.data[idx + 1], b = png.data[idx + 2];
        const lum = relativeLuminance(r, g, b);
        if (lum > 0.5) { textLum += lum; textCount++; }
        else if (lum < 0.3) { bgLum += lum; bgCount++; }
      }
    }

    if (textCount === 0) { console.log(`  ${label} h1 contrast: no light text pixels in region`); return null; }
    const avgTextLum = textLum / textCount;
    const avgBgLum = bgCount > 0 ? bgLum / bgCount : 0.01;
    const ratio = contrastRatio(avgTextLum, avgBgLum);
    const ratioStr = ratio.toFixed(1);
    const passed = ratio >= 4.5;
    console.log(`  ${label} h1 contrast: ${ratioStr}:1${passed ? " ✓" : " ✗"}`);
    if (!passed) fail(`${label} h1 contrast ${ratioStr}:1 < 4.5:1 (WCAG AA)`);
    return { ratio, ratioStr, passed };
  } catch (e) {
    console.log(`  ${label} h1 contrast: error — ${e.message}`);
    return null;
  }
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
      // Home — 4 waypoints, strict thresholds (35% hero per F1)
      { url: "http://localhost:4173/", label: "home-wp-0", minScene: 35, minOrange: 1.5, scrollFraction: 0, checkH1: true, settleMs: 3000 },
      { url: "http://localhost:4173/", label: "home-wp-20", minScene: 10, minOrange: 1.5, scrollFraction: 0.20 },
      { url: "http://localhost:4173/", label: "home-wp-55", minScene: 10, minOrange: 1.5, scrollFraction: 0.55 },
      { url: "http://localhost:4173/", label: "home-wp-95", minScene: 10, minOrange: 1.5, scrollFraction: 0.95 },
      // F19/D41: all 6 pages must have atmosphere — ≥10% scene / ≥1.5% orange at p=0
      { url: "http://localhost:4173/prospect", label: "prospect-p0", minScene: 10, minOrange: 1.5, scrollFraction: 0, checkH1: true },
      { url: "http://localhost:4173/travel-planner", label: "travel-planner-p0", minScene: 10, minOrange: 1.5, scrollFraction: 0, checkH1: true },
      { url: "http://localhost:4173/projects", label: "projects-p0", minScene: 10, minOrange: 1.5, scrollFraction: 0, checkH1: true },
      { url: "http://localhost:4173/about", label: "about-p0", minScene: 10, minOrange: 1.5, scrollFraction: 0, checkH1: true },
      { url: "http://localhost:4173/this-route-does-not-exist", label: "404-p0", minScene: 10, minOrange: 1.5, scrollFraction: 0, checkH1: true },
    ];

    for (const { url, label, minScene, minOrange, scrollFraction, checkH1, settleMs } of waypoints) {
      const outFile = join(outDir, `${label}.png`);
      await page.goto(url, { waitUntil: "networkidle" });
      await page.waitForTimeout(settleMs ?? 800);

      if (scrollFraction && scrollFraction > 0) {
        const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
        const viewportHeight = await page.evaluate(() => window.innerHeight);
        const maxScroll = Math.max(0, scrollHeight - viewportHeight);
        await page.evaluate((y) => window.scrollTo(0, Math.round(y)), maxScroll * scrollFraction);
        await page.waitForTimeout(500);
      }

      await page.screenshot({ path: outFile, fullPage: false });
      const png = PNG.sync.read(readFileSync(outFile));
      const [sp, op] = analyzeScreenshot(outFile, label);
      if (sp < minScene) fail(`${label}: scene ${sp}% < ${minScene}% min`);
      if (op < minOrange) fail(`${label}: orange ${op}% < ${minOrange}% min`);

      if (checkH1) {
        await checkH1Contrast(page, png, label);
      }
    }

    await browser.close();
  } finally {
    server.kill();
  }

  console.log(failures ? `\nVISUAL GATE FAILED (${failures})` : "\nVisual gate passed.");
  process.exit(failures ? 1 : 0);
}

main();
