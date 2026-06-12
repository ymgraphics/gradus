"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

export default function Cta() {
  const { lang } = useLanguage();
  return (
    <section className="relative section-y overflow-hidden bg-void border-t border-gradus-border">
      <div className="container relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-display-xl font-display text-text-primary mb-16 flex flex-col"
        >
          <span>{lang === 'fr' ? 'Prêt pour la' : 'Ready for'}</span>
          <span className="ml-[4%] md:ml-[8.333%]">
            {lang === 'fr' ? 'prochaine ' : 'the next '}
            <span className="text-accent">{lang === 'fr' ? 'marche ?' : 'step?'}</span>
          </span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="md:ml-[16.666%] flex flex-col sm:flex-row items-start sm:items-center gap-10"
        >
          <Link
            href="/contact"
            className="group inline-flex items-center gap-4 border border-accent px-8 py-4 label-utility text-text-primary hover:bg-accent hover:text-void transition-colors duration-300 interactive"
          >
            {lang === 'fr' ? 'Initier une collaboration' : 'Initiate collaboration'}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="mailto:contact@gradus.ma"
            className="link-underline label-utility text-text-secondary hover:text-text-primary transition-colors interactive"
          >
            contact@gradus.ma
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
