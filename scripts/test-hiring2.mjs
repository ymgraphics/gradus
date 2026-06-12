import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../.env.local");
const envContent = readFileSync(envPath, "utf-8");
const env = Object.fromEntries(
  envContent.split("\n").filter(l => l.includes("=")).map(l => l.split("=").map(s => s.trim()))
);
const TOKEN = env.NOTION_TOKEN;
const databaseId = "33693c20-8c8e-80f3-8402-f27f4589be2a";

async function run() {
  const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Notion-Version": "2025-09-03",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({})
  });
  const data = await res.json();
  if (res.ok) {
    console.log("Success! Properties example:");
    if (data.results.length > 0) {
      console.log(JSON.stringify(data.results[0].properties, null, 2));
    } else {
      console.log("Empty results array.");
    }
  } else {
    console.error("Failed:", data);
  }
}
run();
