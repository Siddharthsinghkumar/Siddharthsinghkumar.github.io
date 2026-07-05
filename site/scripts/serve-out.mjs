#!/usr/bin/env node
// Minimal static server for out/ — used by Playwright tests (no extra deps).
// Resolves extensionless URLs like GitHub Pages does (/prospect → prospect.html).

import { createServer } from "http";
import { readFileSync, existsSync, statSync } from "fs";
import { join, extname, normalize } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const out = join(dirname(fileURLToPath(import.meta.url)), "..", "out");
const port = process.env.PORT || 4173;

const types = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml",
  ".ico": "image/x-icon", ".txt": "text/plain", ".xml": "application/xml",
  ".woff2": "font/woff2", ".pdf": "application/pdf",
};

createServer((req, res) => {
  const isHead = req.method === "HEAD";
  let path = normalize(decodeURIComponent(req.url.split("?")[0])).replace(/^(\.\.[/\\])+/, "");
  let file = join(out, path);
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  if (!existsSync(file) && existsSync(file + ".html")) file += ".html";
  if (!existsSync(file)) {
    file = join(out, "404.html");
    res.writeHead(404, { "Content-Type": "text/html" });
    if (!isHead) res.end(existsSync(file) ? readFileSync(file) : "Not found");
    else res.end();
    return;
  }
  const contentType = types[extname(file)] || "application/octet-stream";
  if (isHead) {
    const stats = statSync(file);
    res.writeHead(200, { "Content-Type": contentType, "Content-Length": stats.size });
    res.end();
  } else {
    res.writeHead(200, { "Content-Type": contentType });
    res.end(readFileSync(file));
  }
}).listen(port, () => console.log(`serving out/ on http://localhost:${port}`));
