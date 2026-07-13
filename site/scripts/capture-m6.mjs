import { spawn } from "child_process";
import { mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "..", "docs", "qa", "m6");
mkdirSync(outDir, { recursive: true });

async function main() {
  let chromium;
  try {
    ({ chromium } = await import("@playwright/test"));
  } catch {
    try {
      ({ chromium } = await import("playwright"));
    } catch {
      console.log("Playwright not available.");
      process.exit(1);
    }
  }

  const server = spawn("node", ["scripts/serve-out.mjs"], {
    cwd: root,
    stdio: "pipe",
  });

  // Wait for server to be ready
  await new Promise((resolve) => {
    server.stdout.on("data", (data) => {
      if (data.toString().includes("4173")) resolve(true);
    });
    setTimeout(resolve, 8000);
  });

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  // Prospect hero — wait for settle
  await page.goto("http://localhost:4173/prospect/", { waitUntil: "networkidle" });
  await new Promise((r) => setTimeout(r, 6000));
  await page.screenshot({ path: join(outDir, "prospect-hero-p0.png"), fullPage: false });
  console.log("prospect-hero-p0 captured");

  // Travel planner hero
  await page.goto("http://localhost:4173/travel-planner/", { waitUntil: "networkidle" });
  await new Promise((r) => setTimeout(r, 6000));
  await page.screenshot({ path: join(outDir, "travel-planner-hero-p0.png"), fullPage: false });
  console.log("travel-planner-hero-p0 captured");

  // Knowme cold (hard load)
  await page.goto("http://localhost:4173/knowme/", { waitUntil: "networkidle" });
  await new Promise((r) => setTimeout(r, 6000));
  await page.screenshot({ path: join(outDir, "knowme-cold.png"), fullPage: false });
  console.log("knowme-cold captured");

  // Knowme warm (reload)
  await page.reload({ waitUntil: "networkidle" });
  await new Promise((r) => setTimeout(r, 6000));
  await page.screenshot({ path: join(outDir, "knowme-warm.png"), fullPage: false });
  console.log("knowme-warm captured");

  // Knowme drag-left (simulate dragging card left)
  // Click and drag on the lanyard area (~75% viewport width, 50% height → 20% viewport)
  const cardX = Math.round(1280 * 0.75);
  const cardY = 400;
  await page.mouse.move(cardX, cardY);
  await page.mouse.down();
  // Drag left to ~5% viewport
  const targetX = Math.round(1280 * 0.05);
  for (let i = 0; i < 30; i++) {
    await page.mouse.move(
      cardX - ((cardX - targetX) * i) / 30,
      cardY + Math.sin(i * 0.5) * 20
    );
    await new Promise((r) => setTimeout(r, 50));
  }
  await page.mouse.up();
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: join(outDir, "knowme-drag-left.png"), fullPage: false });
  console.log("knowme-drag-left captured");

  await browser.close();
  server.kill();
  console.log("All evidence captured to", outDir);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
