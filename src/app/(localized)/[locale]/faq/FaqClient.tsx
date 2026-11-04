"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { ArrowRight } from "lucide-react";
import Navbar from "@/layouts/Navbar";
import Footer from "@/layouts/Footer";
import Link from "next/link";
import { Project } from "@/lib/constants";

interface FAQItem {
  id: string;
  question: { fr: string; en: string };
  answer: { fr: string; en: string };
  category: "general" | "branding" | "video" | "marketing";
}

interface FaqClientProps {
  projects: Project[];
  faqItems: FAQItem[];
}

export default function FaqClient({ projects, faqItems }: FaqClientProps) {
  const { lang } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<"all" | "general" | "branding" | "video" | "marketing">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = [
    { id: "all", label: { fr: "Tous", en: "All" } },
    { id: "general", label: { fr: "Général", en: "General" } },
    { id: "branding", label: { fr: "Branding", en: "Branding" } },
    { id: "video", label: { fr: "Production Vidéo", en: "Video Production" } },
    { id: "marketing", label: { fr: "Marketing Digital", en: "Digital Marketing" } },
  ];

  const filteredFaq = faqItems.filter((item) => {
    if (activeCategory === "all") return true;
    return item.category === activeCategory;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-void text-text-primary font-body">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-40 pb-20 md:pt-48 md:pb-28">
        <div className="container">
          <p className="label-utility mb-10 flex items-center gap-3">
            <span className="inline-block w-2 h-2 bg-accent" aria-hidden="true" />
            FAQ & Aide
          </p>
          <h1 className="text-display-xl font-display text-text-primary flex flex-col">
            <span>Vos Questions.</span>
            <span className="ml-[4%] md:ml-[8.333%]">
              Nos <span className="text-accent">Réponses.</span>
            </span>
          </h1>
          <p className="mt-12 md:ml-[16.666%] text-body text-text-secondary max-w-2xl">
            Transparence totale. Nous répondons ici aux questions fréquemment posées sur nos processus créatifs, nos budgets, et nos méthodes d&apos;accompagnement.
          </p>
        </div>
      </section>

      {/* Accordion list */}
      <section className="section-y border-t border-gradus-border">
        <div className="container">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-x-8 gap-y-4 mb-16 pb-6 border-b border-gradus-border">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                aria-pressed={activeCategory === cat.id}
                onClick={() => {
                  setActiveCategory(cat.id as typeof activeCategory);
                  setExpandedId(null);
                }}
                className={`label-utility transition-colors duration-300 ${
                  activeCategory === cat.id
                    ? "text-accent-text"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {cat.label[lang]}
              </button>
            ))}
          </div>

          {/* Accordion: hairline rows */}
          <div className="max-w-5xl">
            <AnimatePresence initial={false}>
              {filteredFaq.map((faq, i) => {
                const isExpanded = expandedId === faq.id;
                const panelId = `faq-panel-${faq.id}`;
                const buttonId = `faq-button-${faq.id}`;
                return (
                  <motion.div
                    key={faq.id}
                    layout
                    className="border-t border-gradus-border last:border-b text-left"
                  >
                    <h2>
                      <button
                        id={buttonId}
                        type="button"
                        onClick={() => toggleExpand(faq.id)}
                        aria-expanded={isExpanded}
                        aria-controls={panelId}
                        className="w-full py-7 md:py-8 grid grid-cols-[2.5rem_1fr_auto] md:grid-cols-[4rem_1fr_auto] items-baseline gap-4 md:gap-8 text-left group"
                      >
                        <span className={`label-utility transition-colors duration-300 ${isExpanded ? "text-accent-text" : "text-text-secondary group-hover:text-accent-text"}`}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-heading font-display text-text-primary">
                          {faq.question[lang]}
                        </span>
                        <span className="label-utility text-text-secondary group-hover:text-text-primary text-base leading-none self-center" aria-hidden="true">
                          {isExpanded ? "−" : "+"}
                        </span>
                      </button>
                    </h2>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          id={panelId}
                          role="region"
                          aria-labelledby={buttonId}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <p className="pb-8 pl-[calc(2.5rem+1rem)] md:pl-[calc(4rem+2rem)] pr-8 text-body text-text-secondary max-w-3xl">
                            {faq.answer[lang]}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-y border-t border-gradus-border">
        <div className="container">
          <h2 className="text-display-lg font-display text-text-primary mb-10">
            Une autre question en tête ?
          </h2>
          <div className="md:ml-[16.666%] flex flex-col items-start gap-10">
            <p className="text-body text-text-secondary max-w-2xl">
              N&apos;hésitez pas à nous envoyer un message direct. Notre équipe est super réactive et vous répondra en moins de 24 heures.
            </p>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-4 border border-accent px-8 py-4 label-utility text-text-primary hover:bg-accent hover:text-text-primary transition-colors duration-300"
            >
              Envoyer un message
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <Footer projects={projects} />
    </div>
  );
}
