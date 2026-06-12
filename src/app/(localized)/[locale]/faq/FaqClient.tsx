"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { HelpCircle, ChevronDown, Sparkles, MessageCircle, ArrowRight } from "lucide-react";
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
    <div className="min-h-screen bg-[#080808] text-white selection:bg-gradus-gold selection:text-black font-body">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-36 pb-20 md:py-48 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-gradus-gold/5 blur-[150px] rounded-full" />
          <div className="absolute bottom-[20%] left-[-10%] w-[40%] h-[40%] bg-white/[0.02] blur-[120px] rounded-full" />
        </div>

        <div className="container relative z-10 max-w-7xl px-6 md:px-12 lg:px-24 mx-auto text-left">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-8">
              <HelpCircle size={12} className="text-gradus-gold" />
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/70">
                FAQ & Aide
              </span>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-display font-black leading-[0.9] tracking-normal text-white">
              Vos Questions. <br />Nos <span className="text-gradus-gold">Réponses.</span>
            </h1>
            <p className="mt-10 text-lg md:text-2xl text-white/50 leading-relaxed font-light font-body max-w-3xl">
              Transparence totale. Nous répondons ici aux questions fréquemment posées sur nos processus créatifs, nos budgets, et nos méthodes d'accompagnement.
            </p>
          </div>
        </div>
      </section>

      {/* Accordion list */}
      <section className="py-24 border-t border-white/5 bg-gradient-to-b from-[#080808] to-[#0b0b0b]">
        <div className="container max-w-5xl px-6 mx-auto">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-3 justify-start mb-16">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id as any);
                  setExpandedId(null);
                }}
                className={`px-6 py-3 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300 ${
                  activeCategory === cat.id
                    ? "bg-gradus-gold text-gradus-primary font-bold shadow-[0_0_20px_rgba(96,80,220,0.2)]"
                    : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                {cat.label[lang]}
              </button>
            ))}
          </div>

          {/* Accordion container */}
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {filteredFaq.map((faq) => {
                const isExpanded = expandedId === faq.id;
                return (
                  <motion.div
                    key={faq.id}
                    layout
                    className="liquid-glass border border-white/5 rounded-[24px] overflow-hidden hover:border-white/15 transition-all duration-500 text-left"
                  >
                    <button
                      onClick={() => toggleExpand(faq.id)}
                      className="w-full p-8 flex items-center justify-between gap-6 text-left group"
                    >
                      <h3 className={`text-lg md:text-xl font-heading font-bold transition-colors duration-300 ${
                        isExpanded ? "text-gradus-gold" : "text-white group-hover:text-gradus-gold"
                      }`}>
                        {faq.question[lang]}
                      </h3>
                      <div className={`w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 group-hover:text-white transition-all duration-300 shrink-0 ${
                        isExpanded ? "rotate-180 bg-gradus-gold text-gradus-primary" : ""
                      }`}>
                        <ChevronDown size={16} />
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <div className="px-8 pb-8 pt-2 text-white/50 text-sm md:text-base leading-relaxed font-body border-t border-white/5">
                            {faq.answer[lang]}
                          </div>
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

      {/* CTA Box */}
      <section className="py-24 border-t border-white/5 bg-gradient-to-b from-[#0b0b0b] to-[#080808] relative overflow-hidden">
        <div className="container max-w-5xl px-6 text-center relative z-10 mx-auto">
          <div className="liquid-glass p-12 md:p-20 rounded-[48px] border border-white/5 flex flex-col items-center shadow-3xl">
            <MessageCircle size={40} className="text-gradus-gold mb-8 animate-pulse" />
            <h2 className="text-3xl md:text-5xl font-display font-black leading-tight mb-8">
              Une autre question en tête ?
            </h2>
            <p className="text-white/50 text-base md:text-lg max-w-2xl leading-relaxed mb-12 font-light">
              N'hésitez pas à nous envoyer un message direct. Notre équipe est super réactive et vous répondra en moins de 24 heures.
            </p>
            <Link
              href="/contact"
              className="px-12 py-6 rounded-full bg-gradus-gold text-gradus-primary font-bold text-lg hover:scale-105 hover:shadow-[0_0_30px_rgba(96,80,220,0.3)] transition-all duration-500 flex items-center gap-3"
            >
              Envoyer un message
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <Footer projects={projects} />
    </div>
  );
}
