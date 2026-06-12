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

async function checkDb(id) {
  try {
    const res = await fetch(`https://api.notion.com/v1/databases/${id}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({})
    });
    const data = await res.json();
    if (res.ok) {
      console.log(`✅ DB Found: ${id}`);
      if (data.results.length > 0) {
        console.log("Sample Properties:", Object.keys(data.results[0].properties));
      } else {
        console.log("Empty results.");
      }
    } else {
      console.log(`❌ Failed ${id}:`, data.message);
    }
  } catch (e) {
    console.error("Error connecting:", e);
  }
}

async function run() {
  await checkDb("33693c20-8c8e-801a-960d-000bc3be1758");
  await checkDb("33693c20-8c8e-80ea-8f7b-000bf4638bb8");
}
run();
