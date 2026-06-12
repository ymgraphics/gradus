import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../.env.local");
const envContent = readFileSync(envPath, "utf-8");
const env = Object.fromEntries(
  envContent.split("\n")
    .filter(line => line.includes("="))
    .map(line => line.split("=").map(s => s.trim()))
);

const NOTION_TOKEN = env.NOTION_TOKEN;
const DATABASE_ID = env.NOTION_FEEDBACK_DATABASE_ID;

if (!NOTION_TOKEN || !DATABASE_ID) {
  console.error("❌ Missing NOTION_TOKEN or NOTION_FEEDBACK_DATABASE_ID in .env.local");
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${NOTION_TOKEN}`,
  "Content-Type": "application/json",
  "Notion-Version": "2022-06-28",
};

async function setupSchema() {
  console.log("📐 Setting up Feedbacks database schema...");
  
  const res = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({
      properties: {
        Name: { title: {} },
        Title: { rich_text: {} },
        Feedback: { rich_text: {} },
        Rating: { number: { format: "number" } },
        AvatarURL: { url: {} },
        Published: { checkbox: {} },
        Order: { number: { format: "number" } },
      },
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    console.error("❌ Notion API error:", error.message);
    process.exit(1);
  }
  console.log("✅ Schema ready.\n");
}

const feedbacks = [
  {
    name: "Thomas Durand",
    title: "Directeur Marketing, TechFlow",
    feedback: "L'équipe de Gradus a transformé notre présence digitale. Leur approche créative et technique est tout simplement exceptionnelle.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    order: 1,
  },
  {
    name: "Sophie Martin",
    title: "Fondatrice, Luxe & Co",
    feedback: "Un professionnalisme rare. Ils ont su capturer l'essence de notre marque et la retranscrire avec une élégance moderne.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    order: 2,
  },
  {
    name: "Marc Lefebvre",
    title: "CEO, Innovate JS",
    feedback: "Efficacité, rapidité et surtout un design qui Claque. Gradus est devenu notre partenaire de confiance pour tous nos projets Web.",
    rating: 4,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    order: 3,
  },
  {
    name: "Julie Bernard",
    title: "Responsable Com, GreenHorizon",
    feedback: "Leur gestion de projet est fluide et les résultats dépassent nos attentes. Je recommande vivement Gradus pour toute agence sérieuse.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    order: 4,
  },
];

async function seedData() {
  console.log(`🌱 Seeding ${feedbacks.length} feedbacks...`);
  
  for (const item of feedbacks) {
    process.stdout.write(`   Adding review from "${item.name}"... `);
    
    const res = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers,
      body: JSON.stringify({
        parent: { database_id: DATABASE_ID },
        properties: {
          Name: { title: [{ text: { content: item.name } }] },
          Title: { rich_text: [{ text: { content: item.title } }] },
          Feedback: { rich_text: [{ text: { content: item.feedback } }] },
          Rating: { number: item.rating },
          AvatarURL: { url: item.avatar },
          Published: { checkbox: true },
          Order: { number: item.order },
        },
      }),
    });

    if (res.ok) {
      console.log("✓");
    } else {
      console.log("❌");
      const err = await res.json();
      console.error("   Error detail:", err.message);
    }
  }
  console.log("\n🎉 Done! Feedback data migrated successfully.");
}

async function run() {
  await setupSchema();
  await seedData();
}

run();
