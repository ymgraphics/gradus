"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { Project } from "@/lib/constants";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Navbar from "@/layouts/Navbar";
import Footer from "@/layouts/Footer";

interface ServiceFeature {
  title: Record<string, string>;
  desc: Record<string, string>;
}

interface ServiceClientProps {
  slug: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  serviceData: any;
  projects: Project[];
  /** Server-rendered block shown after the page content, before the footer. */
  related?: React.ReactNode;
}

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
};

export default function ServiceClient({ serviceData, projects, related }: ServiceClientProps) {
  const { lang } = useLanguage();
  const fr = lang === "fr";
  const content = serviceData;

  const currentH1 = content.h1[lang];
  const currentIntro = content.intro[lang];
  const currentFeatures: ServiceFeature[] = content.features;

  // Filter projects by category
  const filteredProjects = projects.filter((p) => {
    if (content.categoryFilter === "all") return true;
    return p.category.toLowerCase().includes(content.categoryFilter.toLowerCase()) ||
           p.tags.some((tag: string) => tag.toLowerCase().includes(content.categoryFilter.toLowerCase()));
  });

  return (
    <div className="min-h-screen bg-void text-text-primary font-body">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-36 pb-20 md:pt-48 md:pb-28">
        <div className="container">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="label-utility mb-10 flex items-center gap-3"
          >
            <span className="inline-block w-2 h-2 bg-accent" aria-hidden="true" />
            Casablanca · Maroc
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-display-xl font-display text-text-primary max-w-5xl"
          >
            {currentH1}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-14 md:ml-[8.333%] flex flex-col gap-10 max-w-2xl"
          >
            <p className="text-body text-text-secondary">{currentIntro}</p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-10">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-4 border border-accent px-8 py-4 label-utility text-text-primary hover:bg-accent hover:text-text-primary transition-colors duration-300 interactive"
              >
                {fr ? "Démarrer un projet" : "Start a project"}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true" />
              </Link>
              <Link
                href="#case-studies"
                className="link-underline label-utility text-text-secondary hover:text-text-primary transition-colors interactive"
              >
                {fr ? "Études de cas" : "View Case Studies"}
              </Link>
            </div>
          </motion.div>

          <div className="step-rule mt-20" style={{ "--step-at": "22%" } as React.CSSProperties} />
        </div>
      </section>

      {/* Capabilities */}
      <section className="section-y border-t border-gradus-border">
        <div className="container">
          <motion.div {...fadeUp} className="mb-16 md:mb-24">
            <p className="label-utility mb-6 flex items-center gap-3">
              <span className="inline-block w-2 h-2 bg-accent" aria-hidden="true" />
              {fr ? "Nos Expertises Locales" : "Our Capabilities"}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-12">
            {currentFeatures.map((feat, idx) => (
              <motion.div
                key={idx}
                {...fadeUp}
                transition={{ delay: idx * 0.12 }}
                style={{ "--i": idx } as React.CSSProperties}
                className="group flex flex-col items-start border-t border-gradus-border pt-8 md:mt-[calc(var(--i)*3rem)]"
              >
                <span className="label-utility text-text-secondary group-hover:text-accent-text transition-colors duration-300 mb-8">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <h3 className="text-heading font-display text-text-primary mb-4">
                  {feat.title[lang]}
                </h3>
                <p className="text-caption text-text-secondary leading-relaxed">
                  {feat.desc[lang]}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Case studies */}
      <section id="case-studies" className="section-y border-t border-gradus-border">
        <div className="container">
          <motion.div {...fadeUp} className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 gap-8">
            <div>
              <p className="label-utility mb-6 flex items-center gap-3">
                <span className="inline-block w-2 h-2 bg-accent" aria-hidden="true" />
                {fr ? "Études de cas réelles" : "Real Case Studies"}
              </p>
              <h2 className="text-display-lg font-display text-text-primary">
                {fr ? "Impact Créatif à Casablanca" : "Creative Impact in Casablanca"}
              </h2>
            </div>
            <Link
              href="/#portfolio"
              className="link-underline label-utility text-text-secondary hover:text-text-primary transition-colors self-start md:self-end interactive"
            >
              {fr ? "Voir tout le portfolio" : "View Entire Portfolio"} →
            </Link>
          </motion.div>

          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-16">
              {filteredProjects.map((project, idx) => {
                const projectSlug = `${project.id}-${project.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
                return (
                  <motion.div
                    key={project.id}
                    {...fadeUp}
                    transition={{ delay: (idx % 2) * 0.1 }}
                    className={idx % 2 === 1 ? "md:mt-16" : ""}
                  >
                    <Link href={`/projects/${projectSlug}`} className="group block interactive">
                      <div className="relative aspect-[4/3] overflow-hidden border border-gradus-border bg-surface">
                        <Image
                          src={project.coverImage || "/assets/placeholder.jpg"}
                          alt={`Projet ${project.client} à Casablanca`}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        />
                      </div>
                      <div className="mt-4 flex items-baseline justify-between gap-4">
                        <h3 className="text-heading font-display text-text-primary">
                          {project.client}
                        </h3>
                        <span className="label-utility text-text-secondary text-right">
                          {project.category} — {project.year}
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="border-y border-gradus-border py-16">
              <p className="label-utility text-text-secondary">
                {fr ? "Aucun projet de cette catégorie pour le moment." : "No projects in this category yet."}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Local CTA */}
      <section className="section-y border-t border-gradus-border">
        <div className="container">
          <motion.h2
            {...fadeUp}
            className="text-display-lg font-display text-text-primary max-w-4xl mb-12"
          >
            {fr ? "Discutons de votre stratégie digitale à Casablanca" : "Let's strategize your digital growth in Casablanca"}
          </motion.h2>
          <motion.div
            {...fadeUp}
            transition={{ delay: 0.15 }}
            className="md:ml-[8.333%] flex flex-col gap-10 max-w-2xl"
          >
            <p className="text-body text-text-secondary">
              {fr
                ? "Nos bureaux au Bd Brahim Roudani sont ouverts pour vous accueillir. Que vous ayez besoin de booster votre acquisition client, de refondre votre branding ou de lancer des Reels viraux, notre équipe est là."
                : "Our offices at Bd Brahim Roudani are open to welcome you. Whether you need to boost acquisition, redesign your branding, or roll out viral Reels campaigns, we've got you covered."}
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-10">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-4 border border-accent px-8 py-4 label-utility text-text-primary hover:bg-accent hover:text-text-primary transition-colors duration-300 interactive"
              >
                {fr ? "Planifier un rendez-vous" : "Book a Meeting"}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true" />
              </Link>
              <a
                href="mailto:contact@gradus.ma"
                className="link-underline label-utility text-text-secondary hover:text-text-primary transition-colors interactive"
              >
                contact@gradus.ma
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {related}

      <Footer projects={projects} />
    </div>
  );
}
