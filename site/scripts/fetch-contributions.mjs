#!/usr/bin/env node
// Build script: fetch Sid's GitHub contribution count and write src/data/contributions.json.
// Uses GITHUB_TOKEN / GH_TOKEN (GitHub Actions provides GITHUB_TOKEN automatically).
// Policy (COPY.md): NEVER print an exact count — round DOWN to nearest 100 → "N00+".
// On any failure: write { count: null } so the UI renders the "GitHub →" fallback.

import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, "..", "src", "data", "contributions.json");

const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;

async function main() {
  if (!token) {
    console.log("contributions: no GITHUB_TOKEN/GH_TOKEN — writing null (fallback UI).");
    writeFileSync(outPath, JSON.stringify({ count: null, display: "" }, null, 2) + "\n");
    return;
  }
  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `query { user(login: "Siddharthsinghkumar") { contributionsCollection { contributionCalendar { totalContributions } } } }`,
      }),
    });
    if (!res.ok) throw new Error(`GraphQL HTTP ${res.status}`);
    const json = await res.json();
    const total =
      json?.data?.user?.contributionsCollection?.contributionCalendar
        ?.totalContributions;
    if (typeof total !== "number" || total < 100) throw new Error(`bad total: ${total}`);
    const floored = Math.floor(total / 100) * 100;
    const display = `${floored}+`;
    writeFileSync(
      outPath,
      JSON.stringify({ count: floored, display }, null, 2) + "\n",
    );
    console.log(`contributions: ${total} → "${display}" written.`);
  } catch (err) {
    console.log(`contributions: fetch failed (${err.message}) — writing null (fallback UI).`);
    writeFileSync(outPath, JSON.stringify({ count: null, display: "" }, null, 2) + "\n");
  }
}

main();
