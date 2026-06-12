"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/i18n/LanguageContext";
import type { TeamMember } from "@/lib/firebase-rest";
import MagneticGlass from "@/components/MagneticGlass";

interface TeamProps {
  teamMembers?: TeamMember[];
}

export default function Team({ teamMembers = [] }: TeamProps) {
  const { t, lang } = useLanguage();
  const team = teamMembers;

  if (team.length === 0) return null; // Don't show the section if no team members

  return (
    <section id="team" className="section-y bg-transparent relative overflow-hidden">
      <div className="container relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8"
        >
          <h2 className="text-display-lg font-display text-text-primary">
            {t("team.title1")} <br className="hidden md:block" />
            <span className="text-accent">{t("team.title2")}</span>
          </h2>
          <Link
            href="/contact"
            className="hidden md:flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:text-accent hover:border-white/20 transition-all duration-500 interactive"
          >
            {lang === "fr" ? "Intégrer le Collectif" : "Join the Collective"}{" "}
            <ArrowUpRight className="w-5 h-5" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 items-stretch">
          {team.map((member, i) => (
            <motion.article
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className={`h-full ${
                member.isCeo
                  ? "sm:col-span-2 lg:col-span-2"
                  : "col-span-1"
              }`}
            >
              <MagneticGlass strength={5} className="w-full h-full">
                <div
                  className={`liquid-glass group flex rounded-3xl p-6 hover:border-accent/30 transition-all duration-700 interactive w-full h-full ${
                    member.isCeo
                      ? "glass-refraction flex-col lg:flex-row lg:items-stretch gap-8 shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
                      : "flex-col shadow-2xl"
                  }`}
                >
                  {/* Photo Container */}
                  <div
                    className={`bg-white/5 rounded-2xl overflow-hidden relative border border-white/10 shrink-0 ${
                      member.isCeo
                        ? "w-full lg:w-1/2 aspect-[4/5] lg:aspect-auto"
                        : "w-full aspect-[3/4] mb-8"
                    }`}
                  >
                    {member.imageUrl ? (
                      <Image
                        src={member.imageUrl}
                        alt={`${member.name} — ${member.role}`}
                        fill
                        sizes={member.isCeo ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 768px) 100vw, 25vw"}
                        className="object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-1000 scale-100 group-hover:scale-105"
                        loading={i < 2 ? "eager" : "lazy"}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-gradus-orange/10 animate-pulse" />
                    )}
                    {/* Depth Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity duration-700" />
                  </div>

                  <div className={`flex flex-col flex-1 ${member.isCeo ? "justify-center py-6 pr-6" : "justify-between pb-4 px-2"}`}>
                    <div>
                      <h3
                        className={`font-heading font-bold text-white mb-2 group-hover:text-accent transition-colors duration-500 ${
                          member.isCeo ? "text-4xl lg:text-5xl" : "text-2xl"
                        }`}
                      >
                        {member.name}
                      </h3>
                      <p className="text-accent text-[10px] md:text-[11px] mb-8 font-mono tracking-[0.3em] uppercase font-bold">
                        {member.role}
                      </p>
                    </div>

                    <div className="flex flex-col gap-8">
                      <div className="flex flex-wrap gap-2">
                        {member.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-[9px] text-white/40 uppercase tracking-[0.15em] font-mono"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {member.isCeo && (
                        <blockquote className="text-white/30 italic font-light text-lg lg:text-xl leading-relaxed border-l-2 border-accent/30 pl-8 mt-4">
                          <p>
                            {lang === "fr"
                              ? "\"L'excellence n'est pas un acte, c'est une habitude.\""
                              : "\"Excellence is not an act, it is a habit.\""}
                          </p>
                        </blockquote>
                      )}
                    </div>
                  </div>
                </div>
              </MagneticGlass>
            </motion.article>
          ))}
        </div>

        <Link
          href="/contact"
          className="md:hidden mt-12 flex items-center justify-center gap-2 text-white font-medium interactive"
        >
          {lang === "fr" ? "Intégrer le Collectif" : "Join the Collective"}{" "}
          <ArrowUpRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}
