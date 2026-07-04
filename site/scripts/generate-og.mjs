#!/usr/bin/env node
// Build script: generate OG PNG images from SVGs at build time.
// Run: node scripts/generate-og.mjs
// Falls back gracefully if @resvg/resvg-js is not installed.
// The SVGs in public/og/ serve as the primary OG images regardless.

import { writeFileSync, readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public", "og");
const pages = ["home", "prospect", "travel-planner"];

async function main() {
  console.log("OG image generation — SVGs are primary; PNG conversion optional.");

  for (const page of pages) {
    const svgPath = join(publicDir, `${page}.svg`);
    if (existsSync(svgPath)) {
      console.log(`  ✓ ${page}.svg exists`);
    } else {
      console.log(`  ✗ ${page}.svg MISSING`);
    }
  }

  // Try PNG conversion if @resvg/resvg-js is available
  try {
    const { renderAsync } = await import("@resvg/resvg-js");
    for (const page of pages) {
      const svgPath = join(publicDir, `${page}.svg`);
      const pngPath = join(publicDir, `${page}.png`);
      if (!existsSync(svgPath)) continue;
      const svg = readFileSync(svgPath, "utf-8");
      const png = await renderAsync(svg, {
        font: { loadSystemFonts: true },
      });
      writeFileSync(pngPath, png.asPng());
      console.log(`  ✓ ${page}.png generated`);
    }
  } catch {
    console.log("  ⚠ @resvg/resvg-js not available; SVGs only. Install for PNG output.");
  }
}

main();
