"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { Project } from "@/lib/constants";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Sparkles, MapPin, CheckCircle2, ChevronRight, Phone } from "lucide-react";
import Navbar from "@/layouts/Navbar";
import Footer from "@/layouts/Footer";

interface ServiceClientProps {
  slug: string;
  serviceData: any;
  projects: Project[];
}

export default function ServiceClient({ slug, serviceData, projects }: ServiceClientProps) {
  const { lang, t } = useLanguage();
  const content = serviceData;

  const currentTitle = content.title[lang];
  const currentH1 = content.h1[lang];
  const currentIntro = content.intro[lang];
  const currentFeatures = content.features;

  // Filter projects by category
  const filteredProjects = projects.filter((p) => {
    if (content.categoryFilter === "all") return true;
    return p.category.toLowerCase().includes(content.categoryFilter.toLowerCase()) || 
           p.tags.some((tag: string) => tag.toLowerCase().includes(content.categoryFilter.toLowerCase()));
  });

  return (
    <div className="min-h-screen bg-[#080808] text-white selection:bg-gradus-gold selection:text-black font-body">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 md:py-48 overflow-hidden">
        {/* Background Mesh elements */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-gradus-gold/5 blur-[150px] rounded-full" />
          <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-white/[0.02] blur-[120px] rounded-full" />
          <div
            className="absolute inset-0 opacity-[0.03] z-10"
            style={{
              backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="container relative z-10 max-w-7xl px-6 md:px-12 lg:px-24 mx-auto">
          <div className="max-w-4xl text-left">
            {/* Local Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-8"
            >
              <MapPin size={12} className="text-gradus-gold" />
              <span className="text-[9px] md:text-[10px] font-mono tracking-[0.25em] uppercase text-white/70">
                Casablanca · Maroc
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            </motion.div>

            {/* Main H1 Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl md:text-8xl font-display font-black leading-[0.9] tracking-normal text-white drop-shadow-2xl"
            >
              {currentH1}
            </motion.h1>

            {/* Sub-intro Copy */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-10 text-lg md:text-2xl text-white/50 leading-relaxed font-light font-body max-w-3xl"
            >
              {currentIntro}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-6"
            >
              <Link
                href="/contact"
                className="liquid-glass glass-refraction bg-gradus-gold text-gradus-primary px-10 py-5 rounded-full font-bold hover:scale-105 hover:shadow-[0_0_40px_rgba(96,80,220,0.3)] transition-all duration-500 interactive text-base flex items-center gap-3"
              >
                {lang === "fr" ? "Démarrer un projet" : "Start a project"}
                <ArrowRight size={18} />
              </Link>
              <Link
                href="#case-studies"
                className="group flex items-center gap-3 px-8 py-4 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-white font-medium hover:bg-white/10 hover:border-white/20 transition-all duration-500 interactive"
              >
                {lang === "fr" ? "Études de cas" : "View Case Studies"}
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-500" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Capability Features */}
      <section className="py-24 border-t border-white/5 bg-gradient-to-b from-[#080808] to-[#0b0b0b]">
        <div className="container max-w-7xl px-6 md:px-12 lg:px-24 mx-auto">
          <div className="flex items-center gap-4 mb-16">
            <span className="w-12 h-[1px] bg-gradus-gold/30" />
            <h2 className="text-gradus-gold font-mono text-[10px] tracking-[0.5em] uppercase font-bold text-left">
              {lang === "fr" ? "Nos Expertises Locales" : "Our Capabilities"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {currentFeatures.map((feat: any, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="liquid-glass p-10 rounded-[32px] border border-white/5 hover:border-white/15 transition-all duration-700 hover:-translate-y-2 group text-left"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gradus-gold mb-8 group-hover:bg-gradus-gold group-hover:text-gradus-primary transition-all duration-500 shadow-md">
                  <Sparkles size={20} />
                </div>
                <h3 className="text-2xl font-heading font-bold text-white group-hover:text-gradus-gold transition-colors duration-300 mb-4">
                  {feat.title[lang]}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed font-body">
                  {feat.desc[lang]}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Curated Client Portfolio Grid */}
      <section id="case-studies" className="py-24 md:py-32 border-t border-white/5 relative bg-[#0b0b0b]">
        <div className="container max-w-7xl px-6 md:px-12 lg:px-24 mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="text-left">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-12 h-[1px] bg-gradus-gold/30" />
                <span className="text-gradus-gold font-mono text-[10px] tracking-[0.5em] uppercase font-bold">
                  {lang === "fr" ? "Études de cas réelles" : "Real Case Studies"}
                </span>
              </div>
              <h2 className="text-4xl md:text-6xl font-display font-bold tracking-normal">
                {lang === "fr" ? "Impact Créatif à Casablanca" : "Creative Impact in Casablanca"}
              </h2>
            </div>
            <Link
              href="/#portfolio"
              className="text-sm font-mono tracking-[0.1em] text-white/50 hover:text-gradus-gold transition-colors flex items-center gap-2 group self-start md:self-end uppercase"
            >
              {lang === "fr" ? "Voir tout le portfolio" : "View Entire Portfolio"}
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {filteredProjects.map((project, idx) => {
                const projectSlug = `${project.id}-${project.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    className="group relative"
                  >
                    <Link
                      href={`/projects/${projectSlug}`}
                      className="liquid-glass relative block aspect-[4/3] rounded-[32px] overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-700 shadow-2xl"
                    >
                      <Image
                        src={project.coverImage || "/assets/placeholder.jpg"}
                        alt={`Projet ${project.client} à Casablanca`}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-1000 group-hover:scale-105 grayscale group-hover:grayscale-0 opacity-40 group-hover:opacity-75"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80" />

                      <div className="absolute bottom-10 left-10 right-10 flex flex-col justify-end text-left">
                        <span className="bg-white/10 backdrop-blur-xl px-4 py-1.5 rounded-full text-white/90 text-[9px] font-mono tracking-widest uppercase border border-white/10 self-start mb-4">
                          {project.client}
                        </span>
                        <h3 className="text-3xl font-heading font-bold text-white group-hover:text-gradus-gold transition-colors duration-300">
                          {project.client}
                        </h3>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-white/40 text-[9px] font-mono tracking-widest uppercase">
                            {project.category}
                          </span>
                          <span className="w-4 h-[1px] bg-white/20" />
                          <span className="text-gradus-gold text-[9px] font-mono tracking-widest uppercase">
                            {project.year}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-white/[0.01] border border-white/5 rounded-[32px]">
              <p className="text-white/40 font-mono text-sm uppercase tracking-widest">
                {lang === "fr" ? "Aucun projet de cette catégorie pour le moment." : "No projects in this category yet."}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Local trust & Call to action */}
      <section className="py-24 border-t border-white/5 bg-gradient-to-b from-[#0b0b0b] to-[#080808] relative overflow-hidden">
        <div className="container max-w-5xl px-6 text-center relative z-10 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="liquid-glass p-12 md:p-20 rounded-[48px] border border-white/5 flex flex-col items-center shadow-3xl"
          >
            <MapPin size={40} className="text-gradus-gold animate-bounce mb-8" />
            <h2 className="text-3xl md:text-5xl font-display font-black leading-tight mb-8">
              {lang === "fr" ? "Discutons de votre stratégie digitale à Casablanca" : "Let's strategize your digital growth in Casablanca"}
            </h2>
            <p className="text-white/50 text-base md:text-lg max-w-2xl leading-relaxed mb-12 font-light">
              {lang === "fr"
                ? "Nos bureaux au Bd Brahim Roudani sont ouverts pour vous accueillir. Que vous ayez besoin de booster votre acquisition client, de refondre votre branding ou de lancer des Reels viraux, notre équipe est là."
                : "Our offices at Bd Brahim Roudani are open to welcome you. Whether you need to boost acquisition, redesign your branding, or roll out viral Reels campaigns, we've got you covered."}
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Link
                href="/contact"
                className="px-12 py-6 rounded-full bg-gradus-gold text-gradus-primary font-bold text-lg hover:scale-105 hover:shadow-[0_0_30px_rgba(96,80,220,0.3)] transition-all duration-500 flex items-center gap-3"
              >
                <Phone size={18} />
                {lang === "fr" ? "Planifier un rendez-vous" : "Book a Meeting"}
              </Link>
              <a
                href="mailto:contact@gradus.ma"
                className="text-white/40 hover:text-white transition-colors font-mono text-sm uppercase tracking-widest px-8 py-4 rounded-full border border-white/10 hover:bg-white/5 transition-all duration-500"
              >
                contact@gradus.ma
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer projects={projects} />
    </div>
  );
}
