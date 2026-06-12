"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, MapPin, Briefcase, Building } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageContext";
import type { Job } from "@/lib/firebase-rest";

interface HiringProps {
  jobs: Job[];
}

export default function Hiring({ jobs }: HiringProps) {
  const { lang } = useLanguage();

  return (
    <section className="py-24 md:py-32 bg-transparent relative overflow-hidden" id="hiring">
      <div className="container relative z-10 w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8"
        >
          <div>
            <span className="text-accent font-mono text-sm sm:text-base font-bold tracking-widest uppercase mb-4 block">
              {lang === "fr" ? "Recrutement" : "Hiring"}
            </span>
            <h2 className="text-[50px] md:text-[60px] leading-tight font-display font-bold tracking-normal text-white">
              {lang === "fr" ? "Rejoignez " : "Join "}
              <span className="text-accent">l&apos;équipe</span>
            </h2>
          </div>
          <Link href="/contact" className="hidden md:flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:text-accent hover:border-white/20 transition-all duration-500 interactive">
            {lang === "fr" ? "Candidature spontanée" : "Spontaneous Application"} <ArrowUpRight className="w-5 h-5" />
          </Link>
        </motion.div>

        {/* Job Listings */}
        {jobs.length > 0 ? (
          <div className="flex flex-col gap-8 md:gap-10">
            {jobs.map((job, idx) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
              >
                <a
                  href={job.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="liquid-glass group flex flex-col lg:flex-row lg:items-center justify-between gap-10 p-10 md:p-14 rounded-3xl hover:-translate-y-1 transition-all duration-700 interactive shadow-2xl"
                >
                  <div className="flex-1">
                    <h3 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6 group-hover:text-accent transition-colors duration-500">
                      {job.title}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-4 text-gradus-muted text-[10px] md:text-[11px] font-mono tracking-[0.2em] uppercase font-bold">
                      {job.department && (
                        <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/10">
                          <Building className="w-4 h-4 text-accent" />
                          <span>{job.department}</span>
                        </div>
                      )}
                      {job.type && (
                        <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/10">
                          <Briefcase className="w-4 h-4 text-accent" />
                          <span>{job.type}</span>
                        </div>
                      )}
                      {job.location && (
                        <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/10">
                          <MapPin className="w-4 h-4 text-accent" />
                          <span>{job.location}</span>
                        </div>
                      )}
                    </div>
                    
                    {job.description && (
                      <p className="mt-10 text-white/40 max-w-4xl leading-relaxed text-base md:text-lg border-l-2 border-accent/20 pl-8 group-hover:border-accent/50 transition-colors duration-500 font-light">
                        {job.description}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 flex items-center justify-between lg:justify-center w-full lg:w-auto mt-8 lg:mt-0 pt-10 lg:pt-0 border-t border-white/5 lg:border-t-0">
                    <span className="text-accent text-xs font-mono tracking-[0.3em] uppercase font-bold lg:hidden">
                      {lang === "fr" ? "Postuler" : "Apply"}
                    </span>
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/5 backdrop-blur-xl flex items-center justify-center text-white border border-white/10 group-hover:bg-accent group-hover:text-gradus-primary group-hover:border-accent group-hover:scale-110 transition-all duration-500 shadow-2xl">
                      <ArrowUpRight className="w-8 h-8 md:w-10 md:h-10 group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="liquid-glass p-16 md:p-24 rounded-3xl text-center shadow-2xl">
            <h3 className="text-3xl md:text-5xl font-heading font-bold text-white mb-8 tracking-normal">
              {lang === "fr"
                ? "Aucune offre pour le moment"
                : "No open positions right now"}
            </h3>
            <p className="text-white/40 mb-12 max-w-2xl mx-auto leading-relaxed text-lg font-light">
              {lang === "fr"
                ? "Nous sommes toujours à la recherche de nouveaux talents. N'hésitez pas à nous envoyer une candidature spontanée, nous serions ravis d'en savoir plus sur vous."
                : "We are always on the lookout for new talent. Feel free to send us an open application, we'd love to learn more about you."}
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-4 px-12 py-6 bg-white text-gradus-primary rounded-full font-bold hover:bg-accent transition-all duration-500 hover:scale-105 shadow-2xl text-lg"
            >
              {lang === "fr" ? "Contactez-nous" : "Get in touch"} <ArrowUpRight className="w-6 h-6" />
            </Link>
          </div>
        )}

        <Link href="/contact" className="md:hidden mt-8 flex items-center justify-center gap-2 text-white font-medium interactive">
          {lang === "fr" ? "Candidature spontanée" : "Spontaneous Application"} <ArrowUpRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}
