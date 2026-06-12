"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

export default function LaBelleCard() {
  const { lang } = useLanguage();

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-black border-y border-white/5">
      {/* Immersive Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[1000px] h-[600px] md:h-[800px] bg-pink-900/10 rounded-full blur-[140px] mix-blend-screen opacity-40" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradus-gold/5 rounded-full blur-[120px] mix-blend-screen opacity-20" />
      </div>

      <div className="container relative z-10 px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-6xl mx-auto"
        >
          <div className="relative backdrop-blur-2xl bg-white/[0.01] border border-white/10 rounded-[48px] p-8 md:p-20 overflow-hidden group shadow-2xl shadow-pink-500/5">
            {/* Animated Mesh Gradient inside card */}
            <div className="absolute inset-0 z-0 opacity-30 group-hover:opacity-50 transition-opacity duration-700" aria-hidden="true">
              <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[80%] bg-pink-600/20 rounded-full blur-[120px] animate-pulse" />
              <div
                className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[80%] bg-gradus-gold/10 rounded-full blur-[120px] animate-pulse"
                style={{ animationDelay: "1s" }}
              />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-10"
              >
                <div className="relative">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 bg-pink-500/30 blur-2xl rounded-full"
                    aria-hidden="true"
                  />
                  <Image
                    src="/assets/labelle-logo.svg"
                    alt="La Belle Shows"
                    width={224}
                    height={112}
                    className="h-20 md:h-28 w-auto object-contain relative z-10 drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                  />
                </div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-7xl font-display font-bold tracking-normal mb-8 bg-gradient-to-b from-white via-white to-white/50 bg-clip-text text-transparent leading-[1.1]"
              >
                {lang === "fr" ? "L\u2019Art de l\u2019Événementiel" : "The Art of Events"} <br />
                <span className="text-pink-500 italic font-light tracking-normal">
                  {lang === "fr" ? "Spectacle & Prestige" : "Show & Prestige"}
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-gradus-muted text-lg md:text-2xl max-w-3xl mb-14 leading-relaxed font-light"
              >
                {lang === "fr"
                  ? "Vivez des expériences sensorielles uniques avec La Belle Shows. Notre division d'excellence pour des performances artistiques qui marquent les esprits."
                  : "Experience unique sensory journeys with La Belle Shows. Our excellence division for artistic performances that leave a lasting impression."}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/la-belle-shows"
                  className="group relative flex items-center justify-center gap-6 bg-white text-black px-14 py-6 rounded-full font-bold text-xl hover:bg-pink-600 hover:text-white transition-all duration-500 interactive overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-pink-500/40"
                >
                  <span className="relative z-10">
                    {lang === "fr" ? "Découvrir La Belle Shows" : "Discover La Belle Shows"}
                  </span>
                  <div className="relative z-10 bg-black/5 group-hover:bg-white/20 p-2 rounded-full transition-colors">
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-pink-600 to-pink-400 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"
                    aria-hidden="true"
                  />
                </Link>
              </motion.div>
            </div>

            {/* Decorative Corner Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/5 blur-[100px] pointer-events-none" aria-hidden="true" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradus-gold/5 blur-[100px] pointer-events-none" aria-hidden="true" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
