#!/usr/bin/env node
/**
 * seed-hiring.mjs
 *
 * This script:
 *  1. Updates your Notion hiring database schema to have all required columns
 *  2. Populates it with placeholder jobs
 *
 * Run once with:
 *   node scripts/seed-hiring.mjs
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Load env vars from .env.local ──────────────────────────────────────────────
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
const DATABASE_ID = env.NOTION_HIRING_DATABASE_ID;

if (!NOTION_TOKEN || !DATABASE_ID) {
  console.error("❌  Missing NOTION_TOKEN or NOTION_HIRING_DATABASE_ID in .env.local");
  process.exit(1);
}

// ── Notion API helpers ─────────────────────────────────────────────────────────
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
  console.log("📐  Setting up hiring database schema...");

  await notionRequest("PATCH", `/databases/${DATABASE_ID}`, {
    properties: {
      // "Name" (Title) already exists as default — skip
      Location: {
        select: {
          options: [
            { name: "Casablanca - MA", color: "blue" },
            { name: "Remote", color: "green" },
          ],
        },
      },
      Type: {
        select: {
          options: [
            { name: "Full-time", color: "purple" },
            { name: "Part-time", color: "yellow" },
            { name: "Contract", color: "orange" },
            { name: "Freelance", color: "pink" },
          ],
        },
      },
      Department: {
        select: {
          options: [
            { name: "Design", color: "red" },
            { name: "Video Production", color: "blue" },
            { name: "Development", color: "green" },
            { name: "Marketing", color: "yellow" },
            { name: "Direction", color: "default" },
          ],
        },
      },
      Description: { rich_text: {} },
      Link: { url: {} },
      Order: { number: { format: "number" } },
      Published: { checkbox: {} },
    },
  });

  console.log("✅  Schema ready.\n");
}

// ── Step 2: Placeholder data ───────────────────────────────────────────────────
const jobs = [
  {
    title: "Senior Graphic Designer",
    location: "Casablanca - MA",
    type: "Full-time",
    department: "Design",
    description: "Rejoignez notre équipe pour concevoir des identités visuelles percutantes et novatrices pour nos clients premium.",
    link: "mailto:hello@gradus.ma?subject=Application:%20Senior%20Graphic%20Designer",
    order: 1,
  },
  {
    title: "Video Editor & Motion Designer",
    location: "Casablanca - MA",
    type: "Full-time",
    department: "Video Production",
    description: "Nous recherchons un créateur passionné pour monter et animer des contenus vidéos dynamiques destinés aux réseaux sociaux et campagnes de marque.",
    link: "mailto:hello@gradus.ma?subject=Application:%20Video%20Editor",
    order: 2,
  },
  {
    title: "Community Manager",
    location: "Remote",
    type: "Freelance",
    department: "Marketing",
    description: "Animez et engagez les communautés de nos clients avec des stratégies digitales pointues et une création de contenu continue.",
    link: "mailto:hello@gradus.ma?subject=Application:%20Community%20Manager",
    order: 3,
  },
];

// ── Step 3: Create each job as a Notion page ───────────────────────────────
async function seedJobs() {
  console.log(`🌱  Seeding ${jobs.length} jobs...\n`);

  for (const job of jobs) {
    process.stdout.write(`   Adding "${job.title}"...`);

    await notionRequest("POST", "/pages", {
      parent: { database_id: DATABASE_ID },
      properties: {
        Name: {
          title: [{ text: { content: job.title } }],
        },
        Location: {
          select: { name: job.location },
        },
        Type: {
          select: { name: job.type },
        },
        Department: {
          select: { name: job.department },
        },
        Description: {
          rich_text: [{ text: { content: job.description } }],
        },
        Link: {
          url: job.link,
        },
        Order: {
          number: job.order,
        },
        Published: {
          checkbox: true,
        },
      },
    });

    console.log(" ✓");
  }

  console.log(`\n🎉  Done! All placeholder jobs are now in your Notion database.`);
  console.log("   Open your Notion database to verify, then check localhost:3000.\n");
}

// ── Main ───────────────────────────────────────────────────────────────────────
(async () => {
  try {
    await updateSchema();
    await seedJobs();
  } catch (err) {
    console.error("\n❌ Error:", err.message);
    process.exit(1);
  }
})();
