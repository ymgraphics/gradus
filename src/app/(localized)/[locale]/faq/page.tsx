import { Metadata } from "next";
import { getDictionary } from "@/i18n/getDictionary";
import type { Locale } from "@/i18n-config";

import { getRestProjects } from "@/lib/firebase-rest";
import { defaultProjects, SITE_URL } from "@/lib/constants";
import FaqClient from "./FaqClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;


const faqItems = [
  {
    id: "pricing-models",
    question: {
      fr: "Quels sont vos tarifs pour un accompagnement créatif ou marketing ?",
      en: "What are your pricing models for creative or marketing support?"
    },
    answer: {
      fr: "Chez Gradus, nous travaillons sur mesure. Nous proposons deux modèles : un forfait par projet (idéal pour le branding, la création de site internet ou un shooting vidéo ponctuel) et un abonnement mensuel (retainer) pour la gestion récurrente de vos réseaux sociaux et vos campagnes d'acquisition.",
      en: "At Gradus, we work on a tailored basis. We offer two pricing models: flat project-based pricing (perfect for branding, web design, or specific video shoots) and monthly retainers for ongoing social media management and acquisition campaigns."
    },
    category: "general" as const
  },
  {
    id: "branding-deliverables",
    question: {
      fr: "Quels livrables recevons-nous à la fin d'un projet de branding ?",
      en: "What deliverables do we receive at the end of a branding project?"
    },
    answer: {
      fr: "Vous recevez un package complet et prêt à l'emploi : vos logotypes en haute résolution sous tous les formats (.SVG, .PNG transparent, PDF), votre charte graphique détaillée (spécifications des couleurs HSL, typographies, règles d'usage), ainsi que vos simulations de supports physiques (menus, packaging, uniformes, cartes de visite).",
      en: "You receive a complete, ready-to-use package: high-resolution logotypes in all required formats (.SVG, transparent .PNG, PDF), your detailed brand guidelines (color specifications in HSL, typography rules, brand restrictions), and physical mockup simulations (menus, packaging formats, uniforms, business cards)."
    },
    category: "branding" as const
  },
  {
    id: "video-production-cycle",
    question: {
      fr: "Combien de temps prend la production d'un clip ou d'une série de Reels ?",
      en: "How long does a video clip or Reels campaign production take?"
    },
    answer: {
      fr: "Un shooting vidéo standard prend généralement 1 à 2 jours de tournage à Casablanca. La phase de post-production (montage dynamique, sound design, étalonnage cinéma et sous-titrage) prend entre 5 et 10 jours ouvrés selon la complexité et le nombre de déclinaisons demandées.",
      en: "A standard video shoot typically takes 1 to 2 production days in Casablanca. Post-production (dynamic editing, professional sound design, color grading, and custom subtitles) takes between 5 to 10 business days depending on complexity and total versions requested."
    },
    category: "video" as const
  },
  {
    id: "seo-ranking-timeline",
    question: {
      fr: "En combien de temps peut-on voir les premiers résultats en SEO ?",
      en: "How long before we see search engine optimization (SEO) results?"
    },
    answer: {
      fr: "Le SEO est un investissement à moyen/long terme. Grâce à notre architecture Next.js ultra-rapide et l'optimisation sémantique locale de nos landing pages, les premiers résultats d'indexation apparaissent généralement en 3 à 6 semaines. Pour asseoir une autorité forte et truster le top 3 Google sur des requêtes concurrentielles à Casablanca, comptez 3 à 6 mois.",
      en: "SEO is a medium to long-term investment. Thanks to our ultra-fast Next.js architecture and localized semantic optimization, initial indexing improvements appear within 3 to 6 weeks. To build massive authority and secure Google's top 3 on highly competitive search terms in Casablanca, plan for 3 to 6 months of active indexing."
    },
    category: "marketing" as const
  },
  {
    id: "collaboration-workflow",
    question: {
      fr: "Comment se déroule la collaboration avec l'agence ?",
      en: "What is the typical workflow when collaborating with the agency?"
    },
    answer: {
      fr: "Nous privilégions la simplicité et la communication directe. Un chef de projet dédié est assigné à votre marque. Nous utilisons Slack ou WhatsApp pour les échanges quotidiens rapides, et Notion pour le suivi transparent des livrables et la validation des plannings éditoriaux.",
      en: "We focus on simplicity and direct communication. A dedicated project manager is assigned to your business. We utilize Slack or WhatsApp for fast daily syncs, and Notion for highly transparent tracking of deliverables and calendar approvals."
    },
    category: "general" as const
  },
  {
    id: "revision-rounds",
    question: {
      fr: "Combien d'aller-retours de révisions sont inclus dans les projets ?",
      en: "How many revision rounds are included in your projects?"
    },
    answer: {
      fr: "Tous nos forfaits incluent par défaut 3 phases d'aller-retours de révisions majeures. Notre objectif est de livrer un produit qui vous donne entière satisfaction tout en conservant une cohérence esthétique et stratégique validée par notre direction artistique.",
      en: "All of our standard packages include 3 complete rounds of major revisions. Our target is to deliver an finished product that exceeds your business expectations while fully maintaining visual and strategic coherence backed by our art directors."
    },
    category: "general" as const
  }
];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const dict = await getDictionary(locale);
  return {
    title: dict.seo.faq.title,
    description: dict.seo.faq.description,
    alternates: {
      canonical: `${locale === "fr" ? "" : "/" + locale}/faq`,
    },
  };
}

export default async function FaqPage() {
  const baseUrl = SITE_URL.endsWith("/") ? SITE_URL.slice(0, -1) : SITE_URL;

  // Fetch projects to feed the footer
  let projects = [];
  try {
    projects = await getRestProjects();
    if (!projects || projects.length === 0) {
      projects = defaultProjects;
    }
  } catch (error) {
    projects = defaultProjects;
  }

  // Generate structured FAQPage & BreadcrumbList schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        "@id": `${baseUrl}/faq/#faqpage`,
        "mainEntity": faqItems.map((item) => ({
          "@type": "Question",
          "name": item.question.fr,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.answer.fr
          }
        }))
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${baseUrl}/faq/#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": baseUrl
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "FAQ",
            "item": `${baseUrl}/faq`
          }
        ]
      }
    ]
  };

  return (
    <main>
      {/* Inject specific FAQ JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <FaqClient projects={projects} faqItems={faqItems} />
    </main>
  );
}
