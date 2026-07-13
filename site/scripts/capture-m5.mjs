import { spawn } from "child_process";
import { readFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "..", "docs", "qa", "m5");
mkdirSync(outDir, { recursive: true });

async function main() {
  let chromium;
  try {
    ({ chromium } = await import("@playwright/test"));
  } catch {
    try {
      ({ chromium } = await import("playwright"));
    } catch {
      console.log("Playwright not available; visual gate skipped.");
      process.exit(1);
    }
  }

  console.log("Starting serve-out.mjs...");
  const server = spawn("node", [join(root, "scripts", "serve-out.mjs")], { stdio: "ignore" });
  await new Promise((r) => setTimeout(r, 2500));

  try {
    const browser = await chromium.launch({ headless: true });
    
    // Desktop captures
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

    const captures = [
      { url: "http://localhost:4173/", label: "home-p0" },
      { url: "http://localhost:4173/prospect", label: "prospect-p0" },
      { url: "http://localhost:4173/travel-planner", label: "travel-planner-p0" },
      { url: "http://localhost:4173/projects", label: "projects-p0" },
      { url: "http://localhost:4173/knowme", label: "knowme-p0" },
      { url: "http://localhost:4173/404", label: "404-p0" },
      { url: "http://localhost:4173/prospect", label: "hero-prospect-fullbleed" },
      { url: "http://localhost:4173/travel-planner", label: "hero-travelplanner-fullbleed" },
    ];

    for (const { url, label } of captures) {
      console.log(`Capturing ${label}...`);
      await page.goto(url, { waitUntil: "networkidle" });
      await page.waitForTimeout(5000); // >= 5s wait per N23
      const outFile = join(outDir, `${label}.png`);
      await page.screenshot({ path: outFile, fullPage: false });
    }
    
    await browser.close();

    // Lanyard Fast/Slow series
    // Fast load
    console.log(`Capturing lanyard-fast...`);
    const browserFast = await chromium.launch({ headless: true });
    const pageFast = await browserFast.newPage({ viewport: { width: 1280, height: 800 } });
    await pageFast.goto("http://localhost:4173/knowme", { waitUntil: "networkidle" });
    await pageFast.waitForTimeout(5000); // 5s settle
    await pageFast.screenshot({ path: join(outDir, "lanyard-fast.png"), fullPage: false });
    await browserFast.close();

    // Slow load (Slow 4G)
    console.log(`Capturing lanyard-slow series...`);
    const browserSlow = await chromium.launch({ headless: true });
    const contextSlow = await browserSlow.newContext();
    const pageSlow = await contextSlow.newPage();
    const cdpSession = await contextSlow.newCDPSession(pageSlow);
    
    // Emulate Slow 4G
    await cdpSession.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: 500 * 1024 / 8 * 0.8, // 500 kbps
      uploadThroughput: 500 * 1024 / 8 * 0.8,
      latency: 400 * 5,
    });
    
    // We want to capture the fallback visible during load
    await pageSlow.goto("http://localhost:4173/knowme", { timeout: 60000 });
    await pageSlow.waitForTimeout(2000);
    await pageSlow.screenshot({ path: join(outDir, "lanyard-slow-fallback.png"), fullPage: false });
    
    // removed
    await pageSlow.waitForTimeout(5000);
    await pageSlow.screenshot({ path: join(outDir, "lanyard-slow-settled.png"), fullPage: false });
    await browserSlow.close();

  } finally {
    server.kill();
  }

  console.log("All captures done.");
}

main();
