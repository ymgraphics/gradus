#!/usr/bin/env node
/**
 * seed-team.mjs
 *
 * This script:
 *  1. Updates your Notion Team database schema to have all required columns
 *  2. Populates it with your 7 existing team members
 *
 * Run once with:
 *   node scripts/seed-team.mjs
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const envPath = resolve(__dirname, "../.env.local");
const envContent = readFileSync(envPath, "utf-8");
const env = Object.fromEntries(
  envContent
    .split("\n")
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => {
      const [k, ...v] = l.split("=");
      return [k.trim(), v.join("=").trim()];
    })
);

const NOTION_TOKEN = env.NOTION_TOKEN;
const DATABASE_ID = env.NOTION_TEAM_DATABASE_ID;

if (!NOTION_TOKEN || !DATABASE_ID) {
  console.error("❌  Missing NOTION_TOKEN or NOTION_TEAM_DATABASE_ID in .env.local");
  process.exit(1);
}

const NOTION_VERSION = "2022-06-28";

const headers = {
  Authorization: `Bearer ${NOTION_TOKEN}`,
  "Notion-Version": NOTION_VERSION,
  "Content-Type": "application/json",
};

async function notionRequest(method, path, body) {
  const res = await fetch(`https://api.notion.com/v1${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  if (!res.ok) {
    console.error(`Notion API error on ${method} ${path}:`, JSON.stringify(json, null, 2));
    throw new Error(`Notion API error: ${json.message}`);
  }
  return json;
}

// ── Step 1: Update database schema ────────────────────────────────────────────
async function updateSchema() {
  console.log("📐  Setting up Team database schema...");

  await notionRequest("PATCH", `/databases/${DATABASE_ID}`, {
    properties: {
      // "Name" (Title) typically exists as default
      Role: { rich_text: {} },
      Tags: {
        multi_select: {
          options: [
            { name: "Direction", color: "blue" },
            { name: "Stratégie", color: "green" },
            { name: "Art Direction", color: "pink" },
            { name: "Design", color: "orange" },
            { name: "Graphisme", color: "red" },
            { name: "Branding", color: "purple" },
            { name: "UI/UX", color: "yellow" },
            { name: "Vidéo", color: "brown" },
            { name: "Production", color: "gray" },
            { name: "Montage", color: "default" },
            { name: "Post-prod", color: "blue" },
            { name: "Social Media", color: "pink" },
            { name: "Content", color: "orange" }
          ],
        },
      },
      ImageURL: { url: {} },
      IsCEO: { checkbox: {} },
      Order: { number: { format: "number" } },
      Published: { checkbox: {} },
    },
  });

  console.log("✅  Schema ready.\n");
}

// ── Step 2: Placeholder data ───────────────────────────────────────────────────
const team = [
  { name: "Zouhair Elghamry", role: "CEO & Fondateur", tags: ["Direction", "Stratégie"], isCeo: true, imageUrl: "/assets/team/Zouhair.webp", order: 1 },
  { name: "Rim ElMouhib", role: "Directrice Artistique", tags: ["Art Direction", "Design"], isCeo: false, imageUrl: "/assets/team/rim.webp", order: 2 },
  { name: "Saad Bouamer", role: "Senior Graphic Designer", tags: ["Graphisme", "Branding"], isCeo: false, imageUrl: "", order: 3 },
  { name: "Yasser Mokhtari", role: "Senior Graphic Designer", tags: ["Design", "UI/UX"], isCeo: false, imageUrl: "/assets/team/yasser.webp", order: 4 },
  { name: "Zakaria Zayane", role: "Videaste", tags: ["Vidéo", "Production"], isCeo: false, imageUrl: "/assets/team/zakaria.webp", order: 5 },
  { name: "Abdo Diraoui", role: "Video Editor", tags: ["Montage", "Post-prod"], isCeo: false, imageUrl: "/assets/team/abdo.webp", order: 6 },
  { name: "Chaimaa Toufiq", role: "Community Manager", tags: ["Social Media", "Content"], isCeo: false, imageUrl: "/assets/team/shaymae.webp", order: 7 },
];

// ── Step 3: Create each team member as a Notion page ───────────────────────────────
async function seedTeam() {
  console.log(`🌱  Seeding ${team.length} team members...\n`);

  for (const member of team) {
    process.stdout.write(`   Adding "${member.name}"...`);

    const properties = {
      Name: {
        title: [{ text: { content: member.name } }],
      },
      Role: {
        rich_text: [{ text: { content: member.role } }],
      },
      Tags: {
        multi_select: member.tags.map((name) => ({ name })),
      },
      IsCEO: {
        checkbox: member.isCeo,
      },
      Order: {
        number: member.order,
      },
      Published: {
        checkbox: true,
      },
    };

    if (member.imageUrl) {
      properties.ImageURL = { url: member.imageUrl };
    } else {
      properties.ImageURL = { url: null };
    }

    await notionRequest("POST", "/pages", {
      parent: { database_id: DATABASE_ID },
      properties,
    });

    console.log(" ✓");
  }

  console.log(`\n🎉  Done! All team members are now migrating into your Notion database.`);
}

// ── Main ───────────────────────────────────────────────────────────────────────
(async () => {
  try {
    await updateSchema();
    await seedTeam();
  } catch (err) {
    console.error("\n❌ Error:", err.message);
    process.exit(1);
  }
})();
