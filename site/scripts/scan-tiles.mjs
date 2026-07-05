#!/usr/bin/env node
// Grid tiles manifest — scanned at build time from public/tiles/.
// Generates site/src/data/tiles-manifest.json with tile paths.

import { readdirSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const tilesDir = join(root, "public", "tiles");
const outFile = join(root, "src", "data", "tiles-manifest.json");

const tiles = [];

if (existsSync(tilesDir)) {
  const files = readdirSync(tilesDir);
  for (const f of files) {
    if (/\.(png|jpg|jpeg|webp|avif)$/i.test(f)) {
      tiles.push(`/tiles/${f}`);
    }
  }
}

writeFileSync(outFile, JSON.stringify({ tiles }, null, 2));
console.log(`tiles-manifest: ${tiles.length} tiles found in public/tiles/`);
