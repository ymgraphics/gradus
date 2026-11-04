import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRestProjects } from "@/lib/firebase-rest";
import { defaultProjects, SITE_URL } from "@/lib/constants";
import ServiceClient from "./ServiceClient";

export const revalidate = 3600;

// Define our rich target Local SEO landing pages registry
const serviceLandingPages: Record<string, any> = {
  "branding": {
    categoryFilter: "Branding",
    title: {
      fr: "Agence de Branding & Identité Visuelle à Casablanca | Gradus Agency",
      en: "Branding & Visual Identity Agency in Casablanca | Gradus Agency"
    },
    metaDescription: {
      fr: "Gradus est une agence de branding d'excellence à Casablanca. Création de logos premium, chartes graphiques, packaging et identités de marque fortes au Maroc.",
      en: "Gradus is an elite branding agency in Casablanca. Creation of premium logos, graphic guidelines, package design, and strong brand identities in Morocco."
    },
    h1: {
      fr: "Agence de Branding & Identité Visuelle",
      en: "Branding & Brand Identity Agency"
    },
    intro: {
      fr: "Une marque forte n'est pas seulement vue; elle est mémorisée. Nous concevons des identités visuelles premium et des chartes graphiques mémorables qui capturent l'âme de votre marque.",
      en: "A strong brand isn't just seen; it's remembered. We craft premium visual identities and memorable graphic systems that capture your brand's unique soul."
    },
    features: [
      { 
        title: { fr: "Création de Logo Premium", en: "Premium Logo Design" }, 
        desc: { fr: "Logotypes uniques, minimalistes et équilibrés, dessinés sur mesure par nos experts à Casablanca.", en: "Unique, minimalist, and balanced logotypes tailored custom to your industry by Casablanca design experts." } 
      },
      { 
        title: { fr: "Charte Graphique Complète", en: "Complete Brand Guidelines" }, 
        desc: { fr: "Système de couleurs HSL harmonieux, typographies de caractère et règles d'utilisation claires.", en: "Harmonious HSL colors, distinct typography patterns, and clear brand usage rules." } 
      },
      { 
        title: { fr: "Design de Packaging & Print", en: "Packaging & Print Design" }, 
        desc: { fr: "Conception de packagings, menus de restaurants, uniformes et supports physiques haut de gamme au Maroc.", en: "Design of high-end packaging formats, restaurant menus, uniforms, and print media in Morocco." } 
      }
    ]
  },
  "social-media": {
    categoryFilter: "Social Media",
    title: {
      fr: "Agence Social Media & Community Management à Casablanca | Gradus Agency",
      en: "Social Media & Community Management Agency in Casablanca | Gradus Agency"
    },
    metaDescription: {
      fr: "Confiez vos réseaux sociaux à l'agence social media de référence à Casablanca. Création de Reels viraux, community management et influence d'impact au Maroc.",
      en: "Entrust your socials to the reference social media agency in Casablanca. Viral Reels production, community management, and influencer marketing in Morocco."
    },
    h1: {
      fr: "Agence Social Media & Community Management",
      en: "Social Media & Community Management Agency"
    },
    intro: {
      fr: "Nous transformons les simples abonnés en ambassadeurs passionnés. Notre équipe produit des Reels, Stories et posts à fort impact pour fédérer une communauté engagée autour de votre marque.",
      en: "We transform casual followers into passionate brand advocates. Our team produces high-impact Reels, Stories, and posts to build an engaged community."
    },
    features: [
      { 
        title: { fr: "Production de Reels & Shorts", en: "Reels & Shorts Production" }, 
        desc: { fr: "Prises de vues professionnelles, montage dynamique et écriture de scripts calibrés pour la viralité sur Instagram et TikTok.", en: "Video shooting, dynamic editing, and scripts carefully calibrated for social virality on Instagram and TikTok." } 
      },
      { 
        title: { fr: "Community Management", en: "Community Management" }, 
        desc: { fr: "Modération active, programmation stratégique et réponses de marque engageantes pour vos clients au Maroc.", en: "Active moderation, strategic calendar scheduling, and engaging brand interactions for your Moroccan audience." } 
      },
      { 
        title: { fr: "Campagnes d'Influence", en: "Influencer Marketing" }, 
        desc: { fr: "Sélection, recrutement et coordination de créateurs de contenu locaux alignés avec les valeurs de votre entreprise.", en: "Selection, hiring, and coordination of local content creators aligned perfectly with your company's values." } 
      }
    ]
  },
  "video-production": {
    categoryFilter: "Photo & Vidéo",
    title: {
      fr: "Agence Créative & Production Audiovisuelle au Maroc | Gradus Agency",
      en: "Creative Agency & Audiovisual Production in Morocco | Gradus Agency"
    },
    metaDescription: {
      fr: "Gradus, l'agence créative de référence au Maroc. Production vidéo d'impact, shooting photo premium, modélisation 3D et expériences digitales immersives à Casablanca.",
      en: "Gradus, the leading creative agency in Morocco. High-impact video production, premium photography, photorealistic 3D modeling, and immersive digital assets."
    },
    h1: {
      fr: "Production Audiovisuelle & Créative",
      en: "Audiovisual & Creative Production"
    },
    intro: {
      fr: "L'art visuel et la technologie au service de l'émotion. Nous produisons des campagnes de spots publicitaires, des clips digitaux haut de gamme et des conceptions 3D ultra-réalistes.",
      en: "Visual art and advanced tech combined to spark emotions. We produce high-end commercial ads, sleek digital video clips, and ultra-realistic 3D designs."
    },
    features: [
      { 
        title: { fr: "Production Vidéo & Cinéma", en: "Video & Cinema Production" }, 
        desc: { fr: "Matériel cinéma, éclairage soigné et direction artistique pointue pour vos spots de publicité de marque.", en: "Cinema-grade gear, meticulously crafted lighting, and sharp art direction for your brand's advertising spots." } 
      },
      { 
        title: { fr: "Shooting Photo Premium", en: "Premium Photography" }, 
        desc: { fr: "Photographies culinaires, éditoriales et corporate de haute volée pour vos plateformes digitales.", en: "High-flying culinary, editorial, and corporate photography for your digital platforms." } 
      },
      { 
        title: { fr: "Conceptions 3D & Façades", en: "3D Rendering & Spaces" }, 
        desc: { fr: "Modélisation photoréaliste d'espaces et de façades architecturales pour vos projets retail et immobiliers au Maroc.", en: "Photorealistic modeling of retail spaces and architectural facades for real-estate projects in Morocco." } 
      }
    ]
  },
  "web-design": {
    categoryFilter: "3D",
    title: {
      fr: "Agence Web Design & Interfaces UX/UI Casablanca | Gradus Agency",
      en: "Web Design & UX/UI Interfaces Casablanca | Gradus Agency"
    },
    metaDescription: {
      fr: "Conception de sites internet premium, d'applications mobiles intuitives et d'interfaces UX/UI interactives à Casablanca par Gradus Agency.",
      en: "Design of premium websites, intuitive mobile applications, and highly interactive UX/UI interfaces in Casablanca by Gradus Agency."
    },
    h1: {
      fr: "Web Design & Développement d'Interfaces",
      en: "Web Design & Interface Development"
    },
    intro: {
      fr: "Nous créons des expériences digitales captivantes, fluides et hautement interactives. Du site vitrine haut de gamme à la plateforme e-commerce d'envergure au Maroc.",
      en: "We craft captivating, smooth, and highly interactive digital experiences. From high-end showcase websites to enterprise-level e-commerce platforms in Morocco."
    },
    features: [
      { 
        title: { fr: "Conception Web Sur Mesure", en: "Custom Web Design" }, 
        desc: { fr: "Des structures interactives, performantes et optimisées pour le SEO de pointe.", en: "Interactive, high-performing structures optimized perfectly for state-of-the-art SEO." } 
      },
      { 
        title: { fr: "Interfaces UX/UI Premium", en: "Premium UX/UI Design" }, 
        desc: { fr: "Maquettes haute-fidélité axées sur le parcours client et l'esthétique spatiale.", en: "High-fidelity mockups centered around customer journeys and spatial aesthetics." } 
      },
      { 
        title: { fr: "Développement Web Interactif", en: "Interactive Web Development" }, 
        desc: { fr: "Intégration d'animations fluides, responsive multi-support et architectures sécurisées.", en: "Smooth animations, cross-device responsiveness, and highly-secure backend architectures." } 
      }
    ]
  },
  "advertising": {
    categoryFilter: "Marketing",
    title: {
      fr: "Agence de Publicité & Stratégie Média à Casablanca | Gradus Agency",
      en: "Advertising Agency & Media Strategy in Casablanca | Gradus Agency"
    },
    metaDescription: {
      fr: "Propulsez vos ventes avec des campagnes publicitaires performantes sur Meta Ads, Google Ads et TikTok. Stratégie d'acquisition à Casablanca par Gradus.",
      en: "Propel your sales with high-performing ad campaigns on Meta Ads, Google Ads, and TikTok. Growth acquisition strategy in Casablanca by Gradus."
    },
    h1: {
      fr: "Publicité, Acquisition & Stratégie Média",
      en: "Advertising, Acquisition & Media Strategy"
    },
    intro: {
      fr: "Maximisez votre visibilité et convertissez vos prospects en clients qualifiés. Nous concevons des campagnes publicitaires ciblées à fort retour sur investissement média au Maroc.",
      en: "Maximize your online visibility and convert prospects into qualified buyers. We design targeted advertising campaigns with high return on media spend in Morocco."
    },
    features: [
      { 
        title: { fr: "Campagnes Payantes", en: "Paid Ad Campaigns" }, 
        desc: { fr: "Gestion de vos budgets Meta Ads, Google Search/Display et TikTok Ads à fort taux de conversion.", en: "Management of Meta Ads, Google Search/Display, and TikTok Ads budgets targeting high conversion rates." } 
      },
      { 
        title: { fr: "Stratégie de Contenu Pub", en: "Ad Creative Content" }, 
        desc: { fr: "Écriture et réalisation de vidéos publicitaires accrocheuses (UGC, reels de marque) pour vos tunnels.", en: "Scriptwriting and production of high-catching advertising creatives (UGC, branded reels) for your funnels." } 
      },
      { 
        title: { fr: "Optimisation de Taux de Conversion", en: "Conversion Optimization" }, 
        desc: { fr: "Optimisation de landing pages et tunnels d'achat pour maximiser le ROI publicitaire.", en: "Optimization of landing pages and buying funnels to maximize advertising ROI." } 
      }
    ]
  }
};

// Aliases for retrocompatibility and search-targeted SEO landings
serviceLandingPages["branding-agency-casablanca"] = serviceLandingPages["branding"];
serviceLandingPages["social-media-agency-casablanca"] = serviceLandingPages["social-media"];
serviceLandingPages["creative-agency-morocco"] = serviceLandingPages["video-production"];
serviceLandingPages["marketing-agency-casablanca"] = serviceLandingPages["advertising"];

// Generate Static Params for blistering build speeds and 100% caching on Vercel Edge Networks
export async function generateStaticParams() {
  return Object.keys(serviceLandingPages).map((slug) => ({ slug }));
}

// Dynamic server-side SEO metadata generator
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = serviceLandingPages[slug];
  const baseUrl = SITE_URL.endsWith("/") ? SITE_URL.slice(0, -1) : SITE_URL;

  if (!page) {
    return {
      title: "Service non trouvé | Gradus",
      description: "Le service demandé n'existe pas.",
    };
  }

  // Target French as primary for Moroccan search traffic, default fallback English
  const title = page.title.fr;
  const description = page.metaDescription.fr;
  
  // Resolve canonical slug to prevent duplicate content indexation
  const aliasMap: Record<string, string> = {
    "branding-agency-casablanca": "branding",
    "social-media-agency-casablanca": "social-media",
    "creative-agency-morocco": "video-production",
    "marketing-agency-casablanca": "advertising"
  };
  const canonicalSlug = aliasMap[slug] || slug;
  const canonicalUrl = `${baseUrl}/services/${canonicalSlug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    keywords: [
      "agence marketing casablanca",
      "agence branding casablanca",
      "marketing digital maroc",
      "creative agency morocco",
      "production video casablanca",
      "community management maroc",
      "creativite",
      "communication casablanca"
    ],
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      siteName: "Gradus Agency",
      images: [
        {
          url: `${baseUrl}/assets/og-image.png`,
          width: 1200,
          height: 630,
          alt: `Gradus Creative Agency — ${page.h1.fr}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}/assets/og-image.png`],
    },
  };
}

export default async function ServiceLandingPage({ params }: { params: Promise<{ slug: string }> }) {
    const getSeoSlug = (p: any) => {
      const catSlug = (p.category || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      return catSlug ? `${p.id}-${catSlug}` : p.id;
    };
  const { slug } = await params;
  const serviceData = serviceLandingPages[slug];
  const baseUrl = SITE_URL.endsWith("/") ? SITE_URL.slice(0, -1) : SITE_URL;

  if (!serviceData) {
    notFound();
  }

  // Fetch Firestore projects dynamically to pass down
  let projects = [];
  try {
    projects = await getRestProjects();
    if (!projects || projects.length === 0) {
      projects = defaultProjects;
    }
  } catch (error) {
    console.error("[ServiceLandingPage] Error fetching dynamic projects:", error);
    projects = defaultProjects;
  }

  // Generate structured LocalBusiness / ProfessionalService & Breadcrumb schema for local crawlers
  const professionalServiceSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": `${baseUrl}/services/${slug}/#service`,
        "name": serviceData.title.fr,
        "headline": serviceData.h1.fr,
        "description": serviceData.metaDescription.fr,
        "url": `${baseUrl}/services/${slug}`,
        "logo": `${baseUrl}/assets/logo.png`,
        "image": `${baseUrl}/assets/og-image.png`,
        "telephone": "+212691404005",
        "priceRange": "$$",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Bd Brahim Roudani",
          "addressLocality": "Casablanca",
          "postalCode": "20000",
          "addressCountry": "MA"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "33.5898",
          "longitude": "-7.6039"
        },
        "areaServed": [
          {
            "@type": "AdministrativeArea",
            "name": "Casablanca"
          },
          {
            "@type": "AdministrativeArea",
            "name": "Morocco"
          }
        ],
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday"
            ],
            "opens": "09:00",
            "closes": "18:00"
          }
        ],
        "sameAs": [
          "https://www.instagram.com/gradus.agency",
          "https://www.linkedin.com/company/gradus-agency"
        ]
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${baseUrl}/services/${slug}/#breadcrumb`,
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
            "name": "Services",
            "item": `${baseUrl}/#services`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": serviceData.h1.fr,
            "item": `${baseUrl}/services/${slug}`
          }
        ]
      }
    ]
  };

  return (
    <main className="bg-void">
      {/* Inject specific Service Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema) }}
      />
      <ServiceClient
        slug={slug}
        serviceData={serviceData}
        projects={projects}
        // SEO internal linking: related projects, rendered above the footer
        related={
          projects && projects.length > 0 && (
            <section className="container py-12 border-t border-gradus-border">
              <h2 className="label-utility mb-6">
                Projets Connexes
              </h2>
              <div className="flex flex-wrap gap-3">
                {projects.slice(0, 8).map((project) => (
                  <a
                    key={project.id}
                    href={`/projects/${getSeoSlug(project)}`}
                    className="label-utility text-text-secondary hover:text-text-primary hover:border-accent/40 transition-colors px-3 py-1 border border-gradus-border"
                  >
                    {project.client} — {project.category}
                  </a>
                ))}
              </div>
            </section>
          )
        }
      />
    </main>
  );
}
