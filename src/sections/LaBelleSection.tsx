"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import Image from "next/image";

export default function LaBelleSection() {
  const { lang } = useLanguage();

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-black flex items-center justify-center border-y border-white/5">
      {/* Premium Background for La Belle */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[1000px] h-[600px] md:h-[800px] bg-pink-900/20 rounded-full blur-[120px] md:blur-[160px] mix-blend-screen opacity-50" />
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-gradus-gold/10 rounded-full blur-[100px] mix-blend-screen opacity-30" />
        
        {/* Animated Noise Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")` }} />
      </div>

      <div className="container relative z-10 px-6">
        <div className="max-w-5xl mx-auto backdrop-blur-3xl bg-white/[0.02] border border-white/10 rounded-[40px] p-8 md:p-20 overflow-hidden group shadow-2xl shadow-pink-500/5">
          {/* Decorative Corner Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-pink-500/20 blur-3xl group-hover:w-64 group-hover:h-64 transition-all duration-700" />
          
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <Image 
                src="/assets/labelle-logo.svg" 
                alt="La Belle Shows Logo" 
                width={200}
                height={96}
                className="h-16 md:h-24 w-auto object-contain filter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
              />
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-display font-bold tracking-normal mb-6 bg-gradient-to-r from-white via-white to-pink-200/50 bg-clip-text text-transparent"
            >
              {lang === 'fr' ? 'Production Événementielle' : 'Event Production'} <br/>
              <span className="text-pink-500 italic font-light">{lang === 'fr' ? 'D’Exception.' : 'Of Excellence.'}</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gradus-muted text-lg md:text-xl max-w-2xl mb-12 leading-relaxed"
            >
              {lang === 'fr' 
                ? "Découvrez La Belle Shows, notre division spécialisée dans la direction artistique et la production de spectacles vivants d'envergure." 
                : "Discover La Belle Shows, our division specializing in art direction and the production of large-scale live performances."}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Link
                href="/la-belle-shows"
                className="group relative flex items-center justify-center gap-4 bg-white text-black px-12 py-5 rounded-full font-bold text-lg hover:bg-pink-600 hover:text-white transition-all duration-500 interactive overflow-hidden"
              >
                <span className="relative z-10">{lang === 'fr' ? 'Explorer La Division' : 'Explore The Division'}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-pink-400 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
