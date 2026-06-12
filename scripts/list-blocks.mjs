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
  const pageId = "33693c208c8e80f38402f27f4589be2a";
  const res = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Notion-Version": "2022-06-28"
    }
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

run();
