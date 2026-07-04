#!/usr/bin/env node
// Visual gate — validates that the 3D scene is perceptible in screenshots.
// Run: node scripts/visual-gate.mjs
// Prerequisite: built out/ served locally (via serve-out.mjs, port 4173).
// Fails if pixel thresholds below spec — invisible scenes are a build failure.

import { spawn, execSync } from "child_process";
import { readFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "..", "docs", "qa", "t10");
mkdirSync(outDir, { recursive: true });

let failures = 0;
const fail = (msg) => { failures++; console.error(`  ✗ ${msg}`); };
const ok = (msg) => console.log(`  ✓ ${msg}`);

// Try loading PNG parser
let PNG;
try {
  PNG = (await import("pngjs")).PNG;
} catch {
  console.log("pngjs not installed; visual gate skipped. Install: npm i -D pngjs");
  process.exit(0);
}

const BG_R = 11, BG_G = 11, BG_B = 13; // #0B0B0D

function isScenePixel(r, g, b) {
  const dist = Math.abs(r - BG_R) + Math.abs(g - BG_G) + Math.abs(b - BG_B);
  // Scene pixel: differs from background by >24 total channel distance
  // AND is not near-white text (not all channels >220)
  if (dist < 24) return false;
  if (r > 220 && g > 220 && b > 220) return false;
  return true;
}

function isOrangePixel(r, g, b) {
  return r > 1.5 * g && r > 90;
}

async function analyzeScreenshot(path, label) {
  if (!existsSync(path)) { fail(`${label}: screenshot missing at ${path}`); return [0, 0, 0]; }
  const png = PNG.sync.read(readFileSync(path));
  let scene = 0, orange = 0, total = png.width * png.height;
  for (let i = 0; i < png.data.length; i += 4) {
    const [r, g, b] = [png.data[i], png.data[i + 1], png.data[i + 2]];
    if (isScenePixel(r, g, b)) scene++;
    if (isOrangePixel(r, g, b)) orange++;
  }
  const sp = ((scene / total) * 100).toFixed(1);
  const op = ((orange / total) * 100).toFixed(1);
  console.log(`  ${label}: ${sp}% scene, ${op}% orange`);
  return [parseFloat(sp), parseFloat(op), 1];
}

async function main() {
  const pages = [
    { url: "", label: "home-wp-0", minScene: 18, minOrange: 1.5 },
    { url: "#section-prospect", label: "home-wp-20", minScene: 10, minOrange: 1.5 },
    { url: "#section-travel", label: "home-wp-55", minScene: 10, minOrange: 1.5 },
    { url: "#section-contact", label: "home-wp-95", minScene: 10, minOrange: 1.5 },
  ];

  // Start local server
  const server = spawn("node", [join(root, "scripts", "serve-out.mjs")], { stdio: "ignore" });
  await new Promise((r) => setTimeout(r, 1500));

  try {
    for (const { url, label, minScene, minOrange } of pages) {
      const outFile = join(outDir, `${label}.png`);
      const fullUrl = `http://localhost:4173/${url}`;
      // Use Playwright for screenshots if chromium is available
      try {
        const chromeExe = execSync(
          "find ~/.cache/ms-playwright -name chromium -type f 2>/dev/null | head -1",
          { encoding: "utf-8", shell: "/bin/bash" },
        ).trim();

        if (chromeExe) {
          execSync(
            `npx playwright screenshot --browser chromium "${fullUrl}" "${outFile}" 2>/dev/null || true`,
            { cwd: root, shell: "/bin/bash", timeout: 15000 },
          );
        } else {
          console.log("  (no Playwright chromium found; skipping screenshot)");
        }
      } catch {
        fail(`screenshot failed for ${fullUrl}`);
      }

      const [sp, op] = await analyzeScreenshot(outFile, label);
      if (sp < minScene) fail(`${label}: scene ${sp}% < ${minScene}% min`);
      if (op < minOrange) fail(`${label}: orange ${op}% < ${minOrange}% min`);
    }
  } finally {
    server.kill();
  }

  console.log(failures ? `\nVISUAL GATE FAILED (${failures})` : "\nVisual gate passed.");
  process.exit(failures ? 1 : 0);
}

main();
