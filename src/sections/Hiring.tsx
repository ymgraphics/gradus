"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageContext";
import type { Job } from "@/lib/firebase-rest";

interface HiringProps {
  jobs: Job[];
}

export default function Hiring({ jobs }: HiringProps) {
  const { lang } = useLanguage();
  const fr = lang === "fr";

  return (
    <section className="section-y bg-void relative border-t border-gradus-border" id="hiring">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8"
        >
          <div>
            <p className="label-utility mb-6 flex items-center gap-3">
              <span className="inline-block w-2 h-2 bg-accent" aria-hidden="true" />
              {fr ? "Recrutement" : "Hiring"}
            </p>
            <h2 className="text-display-lg font-display text-text-primary">
              {fr ? "Rejoignez " : "Join "}
              <span className="text-accent">{fr ? "l'équipe." : "the team."}</span>
            </h2>
          </div>
          <Link
            href="/contact"
            className="link-underline label-utility self-start md:self-auto text-text-secondary hover:text-text-primary transition-colors interactive"
          >
            {fr ? "Candidature spontanée" : "Open application"} →
          </Link>
        </motion.div>

        {/* Job listings: one ruled row per role, each a step further in */}
        {jobs.length > 0 ? (
          <ul>
            {jobs.map((job, idx) => {
              const meta = [job.department, job.type, job.location].filter(Boolean);
              return (
                <motion.li
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: idx * 0.08, duration: 0.6 }}
                  style={{ "--i": Math.min(idx, 3) } as React.CSSProperties}
                  className="border-t border-gradus-border last:border-b md:pl-[calc(var(--i)*2rem)]"
                >
                  <a
                    href={job.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="step-x group grid grid-cols-[2.5rem_1fr_auto] md:grid-cols-[4rem_1fr_auto] items-baseline gap-4 md:gap-8 py-8 md:py-10 interactive"
                  >
                    <span className="label-utility text-text-secondary group-hover:text-accent-text transition-colors duration-300">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-display-md font-display text-text-primary">
                        {job.title}
                      </h3>
                      {meta.length > 0 && (
                        <p className="label-utility mt-4">{meta.join(" — ")}</p>
                      )}
                      {job.description && (
                        <p className="mt-6 max-w-2xl text-caption text-text-secondary">
                          {job.description}
                        </p>
                      )}
                    </div>
                    <span className="self-center flex items-center gap-3">
                      <span className="label-utility hidden md:inline text-text-secondary group-hover:text-accent-text transition-colors duration-300">
                        {fr ? "Postuler" : "Apply"}
                      </span>
                      <ArrowUpRight
                        className="w-5 h-5 text-text-secondary group-hover:text-accent transition-colors duration-300"
                        aria-hidden="true"
                      />
                      <span className="sr-only">
                        {fr ? "(s'ouvre dans un nouvel onglet)" : "(opens in a new tab)"}
                      </span>
                    </span>
                  </a>
                </motion.li>
              );
            })}
          </ul>
        ) : (
          <div className="border-t border-gradus-border pt-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
            <h3 className="lg:col-span-5 text-display-md font-display text-text-primary">
              {fr ? "Aucune offre pour le moment." : "No open positions right now."}
            </h3>
            <div className="lg:col-span-6 lg:col-start-7 flex flex-col items-start gap-10">
              <p className="text-body text-text-secondary">
                {fr
                  ? "Nous sommes toujours à la recherche de nouveaux talents. N'hésitez pas à nous envoyer une candidature spontanée, nous serions ravis d'en savoir plus sur vous."
                  : "We are always on the lookout for new talent. Feel free to send us an open application, we'd love to learn more about you."}
              </p>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-4 border border-accent px-8 py-4 label-utility text-text-primary hover:bg-accent hover:text-text-primary transition-colors duration-300 interactive"
              >
                {fr ? "Contactez-nous" : "Get in touch"}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
