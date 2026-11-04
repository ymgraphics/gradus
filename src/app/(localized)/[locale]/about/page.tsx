import { Metadata } from "next";
import { getDictionary } from "@/i18n/getDictionary";
import type { Locale } from "@/i18n-config";

import Navbar from "@/layouts/Navbar";
import Footer from "@/layouts/Footer";
import Image from "next/image";
import Link from "next/link";
import { getRestTeamMembers, getRestProjects } from "@/lib/firebase-rest";
import { defaultProjects, SITE_URL } from "@/lib/constants";
import { ArrowRight } from "lucide-react";

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

  const values = [
    {
      title: "Audace Créative",
      desc: "Concevoir des identités visuelles d'exception. Nous élaborons des directions artistiques novatrices conçues spécifiquement pour dominer votre secteur d'activité.",
    },
    {
      title: "Précision Analytique",
      desc: "Fonder chaque décision marketing sur des données tangibles. Nous structurons des stratégies d'acquisition digitale optimisées pour maximiser votre retour sur investissement.",
    },
    {
      title: "Partenariat Stratégique",
      desc: "Opérer comme une extension directe de votre entreprise. Nous intégrons vos objectifs commerciaux globaux pour garantir une croissance pérenne et mesurable.",
    },
    {
      title: "Exigence Opérationnelle",
      desc: "Garantir une exécution irréprochable des projets. Nous maintenons un standard d'excellence absolu sur la production audiovisuelle et le développement technologique.",
    },
  ];

  return (
    <div className="min-h-screen bg-void text-text-primary font-body">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <Navbar />

      {/* Hero Narrative */}
      <section className="relative pt-40 pb-20 md:pt-48 md:pb-28">
        <div className="container">
          <p className="label-utility mb-10 flex items-center gap-3">
            <span className="inline-block w-2 h-2 bg-accent" aria-hidden="true" />
            L&apos;Agence Créative
          </p>
          <h1 className="text-display-xl font-display text-text-primary max-w-6xl">
            L&apos;excellence visuelle et digitale à <span className="text-accent">Casablanca</span>.
          </h1>
          <p className="mt-12 md:ml-[16.666%] text-body text-text-secondary max-w-2xl">
            Gradus Agency s&apos;impose comme un partenaire stratégique de premier plan. Nous regroupons une élite de directeurs artistiques, de stratèges digitaux et de producteurs audiovisuels dédiés à l&apos;ascension de votre marque sur le marché marocain et international.
          </p>
        </div>
      </section>

      {/* Core values */}
      <section className="section-y border-t border-gradus-border">
        <div className="container">
          <div className="mb-16 md:mb-24">
            <h2 className="label-utility mb-6 flex items-center gap-3">
              <span className="inline-block w-2 h-2 bg-accent" aria-hidden="true" />
              Nos Principes Fondamentaux
            </h2>
            <p className="text-display-lg font-display text-text-primary">
              L&apos;infrastructure de notre réussite.
            </p>
          </div>

          {/* Four principles, each one a step lower than the last */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {values.map((value, i) => (
              <div
                key={value.title}
                style={{ "--i": i } as React.CSSProperties}
                className="group flex flex-col items-start border-t border-gradus-border pt-8 lg:mt-[calc(var(--i)*3rem)]"
              >
                <span className="label-utility text-text-secondary group-hover:text-accent-text transition-colors duration-300 mb-8">
                  0{i + 1}
                </span>
                <h3 className="text-heading font-display text-text-primary mb-4">{value.title}</h3>
                <p className="text-caption text-text-secondary">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate Team Grid */}
      <section className="section-y border-t border-gradus-border">
        <div className="container">
          <h2 className="label-utility mb-16 md:mb-24 flex items-center gap-3">
            <span className="inline-block w-2 h-2 bg-accent" aria-hidden="true" />
            Le Conseil Exécutif
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {team.map((member: any, i: number) => (
              <div
                key={member.id}
                style={{ "--i": i % 4 } as React.CSSProperties}
                className="group lg:mt-[calc(var(--i)*2rem)]"
              >
                <div className="relative aspect-[4/5] border border-gradus-border bg-surface overflow-hidden">
                  {member.imageUrl ? (
                    <Image
                      src={member.imageUrl}
                      alt={member.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover grayscale group-hover:grayscale-0 transition-[filter] duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-display-md font-display text-text-primary/20" aria-hidden="true">
                      G
                    </div>
                  )}
                </div>
                <h3 className="mt-4 text-heading font-display text-text-primary">
                  {member.name}
                </h3>
                <p className="label-utility text-accent-text mt-2">
                  {member.role}
                </p>
                {(member.tags || []).length > 0 && (
                  <p className="label-utility text-text-secondary mt-2">
                    {(member.tags || []).slice(0, 2).join(" · ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-y border-t border-gradus-border">
        <div className="container">
          <h2 className="text-display-lg font-display text-text-primary max-w-5xl mb-10">
            Confiez votre croissance digitale à notre agence.
          </h2>
          <div className="md:ml-[16.666%] flex flex-col items-start gap-10">
            <p className="text-body text-text-secondary max-w-2xl">
              Du développement d&apos;une identité visuelle prestigieuse à la conception de plateformes web performantes, notre équipe dirigeante orchestre votre ascension sur le marché.
            </p>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-4 border border-accent px-8 py-4 label-utility text-text-primary hover:bg-accent hover:text-text-primary transition-colors duration-300"
            >
              Initier une Collaboration
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <Footer projects={projects} />
    </div>
  );
}
