import { chromium } from "playwright-core";
import { mkdirSync } from "fs";

const OUT = "/tmp/knowme-repro";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await ctx.newPage();

const logs = [];
page.on("console", (m) => logs.push(`[console.${m.type()}] ${m.text()}`));
page.on("pageerror", (e) => logs.push(`[pageerror] ${e.message}`));
page.on("requestfailed", (r) => logs.push(`[requestfailed] ${r.url()} :: ${r.failure()?.errorText}`));

// throttle to stretch the cold-load race (card.glb 2.4MB + rapier wasm)
const cdp = await ctx.newCDPSession(page);
await cdp.send("Network.enable");
await cdp.send("Network.emulateNetworkConditions", {
  offline: false, latency: 80,
  downloadThroughput: (6 * 1024 * 1024) / 8,
  uploadThroughput: (2 * 1024 * 1024) / 8,
});

await page.goto("http://localhost:4173/knowme/", { waitUntil: "commit" });
for (const t of [1000, 2000, 4000, 8000, 15000]) {
  await page.waitForTimeout(t === 1000 ? 1000 : t - [1000,2000,4000,8000,15000][[1000,2000,4000,8000,15000].indexOf(t)-1]);
  await page.screenshot({ path: `${OUT}/cold-${t}ms.png` });
}

// who is on top over the left 30%? probe stacking at x=20%, y=55%
const stack = await page.evaluate(() => {
  const els = document.elementsFromPoint(0.20 * innerWidth, 0.55 * innerHeight);
  return els.slice(0, 8).map((el) => {
    const cs = getComputedStyle(el);
    return `${el.tagName}.${(el.className && el.className.toString ? el.className.toString() : "").slice(0, 60)} z:${cs.zIndex} pe:${cs.pointerEvents} op:${cs.opacity} bf:${cs.backdropFilter} bg:${cs.backgroundColor}`;
  });
});
console.log("STACK AT (20%w, 55%h):"); stack.forEach((s) => console.log("  " + s));

const canvasBox = await page.evaluate(() => {
  const cvs = [...document.querySelectorAll("canvas")].map((c) => {
    const r = c.getBoundingClientRect();
    return `${c.width}x${c.height} rect(l:${Math.round(r.left)} t:${Math.round(r.top)} w:${Math.round(r.width)} h:${Math.round(r.height)}) parentZ:${getComputedStyle(c.parentElement.parentElement).zIndex}`;
  });
  return cvs;
});
console.log("CANVASES:"); canvasBox.forEach((s) => console.log("  " + s));

// warm reload comparison
await page.reload({ waitUntil: "load" });
await page.waitForTimeout(5000);
await page.screenshot({ path: `${OUT}/warm-5000ms.png` });

console.log("\nLOGS:"); logs.forEach((l) => console.log("  " + l));
await browser.close();
