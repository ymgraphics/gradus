import { Metadata } from "next";
import { getDictionary } from "@/i18n/getDictionary";
import type { Locale } from "@/i18n-config";

import Navbar from "@/layouts/Navbar";
import Footer from "@/layouts/Footer";
import Image from "next/image";
import Link from "next/link";
import { getRestProjects } from "@/lib/firebase-rest";
import { defaultProjects, SITE_URL } from "@/lib/constants";
import { Calendar, User, ArrowRight, Sparkles, Newspaper } from "lucide-react";

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
  } catch (error) {
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
    <div className="min-h-screen bg-[#080808] text-white selection:bg-gradus-gold selection:text-black font-body">
      <Navbar />

      {/* Script injection for structured SEO blog data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />

      {/* Hero Header */}
      <section className="relative pt-36 pb-20 md:py-48 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gradus-gold/5 blur-[150px] rounded-full" />
          <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-white/[0.02] blur-[120px] rounded-full" />
        </div>

        <div className="container relative z-10 max-w-7xl px-6 md:px-12 lg:px-24 mx-auto text-left">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-8">
              <Newspaper size={12} className="text-gradus-gold" />
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/70">
                Insights & Inspirations
              </span>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-display font-black leading-[0.9] tracking-normal text-white">
              Le Journal de <span className="text-gradus-gold">la Créativité.</span>
            </h1>
            <p className="mt-10 text-lg md:text-2xl text-white/50 leading-relaxed font-light font-body max-w-3xl">
              Secrets de production vidéo, guides de branding, analyses de campagnes et retours d'expérience de notre collectif à Casablanca.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Cards Grid */}
      <section className="py-24 border-t border-white/5 bg-gradient-to-b from-[#080808] to-[#0b0b0b]">
        <div className="container max-w-7xl px-6 md:px-12 lg:px-24 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article key={post.id} className="liquid-glass border border-white/5 rounded-3xl overflow-hidden hover:border-white/15 transition-all duration-700 hover:-translate-y-2 group flex flex-col justify-between text-left">
                <div>
                  <div className="relative aspect-video w-full bg-white/[0.02] overflow-hidden">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80"
                    />
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-[9px] font-mono tracking-wider uppercase text-gradus-gold">
                      {post.category}
                    </div>
                  </div>

                  <div className="p-8">
                    {/* Meta info row */}
                    <div className="flex items-center gap-4 text-white/30 text-[10px] font-mono uppercase tracking-widest mb-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={10} />
                        <span>{post.date}</span>
                      </div>
                      <div className="w-1 h-1 bg-white/20 rounded-full" />
                      <div className="flex items-center gap-1.5">
                        <User size={10} />
                        <span>{post.author}</span>
                      </div>
                    </div>

                    <h3 className="text-xl md:text-2xl font-heading font-bold text-white group-hover:text-gradus-gold transition-colors duration-300 mb-4 line-clamp-3 leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-white/40 text-sm leading-relaxed font-body line-clamp-4">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-8 pt-0 mt-auto">
                  <div className="inline-flex items-center gap-2 text-xs font-mono text-white/50 group-hover:text-gradus-gold transition-colors duration-300 font-bold uppercase tracking-wider">
                    Lire l'article
                    <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-300 text-gradus-gold" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer projects={projects} />
    </div>
  );
}
