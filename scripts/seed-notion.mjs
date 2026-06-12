#!/usr/bin/env node
/**
 * seed-notion.mjs
 *
 * This script:
 *  1. Updates your Notion database schema to have all required columns
 *  2. Populates it with all 14 existing portfolio projects (including image/video URLs)
 *
 * Run once with:
 *   node scripts/seed-notion.mjs
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
const DATABASE_ID = env.NOTION_DATABASE_ID;

if (!NOTION_TOKEN || !DATABASE_ID) {
  console.error("❌  Missing NOTION_TOKEN or NOTION_DATABASE_ID in .env.local");
  process.exit(1);
}

// ── Notion API helpers ─────────────────────────────────────────────────────────
// Use the stable 2022-06-28 API version (the newer SDK defaults to 2025-09-03
// where databases are renamed "data sources" and the schema differs)
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
  console.log("📐  Setting up database schema...");

  await notionRequest("PATCH", `/databases/${DATABASE_ID}`, {
    properties: {
      // "Name" (Title) already exists as default — skip
      ID: { rich_text: {} },
      Year: { rich_text: {} },
      Category: { rich_text: {} },
      Tags: {
        multi_select: {
          options: [
            { name: "Branding", color: "yellow" },
            { name: "Identité Visuelle", color: "orange" },
            { name: "Social Media", color: "blue" },
            { name: "Print", color: "green" },
            { name: "Photo", color: "purple" },
            { name: "Vidéo", color: "red" },
            { name: "Production Vidéo", color: "pink" },
            { name: "Photo Shooting", color: "gray" },
            { name: "Conception 3D", color: "brown" },
            { name: "Graphique Design", color: "default" },
            { name: "3D", color: "orange" },
          ],
        },
      },
      Description: { rich_text: {} },
      CoverImage: { rich_text: {} },
      GalleryImages: { rich_text: {} },
      Videos: { rich_text: {} },
      Format: {
        select: {
          options: [
            { name: "full", color: "blue" },
            { name: "half", color: "green" },
            { name: "third", color: "orange" },
          ],
        },
      },
      Order: { number: { format: "number" } },
      Published: { checkbox: {} },
    },
  });

  console.log("✅  Schema ready.\n");
}

// ── Step 2: Project data ───────────────────────────────────────────────────────
const projects = [
  {
    id: "tito",
    client: "Tito",
    year: "2022",
    category: "Branding · Print",
    tags: ["Branding", "Identité Visuelle"],
    description: "Création complète de l'identité visuelle pour Tito — logo, packaging, uniformes, carte de visite et mobilier de marque.",
    coverImage: "https://gradus.ma/wp-content/uploads/2022/08/SIMULATION-4.png",
    galleryImages: [
      "https://gradus.ma/wp-content/uploads/2022/08/MOCKUP-826x900.png",
      "https://gradus.ma/wp-content/uploads/2022/08/CARTE-VISITE-TITO-900x652.png",
      "https://gradus.ma/wp-content/uploads/2022/08/STICKERS-TITO-900x506.png",
      "https://gradus.ma/wp-content/uploads/2022/08/SAC-EMPORTER-749x900.png",
      "https://gradus.ma/wp-content/uploads/2022/08/SAC-SAN-POIGNET-772x900.png",
      "https://gradus.ma/wp-content/uploads/2022/08/tablier-1-900x847.png",
      "https://gradus.ma/wp-content/uploads/2022/08/SET-DE-TABLE-TITO-900x719.png",
      "https://gradus.ma/wp-content/uploads/2022/08/BOX-2-900x490.png",
      "https://gradus.ma/wp-content/uploads/2022/08/SIMULATION-2-748x900.png",
      "https://gradus.ma/wp-content/uploads/2022/08/CASQUE-854x900.png",
      "https://gradus.ma/wp-content/uploads/2022/08/mockup-1-900x760.png",
      "https://gradus.ma/wp-content/uploads/2022/08/French_Fry_09-624x900.png",
      "https://gradus.ma/wp-content/uploads/2022/08/serv.png",
      "https://gradus.ma/wp-content/uploads/2022/08/sandwich-900x600.png",
    ],
    videos: [],
    format: "full",
    order: 1,
  },
  {
    id: "orqid-spa",
    client: "Orqid Spa",
    year: "2022",
    category: "Branding · 3D",
    tags: ["Branding", "Identité Visuelle"],
    description: "Création du support visuel et de l'identité de marque pour Orqid Spa — logo, brochure, signalétique murale.",
    coverImage: "https://gradus.ma/wp-content/uploads/2022/08/LOGO-ORQID-SPA-2.png",
    galleryImages: [
      "https://gradus.ma/wp-content/uploads/2022/08/Orqid-spa-mur-874x900.png",
      "https://gradus.ma/wp-content/uploads/2022/08/LOGO-ORQID-SPA-2-900x700.png",
      "https://gradus.ma/wp-content/uploads/2022/08/Brochure-ORQID-SPA-900x782.png",
    ],
    videos: [],
    format: "half",
    order: 2,
  },
  {
    id: "dar-dada",
    client: "Dar Dada",
    year: "2022",
    category: "Branding · Social Media",
    tags: ["Branding", "Social Media", "Print"],
    description: "Accompagnement graphique et stratégique complet pour Dar Dada — création graphique et déploiement de la stratégie marketing digital.",
    coverImage: "https://gradus.ma/wp-content/uploads/2022/08/INSTAGRAM-DAR-DADA.png",
    galleryImages: [
      "https://gradus.ma/wp-content/uploads/2022/08/CARTE-BOISSONS-DARDADA-900x665.png",
      "https://gradus.ma/wp-content/uploads/2022/08/CARTE-VISITE-dardada-900x600.png",
      "https://gradus.ma/wp-content/uploads/2022/08/BROCHURE-DAR-DADA-900x600.png",
      "https://gradus.ma/wp-content/uploads/2022/08/STORY-INSTAGRAM-DARDADA-900x600.png",
      "https://gradus.ma/wp-content/uploads/2022/08/STORY-INSTAGRAM-DARDADA-2-900x600.png",
      "https://gradus.ma/wp-content/uploads/2022/08/PANNEAU-RAMADAN-DARDADA-723x900.png",
    ],
    videos: [],
    format: "half",
    order: 3,
  },
  {
    id: "pocknroll",
    client: "Pock'n'roll Baker",
    year: "2023",
    category: "Photo & Vidéo · Social Media",
    tags: ["Photo", "Vidéo", "Social Media"],
    description: "Création de contenu digital pour les réseaux sociaux — photo shooting, production vidéo et montage pour Pock'n'roll Baker.",
    coverImage: "https://gradus.ma/wp-content/uploads/2022/09/1V9A6704vv-721x900.jpg",
    galleryImages: [
      "https://gradus.ma/wp-content/uploads/2022/09/1V9A6877-600x900.jpg",
      "https://gradus.ma/wp-content/uploads/2022/09/1V9A6681-720x900.png",
    ],
    videos: [
      "https://gradus.ma/wp-content/uploads/2022/09/pocknroll-First-G_1.mp4",
      "https://gradus.ma/wp-content/uploads/2023/02/2.MAIN-COMP-VERTICAL_1-1.mp4",
      "https://gradus.ma/wp-content/uploads/2022/09/blue-mojito.mp4",
      "https://gradus.ma/wp-content/uploads/2023/02/pnr-sponsor-Levallois-4.mp4",
    ],
    format: "full",
    order: 4,
  },
  {
    id: "birds-rooftop",
    client: "Birds Rooftop",
    year: "2022",
    category: "Branding · Print",
    tags: ["Branding", "Print", "3D"],
    description: "Création de la marque Birds Rooftop — enseigne, sous-verres, menu et supports de communication print et digital.",
    coverImage: "https://gradus.ma/wp-content/uploads/2023/01/ENSEIGNE-BIRDS.png",
    galleryImages: [
      "https://gradus.ma/wp-content/uploads/2023/01/ENSEIGNE-BIRDS-900x820.png",
      "https://gradus.ma/wp-content/uploads/2023/01/SOUS-VERRE-BIRDS-600x900.png",
      "https://gradus.ma/wp-content/uploads/2022/08/MENU-BIRDS-900x729.png",
    ],
    videos: [],
    format: "half",
    order: 5,
  },
  {
    id: "the-cloud-identity",
    client: "The Cloud",
    year: "2022",
    category: "Branding · Social Media",
    tags: ["Branding", "Social Media", "Print"],
    description: "Création des supports de communication print et digital pour The Cloud — menu, sous-verre, check de caisse et contenu vidéo réseaux sociaux.",
    coverImage: "https://gradus.ma/wp-content/uploads/2023/01/MENU-THE-CLOUD-841x900.png",
    galleryImages: [
      "https://gradus.ma/wp-content/uploads/2022/08/SOUS-VERRE-CLOUD-1-883x900.png",
      "https://gradus.ma/wp-content/uploads/2022/08/restaurant-check-CLOUD-900x741.png",
    ],
    videos: [
      "https://gradus.ma/wp-content/uploads/2022/08/312613019_537771174462737_4973006465430190346_n.mp4",
    ],
    format: "half",
    order: 6,
  },
  {
    id: "manaos",
    client: "Manaos",
    year: "2023",
    category: "Photo & Vidéo",
    tags: ["Production Vidéo"],
    description: "Production vidéo et montage pour le restaurant Manaos — déclinaisons Afro-Latin, 80s et clip général.",
    coverImage: "https://gradus.ma/wp-content/uploads/2022/09/Capture-decran-2023-03-02-a-17.12.04.png",
    galleryImages: [],
    videos: [
      "https://gradus.ma/wp-content/uploads/2022/09/manaos-afro-latin-.mp4",
      "https://gradus.ma/wp-content/uploads/2023/03/MANAOS-80S_1.mp4",
      "https://gradus.ma/wp-content/uploads/2022/09/manaos-general_1.mp4",
    ],
    format: "full",
    order: 7,
  },
  {
    id: "chez-lola",
    client: "Chez Lola",
    year: "2021",
    category: "Social Media · Print",
    tags: ["Social Media", "Print"],
    description: "Création de contenu multimédia et gestion des réseaux sociaux pour le restaurant Chez Lola.",
    coverImage: "https://gradus.ma/wp-content/uploads/2022/08/MENU-CHEZ-LOLA-900x900.png",
    galleryImages: [
      "https://gradus.ma/wp-content/uploads/2022/08/menu-boissons-chez-lola-2-900x882.png",
      "https://gradus.ma/wp-content/uploads/2022/08/MOCKUP34-900x719.png",
    ],
    videos: [],
    format: "third",
    order: 8,
  },
  {
    id: "corniche",
    client: "Corniche Baker",
    year: "2023",
    category: "3D",
    tags: ["Conception 3D"],
    description: "Conception 3D et rendu de façade pour l'espace Corniche à Casablanca.",
    coverImage: "https://gradus.ma/wp-content/uploads/2022/08/rendu-3D-de-facade-conrniche-casablanca-gradus-agency.jpg",
    galleryImages: [
      "https://gradus.ma/wp-content/uploads/2022/08/design-de-facade-corniche-casablanca-900x506.jpg",
      "https://gradus.ma/wp-content/uploads/2022/08/rendu-3D-de-facade-conrniche-casablanca-gradus-agency-900x506.jpg",
    ],
    videos: [],
    format: "third",
    order: 9,
  },
  {
    id: "the-cloud-flyer",
    client: "The Cloud",
    year: "2023",
    category: "Print · Social Media",
    tags: ["Graphique Design", "Social Media"],
    description: "Conception graphique de flyers pour les réseaux sociaux de The Cloud.",
    coverImage: "https://gradus.ma/wp-content/uploads/2022/09/flyer-the-cloud-amine-506x900.jpg",
    galleryImages: [
      "https://gradus.ma/wp-content/uploads/2023/02/WhatsApp-Image-2023-01-30-at-16.12.49-506x900.jpeg",
    ],
    videos: [],
    format: "third",
    order: 10,
  },
  {
    id: "beach-mama",
    client: "Beach Mama",
    year: "2023",
    category: "Photo & Vidéo",
    tags: ["Production Vidéo", "Photo Shooting"],
    description: "Shooting vidéo cocktail pour le restaurant Beach Mama.",
    coverImage: "https://gradus.ma/wp-content/uploads/2022/09/Capture-decran-2023-03-02-a-17.04.39.png",
    galleryImages: [],
    videos: [
      "https://gradus.ma/wp-content/uploads/2023/03/beachmama-cocktail_1.mp4",
    ],
    format: "half",
    order: 11,
  },
  {
    id: "coco-lounge",
    client: "Coco Lounge",
    year: "2022",
    category: "Photo & Vidéo · Social Media",
    tags: ["Production Vidéo", "Social Media"],
    description: "Shooting vidéo et montage pour Coco Lounge — clips réseaux sociaux ambiance lounge.",
    coverImage: "https://gradus.ma/wp-content/uploads/2022/09/10000000_126120890365340_2615874416023205828_n.mp4",
    galleryImages: [],
    videos: [
      "https://gradus.ma/wp-content/uploads/2022/09/10000000_126120890365340_2615874416023205828_n.mp4",
      "https://gradus.ma/wp-content/uploads/2023/02/312152766_658061312453589_151332484075519709_n.mp4",
      "https://gradus.ma/wp-content/uploads/2023/02/10000000_1828799334123143_6920636884821656930_n.mp4",
    ],
    format: "half",
    order: 12,
  },
  {
    id: "louna",
    client: "Louna",
    year: "2023",
    category: "Photo & Vidéo · Social Media",
    tags: ["Production Vidéo", "Social Media"],
    description: "Création de contenu média pour les réseaux sociaux de Louna — shooting et montage vidéo.",
    coverImage: "https://gradus.ma/wp-content/uploads/2022/09/Capture-decran-2023-03-02-a-17.16.43.png",
    galleryImages: [],
    videos: [
      "https://gradus.ma/wp-content/uploads/2023/03/louna-restaurant.mp4",
      "https://gradus.ma/wp-content/uploads/2023/03/Louna-Dance_1.mp4",
    ],
    format: "half",
    order: 13,
  },
  {
    id: "manos",
    client: "Manos",
    year: "2022",
    category: "Print",
    tags: ["Graphique Design", "Print"],
    description: "Design graphique d'un menu dépliant pour le client Manos.",
    coverImage: "https://gradus.ma/wp-content/uploads/2023/01/301426983_482436530393269_8186556893304159070_n-900x900.jpg",
    galleryImages: [
      "https://gradus.ma/wp-content/uploads/2023/01/301616930_488301442634914_2034513547291059363_n-900x900.jpg",
    ],
    videos: [],
    format: "half",
    order: 14,
  },
];

// ── Step 3: Create each project as a Notion page ───────────────────────────────
async function seedProjects() {
  console.log(`🌱  Seeding ${projects.length} projects...\n`);

  for (const p of projects) {
    process.stdout.write(`   Adding "${p.client}" (${p.id})...`);

    await notionRequest("POST", "/pages", {
      parent: { database_id: DATABASE_ID },
      properties: {
        Name: {
          title: [{ text: { content: p.client } }],
        },
        ID: {
          rich_text: [{ text: { content: p.id } }],
        },
        Year: {
          rich_text: [{ text: { content: p.year } }],
        },
        Category: {
          rich_text: [{ text: { content: p.category } }],
        },
        Tags: {
          multi_select: p.tags.map((name) => ({ name })),
        },
        Description: {
          rich_text: [{ text: { content: p.description } }],
        },
        CoverImage: {
          rich_text: [{ text: { content: p.coverImage } }],
        },
        GalleryImages: {
          rich_text: [{ text: { content: p.galleryImages.join(", ") } }],
        },
        Videos: {
          rich_text: [{ text: { content: p.videos.join(", ") } }],
        },
        Format: {
          select: { name: p.format },
        },
        Order: {
          number: p.order,
        },
        Published: {
          checkbox: true,
        },
      },
    });

    console.log(" ✓");
  }

  console.log(`\n🎉  Done! All ${projects.length} projects are now in your Notion database.`);
  console.log("   Open your Notion database to verify, then run: npm run dev\n");
}

// ── Main ───────────────────────────────────────────────────────────────────────
(async () => {
  try {
    await updateSchema();
    await seedProjects();
  } catch (err) {
    console.error("\n❌ Error:", err.message);
    process.exit(1);
  }
})();
