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

async function run() {
  const res = await fetch(`https://api.notion.com/v1/search`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      filter: {
        value: "database",
        property: "object"
      }
    })
  });
  const data = await res.json();
  console.log(JSON.stringify(data.results.map(db => ({ id: db.id, title: db.title?.[0]?.plain_text })), null, 2));
}

run();
