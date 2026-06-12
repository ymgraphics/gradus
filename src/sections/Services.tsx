"use client";

import { motion, useReducedMotion, Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageContext";

export default function Services() {
  const { t, lang } = useLanguage();
  const reduced = useReducedMotion();
  const fr = lang === "fr";

  // Twelve services consolidated into six disciplines — the index, not a card grid
  const disciplines = [
    {
      num: "01",
      title: fr ? "Identité" : "Identity",
      note: fr ? "logo · charte · naming · guidelines" : "logo · guidelines · naming · brand systems",
      contact: fr ? "Identité Visuelle" : "Brand Identity",
    },
    {
      num: "02",
      title: "Digital",
      note: fr ? "web · e-commerce · community management" : "web · e-commerce · community management",
      contact: "Web Design",
    },
    {
      num: "03",
      title: "Image",
      note: fr ? "photo · vidéo · 3D · CGI" : "photo · video · 3D · CGI",
      contact: fr ? "Photo & Vidéo" : "Photo & Video",
    },
    {
      num: "04",
      title: fr ? "Stratégie" : "Strategy",
      note: fr ? "positionnement · campagnes · médias" : "positioning · campaigns · media",
      contact: fr ? "Stratégies Marketing" : "Marketing Strategies",
    },
    {
      num: "05",
      title: "Print",
      note: fr ? "packaging · édition · affichage" : "packaging · editorial · signage",
      contact: fr ? "Design Graphique" : "Graphic Design",
    },
    {
      num: "06",
      title: "Production",
      note: fr ? "événements · projets hors-normes" : "events · extraordinary projects",
      contact: fr ? "Production Unique" : "Unique Production",
    },
  ];

  const row: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : 24 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  return (
    <section id="services" className="section-y bg-void relative">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16 md:mb-24"
        >
          <p className="label-utility mb-6 flex items-center gap-3">
            <span className="inline-block w-2 h-2 bg-accent" aria-hidden="true" />
            {fr ? "Disciplines" : "Disciplines"}
          </p>
          <h2 className="text-display-lg font-display text-text-primary">
            {t("services.title1")} {t("services.title2")}
          </h2>
        </motion.div>

        <div role="list">
          {disciplines.map((d, i) => (
            <motion.div
              key={d.num}
              role="listitem"
              custom={i}
              variants={row}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              style={{ "--i": i } as React.CSSProperties}
              className="border-t border-gradus-border last:border-b md:pl-[calc(var(--i)*2rem)]"
            >
              <Link
                href={`/contact?service=${encodeURIComponent(d.contact)}`}
                className="step-x group grid grid-cols-[2.5rem_1fr_auto] md:grid-cols-[4rem_1fr_1fr_auto] items-baseline gap-4 md:gap-8 py-7 md:py-9 interactive"
              >
                <span className="label-utility text-text-secondary group-hover:text-accent transition-colors duration-300">
                  {d.num}
                </span>
                <h3 className="text-display-md font-display text-text-primary group-hover:text-text-primary transition-colors">
                  {d.title}
                </h3>
                <span className="label-utility hidden md:block text-text-secondary">
                  ↳ {d.note}
                </span>
                <ArrowUpRight
                  className="w-5 h-5 self-center text-text-secondary group-hover:text-accent transition-colors duration-300"
                  aria-hidden="true"
                />
              </Link>
              <span className="label-utility md:hidden block pb-6 -mt-2 text-text-secondary">
                ↳ {d.note}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
