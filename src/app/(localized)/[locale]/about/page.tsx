import { Metadata } from "next";
import { getDictionary } from "@/i18n/getDictionary";
import type { Locale } from "@/i18n-config";

import Navbar from "@/layouts/Navbar";
import Footer from "@/layouts/Footer";
import Image from "next/image";
import Link from "next/link";
import { getRestTeamMembers, getRestProjects } from "@/lib/firebase-rest";
import { defaultProjects, SITE_URL } from "@/lib/constants";
import { Sparkles, Heart, Zap, Award, CheckCircle2, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const dict = await getDictionary(locale);
  return {
    title: dict.seo.about.title,
    description: dict.seo.about.description,
    alternates: {
      canonical: `${locale === "fr" ? "" : "/" + locale}/about`,
    },
  };
}

export default async function AboutPage() {
  const baseUrl = SITE_URL.endsWith("/") ? SITE_URL.slice(0, -1) : SITE_URL;

  // Fetch dynamic content
  let team: any[] = [];
  let projects: any[] = [];
  try {
    const [teamRes, projectsRes] = await Promise.all([
      getRestTeamMembers(),
      getRestProjects()
    ]);
    team = teamRes || [];
    projects = projectsRes || defaultProjects;
  } catch (error) {
    console.error("[AboutPage] Failed to fetch data:", error);
    projects = defaultProjects;
  }

  // Localized team members fallback if database is offline or empty
  if (team.length === 0) {
    team = [
      { id: "1", name: "Zouhair Elghamry", role: "CEO & Fondateur", imageUrl: "/assets/team/Zouhair.webp", tags: ["Direction", "Stratégie"] },
      { id: "2", name: "Rim ElMouhib", role: "Directrice Artistique", imageUrl: "/assets/team/rim.webp", tags: ["Art Direction", "Design"] },
      { id: "4", name: "Yasser Mokhtari", role: "Senior Graphic Designer", imageUrl: "/assets/team/yasser.webp", tags: ["Design", "UI/UX"] },
      { id: "7", name: "Chaimaa Toufiq", role: "Community Manager", imageUrl: "/assets/team/shaymae.webp", tags: ["Social Media", "Content"] }
    ];
  }

  const aboutSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${baseUrl}/about/#breadcrumb`,
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
            "name": "À Propos",
            "item": `${baseUrl}/about`
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white selection:bg-gradus-gold selection:text-black font-body">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <Navbar />

      {/* Hero Narrative */}
      <section className="relative pt-36 pb-20 md:py-48 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-gradus-gold/5 blur-[150px] rounded-full" />
          <div className="absolute bottom-[10%] left-[-15%] w-[45%] h-[45%] bg-white/[0.01] blur-[120px] rounded-full" />
        </div>

        <div className="container relative z-10 max-w-7xl px-6 md:px-12 lg:px-24 mx-auto text-left">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-8">
              <Sparkles size={12} className="text-gradus-gold" />
              <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-white/70">
                L'Agence Créative
              </span>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-display font-black leading-[0.9] tracking-normal text-white">
              L'excellence visuelle et digitale à <span className="text-gradus-gold">Casablanca</span>.
            </h1>
            <p className="mt-10 text-lg md:text-2xl text-white/50 leading-relaxed font-light font-body max-w-3xl">
              Gradus Agency s'impose comme un partenaire stratégique de premier plan. Nous regroupons une élite de directeurs artistiques, de stratèges digitaux et de producteurs audiovisuels dédiés à l'ascension de votre marque sur le marché marocain et international.
            </p>
          </div>
        </div>
      </section>

      {/* Core values */}
      <section className="py-24 border-t border-white/5 bg-gradient-to-b from-[#080808] to-[#0b0b0b]">
        <div className="container max-w-7xl px-6 md:px-12 lg:px-24 mx-auto text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-4">
              <h2 className="text-accent-text font-mono text-[11px] tracking-[0.5em] uppercase font-bold mb-6">
                Nos Principes Fondamentaux
              </h2>
              <h3 className="text-3xl md:text-5xl font-display font-bold leading-tight">
                L'infrastructure de notre réussite.
              </h3>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="liquid-glass p-8 rounded-3xl border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-gradus-gold/10 flex items-center justify-center text-gradus-gold mb-6">
                  <Zap size={18} />
                </div>
                <h4 className="text-xl font-heading font-bold mb-3">Audace Créative</h4>
                <p className="text-white/60 text-sm leading-relaxed">
                  Concevoir des identités visuelles d'exception. Nous élaborons des directions artistiques novatrices conçues spécifiquement pour dominer votre secteur d'activité.
                </p>
              </div>

              <div className="liquid-glass p-8 rounded-3xl border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-gradus-gold/10 flex items-center justify-center text-gradus-gold mb-6">
                  <Award size={18} />
                </div>
                <h4 className="text-xl font-heading font-bold mb-3">Précision Analytique</h4>
                <p className="text-white/60 text-sm leading-relaxed">
                  Fonder chaque décision marketing sur des données tangibles. Nous structurons des stratégies d'acquisition digitale optimisées pour maximiser votre retour sur investissement.
                </p>
              </div>

              <div className="liquid-glass p-8 rounded-3xl border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-gradus-gold/10 flex items-center justify-center text-gradus-gold mb-6">
                  <Heart size={18} />
                </div>
                <h4 className="text-xl font-heading font-bold mb-3">Partenariat Stratégique</h4>
                <p className="text-white/60 text-sm leading-relaxed">
                  Opérer comme une extension directe de votre entreprise. Nous intégrons vos objectifs commerciaux globaux pour garantir une croissance pérenne et mesurable.
                </p>
              </div>

              <div className="liquid-glass p-8 rounded-3xl border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-gradus-gold/10 flex items-center justify-center text-gradus-gold mb-6">
                  <CheckCircle2 size={18} />
                </div>
                <h4 className="text-xl font-heading font-bold mb-3">Exigence Opérationnelle</h4>
                <p className="text-white/60 text-sm leading-relaxed">
                  Garantir une exécution irréprochable des projets. Nous maintenons un standard d'excellence absolu sur la production audiovisuelle et le développement technologique.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Team Grid */}
      <section className="py-24 border-t border-white/5 bg-[#0b0b0b]">
        <div className="container max-w-7xl px-6 md:px-12 lg:px-24 mx-auto text-left">
          <div className="flex items-center gap-4 mb-16">
            <span className="w-12 h-[1px] bg-gradus-gold/30" />
            <h2 className="text-accent-text font-mono text-[11px] tracking-[0.5em] uppercase font-bold">
              Le Conseil Exécutif
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member: any) => (
              <div key={member.id} className="liquid-glass border border-white/5 rounded-3xl overflow-hidden group">
                <div className="relative aspect-[4/5] bg-white/[0.02]">
                  {member.imageUrl ? (
                    <Image
                      src={member.imageUrl}
                      alt={member.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/10 font-black text-6xl">
                      G
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  
                  <div className="absolute bottom-6 left-6 right-6">
                    <h4 className="text-lg font-heading font-bold text-white mb-1">
                      {member.name}
                    </h4>
                    <p className="text-accent-text text-[11px] font-mono uppercase tracking-widest mb-3">
                      {member.role}
                    </p>
                    <div className="flex flex-wrap gap-1.5 opacity-60">
                      {(member.tags || []).slice(0, 2).map((tag: string) => (
                        <span key={tag} className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/10 text-white border border-white/5">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="py-24 border-t border-white/5 bg-gradient-to-b from-[#0b0b0b] to-[#080808] relative overflow-hidden">
        <div className="container max-w-5xl px-6 text-center relative z-10 mx-auto">
          <div className="liquid-glass p-12 md:p-20 rounded-[48px] border border-white/5 flex flex-col items-center shadow-3xl">
            <h2 className="text-3xl md:text-5xl font-display font-black leading-tight mb-8">
              Confiez votre croissance digitale à notre agence.
            </h2>
            <p className="text-white/50 text-base md:text-lg max-w-2xl leading-relaxed mb-12 font-light">
              Du développement d'une identité visuelle prestigieuse à la conception de plateformes web performantes, notre équipe dirigeante orchestre votre ascension sur le marché.
            </p>
            <Link
              href="/contact"
              className="px-12 py-6 rounded-full bg-gradus-gold text-gradus-primary font-bold text-lg hover:scale-105 hover:shadow-[0_0_30px_rgba(96,80,220,0.3)] transition-all duration-500 flex items-center gap-3"
            >
              Initier une Collaboration
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <Footer projects={projects} />
    </div>
  );
}
