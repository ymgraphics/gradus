import { Metadata } from "next";
import { getDictionary } from "@/i18n/getDictionary";
import type { Locale } from "@/i18n-config";

import Navbar from "@/layouts/Navbar";
import Footer from "@/layouts/Footer";
import Image from "next/image";
import { getRestProjects } from "@/lib/firebase-rest";
import { defaultProjects, SITE_URL } from "@/lib/constants";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;


// Custom rich insights list
const blogPosts = [
  {
    id: "digital-marketing-secrets-morocco",
    title: "Pourquoi la plupart des agences de marketing digital échouent au Maroc (et comment y remédier)",
    excerpt: "Le marché marocain a des particularités uniques. Découvrez comment structurer des entonnoirs d'acquisition locaux performants et rentabiliser vos campagnes Meta et Google.",
    category: "Marketing Digital",
    date: "14 Mai 2026",
    author: "Zouhair Elghamry",
    readTime: "6 min read",
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "branding-identite-visuelle-casablanca",
    title: "L'art du Branding Premium : Comment concevoir une identité visuelle inoubliable à Casablanca",
    excerpt: "Concevoir un logo ne suffit plus. Apprenez à élaborer des chartes graphiques de caractère, des HSL palettes équilibrées et des designs de packaging haut de gamme.",
    category: "Branding",
    date: "10 Mai 2026",
    author: "Rim ElMouhib",
    readTime: "5 min read",
    coverImage: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "video-production-reels-viralite-tiktok",
    title: "Reels & TikTok au Maroc : Le guide ultime de la production vidéo virale pour les restaurants",
    excerpt: "Prise de vue, rythme de montage, écriture de scripts accrocheurs et étalonnage cinématographique. Tous les secrets de notre équipe pour générer des millions de vues organiques.",
    category: "Production Vidéo",
    date: "04 Mai 2026",
    author: "Malika",
    readTime: "4 min read",
    coverImage: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=800&auto=format&fit=crop"
  }
];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const dict = await getDictionary(locale);
  return {
    title: dict.seo.blog.title,
    description: dict.seo.blog.description,
    alternates: {
      canonical: `${locale === "fr" ? "" : "/" + locale}/blog`,
    },
  };
}

export default async function BlogPage() {
  const baseUrl = SITE_URL.endsWith("/") ? SITE_URL.slice(0, -1) : SITE_URL;

  // Fetch projects for Footer reference
  let projects = [];
  try {
    projects = await getRestProjects();
    if (!projects || projects.length === 0) {
      projects = defaultProjects;
    }
  } catch {
    projects = defaultProjects;
  }

  // Schema.org Blog & BreadcrumbList JSON-LD
  const blogSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": `${baseUrl}/blog/#blog`,
        "name": "Le Blog de Gradus Agency",
        "description": "Insights, guides de branding et secrets du marketing digital à Casablanca.",
        "publisher": {
          "@type": "Organization",
          "name": "Gradus Agency",
          "logo": `${baseUrl}/assets/logo.png`
        },
        "blogPost": blogPosts.map((post) => ({
          "@type": "BlogPosting",
          "headline": post.title,
          "description": post.excerpt,
          "datePublished": "2026-05-10",
          "author": {
            "@type": "Person",
            "name": post.author
          },
          "image": post.coverImage,
          "url": `${baseUrl}/blog/${post.id}`
        }))
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${baseUrl}/blog/#breadcrumb`,
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
            "name": "Blog",
            "item": `${baseUrl}/blog`
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-void text-text-primary font-body">
      <Navbar />

      {/* Script injection for structured SEO blog data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />

      {/* Hero Header */}
      <section className="relative pt-40 pb-20 md:pt-48 md:pb-28">
        <div className="container">
          <p className="label-utility mb-10 flex items-center gap-3">
            <span className="inline-block w-2 h-2 bg-accent" aria-hidden="true" />
            Insights & Inspirations
          </p>
          <h1 className="text-display-xl font-display text-text-primary max-w-6xl">
            Le Journal de <span className="text-accent">la Créativité.</span>
          </h1>
          <p className="mt-12 md:ml-[16.666%] text-body text-text-secondary max-w-2xl">
            Secrets de production vidéo, guides de branding, analyses de campagnes et retours d&apos;expérience de notre collectif à Casablanca.
          </p>
        </div>
      </section>

      {/* Article list */}
      <section className="section-y border-t border-gradus-border">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16">
            {blogPosts.map((post, i) => (
              <article
                key={post.id}
                style={{ "--i": i % 3 } as React.CSSProperties}
                className="group flex flex-col text-left lg:mt-[calc(var(--i)*3rem)]"
              >
                <div className="relative aspect-video w-full border border-gradus-border bg-surface overflow-hidden">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                  />
                </div>

                <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-gradus-border pt-4">
                  <span className="label-utility text-accent-text">{post.category}</span>
                  <span className="label-utility text-text-secondary whitespace-nowrap">{post.date}</span>
                </div>

                <h2 className="mt-4 text-heading font-display text-text-primary line-clamp-3">
                  {post.title}
                </h2>
                <p className="mt-3 text-caption text-text-secondary line-clamp-4">
                  {post.excerpt}
                </p>

                <p className="mt-6 label-utility text-text-secondary flex items-center justify-between gap-4">
                  <span>{post.author}</span>
                  <span className="inline-flex items-center gap-2 group-hover:text-text-primary transition-colors duration-300">
                    Lire l&apos;article
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true" />
                  </span>
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer projects={projects} />
    </div>
  );
}
