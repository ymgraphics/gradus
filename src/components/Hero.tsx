"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Instagram, Linkedin, Facebook } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

export default function Hero() {
  const { t, lang } = useLanguage();
  const line1 = t("hero.title1").split(" ");
  const line2 = t("hero.title2").split(" ");

  const wordVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.8,
        ease: "easeOut",
      },
    }),
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* ── Full-Viewport Video Banner ──────────────────────────────────── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        >
          <source
            src="https://res.cloudinary.com/dxnjje6pf/video/upload/q_auto/f_auto/v1779352523/Gradus_Think_out_of_the_box_prob4_tvmddu.mp4"
            type="video/mp4"
          />
        </video>

        {/* Dark overlay for text readability */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
          }}
        />

        {/* Subtle dot grid on top of video */}
        <div
          className="absolute inset-0 opacity-[0.025] z-10"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Bottom fade into page background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gradus-primary z-10" />
      </div>

      <div className="container relative z-10 w-full lg:px-24">
        <div className="max-w-4xl">
          <h1 className="font-display flex flex-col gap-3">
            <div className="flex gap-3 md:gap-5 overflow-hidden">
              {line1.map((word, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={wordVariants}
                  className="text-[55px] sm:text-[75px] md:text-[90px] lg:text-[110px] font-light italic leading-[0.9] text-white/90 tracking-tight drop-shadow-2xl"
                >
                  {word}
                </motion.span>
              ))}
            </div>

            <div className="flex gap-3 md:gap-5 overflow-hidden pt-2">
              {line2.map((word, i) => (
                <motion.span
                  key={i}
                  custom={i + line1.length}
                  initial="hidden"
                  animate="visible"
                  variants={wordVariants}
                  className="text-[65px] sm:text-[85px] md:text-[100px] lg:text-[120px] font-black leading-[0.85] tracking-tighter text-glass drop-shadow-2xl"
                >
                  {word}
                </motion.span>
              ))}
            </div>

            <div className="overflow-hidden pb-6 pt-2">
              <motion.div
                custom={line1.length + line2.length}
                initial="hidden"
                animate="visible"
                variants={wordVariants}
                className="relative inline-block"
              >
                <span className="text-[65px] sm:text-[85px] md:text-[100px] lg:text-[120px] font-bold leading-[0.85] tracking-tighter text-glass drop-shadow-2xl">
                  {t("hero.title3")}
                </span>
                <motion.svg
                  className="absolute -bottom-2 md:-bottom-3 left-0 w-full h-4 md:h-5 overflow-visible"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ delay: 1.5, duration: 1.2, ease: "easeOut" }}
                >
                  <path
                    d="M0 5 Q 50 10 100 5"
                    fill="transparent"
                    stroke="#D4A843"
                    strokeWidth="4"
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_10px_rgba(212,168,67,0.5)]"
                  />
                </motion.svg>
              </motion.div>
            </div>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.8 }}
            className="mt-10 max-w-[540px] text-base md:text-xl text-white/50 leading-relaxed font-body"
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.8 }}
            className="mt-12 md:mt-16 flex flex-col sm:flex-row items-start sm:items-center gap-8"
          >
            <Link
              href="/contact"
              className="liquid-glass glass-refraction bg-gradus-gold text-gradus-primary px-10 py-5 rounded-full font-bold hover:scale-105 hover:shadow-[0_0_40px_rgba(212,168,67,0.4)] transition-all duration-500 interactive text-lg"
            >
              {t("hero.cta")}
            </Link>
            <Link
              href="#portfolio"
              className="group flex items-center gap-3 px-8 py-4 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-white font-medium hover:bg-white/10 hover:border-white/20 transition-all duration-500 interactive"
            >
              {t("hero.cta2")}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-500" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.3, duration: 1 }}
            className="mt-12 pt-8 border-t border-white/5"
          >
            <p className="font-mono text-[10px] md:text-[11px] text-white/30 uppercase tracking-[0.3em]">
              {lang === "fr" ? "Casablanca, Maroc" : "Casablanca, Morocco"} · contact@gradus.ma
            </p>
          </motion.div>
        </div>
      </div>

      {/* Floating Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, x: 20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ delay: 2.5, duration: 0.8 }}
        className="absolute bottom-12 right-12 hidden lg:flex items-center gap-6 liquid-glass p-4 pr-8 rounded-[32px] interactive hover:-translate-y-2 hover:border-white/20 transition-all duration-700 shadow-2xl"
      >
        <div className="flex items-center gap-3 border-r border-white/10 pr-6">
          <a
            href="https://instagram.com/gradusofficiel"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Suivez Gradus sur Instagram"
            className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-white/40 hover:bg-gradus-gold hover:text-gradus-primary hover:scale-110 transition-all duration-500 shadow-lg"
          >
            <Instagram size={20} />
          </a>
          <a
            href="https://linkedin.com/company/gradus-agency"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Suivez Gradus sur LinkedIn"
            className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-white/40 hover:bg-gradus-gold hover:text-gradus-primary hover:scale-110 transition-all duration-500 shadow-lg"
          >
            <Linkedin size={20} />
          </a>
          <a
            href="https://facebook.com/gradusofficiel"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Suivez Gradus sur Facebook"
            className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-white/40 hover:bg-gradus-gold hover:text-gradus-primary hover:scale-110 transition-all duration-500 shadow-lg"
          >
            <Facebook size={20} />
          </a>
        </div>
        <div className="pl-1">
          <p className="font-mono text-[10px] text-white/30 mb-1 uppercase tracking-widest">Gradus Agency</p>
          <span className="text-sm font-bold text-white group flex items-center gap-1 cursor-default">
            {lang === "fr" ? "Suivez-nous" : "Follow us"}{" "}
            <span className="text-gradus-gold animate-pulse">↗</span>
          </span>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8, duration: 1 }}
        className="absolute bottom-10 left-6 md:left-12 flex-col items-center gap-5 hidden sm:flex"
      >
        <span
          className="font-mono text-[10px] tracking-[0.5em] text-white/30 origin-left uppercase"
          style={{ writingMode: "vertical-rl" }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="w-[1px] h-16 bg-gradient-to-b from-gradus-gold to-transparent opacity-50"
        />
      </motion.div>
    </section>
  );
}
