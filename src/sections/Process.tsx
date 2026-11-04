"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";

export default function Process() {
  const { t, lang } = useLanguage();
  const steps = [
    { num: "01", title: t("process.step1"), desc: t("process.step1desc") },
    { num: "02", title: t("process.step2"), desc: t("process.step2desc") },
    { num: "03", title: t("process.step3"), desc: t("process.step3desc") },
    { num: "04", title: t("process.step4"), desc: t("process.step4desc") },
  ];
  return (
    <section id="about" className="section-y bg-gradus-primary">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 md:mb-24 text-center md:text-left"
        >
          <p className="label-utility mb-6 flex items-center gap-3">
            <span className="inline-block w-2 h-2 bg-accent" aria-hidden="true" />
            {lang === "fr" ? "Méthode" : "Method"}
          </p>
          <h2 className="text-display-lg font-display text-text-primary">
            {t("process.title1")} {t("process.title2")}
          </h2>
        </motion.div>

        {/* Four steps, each one literally a step lower than the last */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-12">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.12 }}
              style={{ "--i": i } as React.CSSProperties}
              className="group relative flex flex-col items-start text-left border-t border-gradus-border pt-8 md:mt-[calc(var(--i)*3rem)]"
            >
              <div className="label-utility text-text-secondary group-hover:text-accent-text transition-colors duration-300 mb-8">
                {step.num}
              </div>
              <h3 className="text-heading font-display text-text-primary mb-4">
                {step.title}
              </h3>
              <p className="text-caption text-text-secondary leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
