"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/i18n/LanguageContext";
import type { TeamMember } from "@/lib/firebase-rest";

interface TeamProps {
  teamMembers?: TeamMember[];
}

export default function Team({ teamMembers = [] }: TeamProps) {
  const { t, lang } = useLanguage();
  const team = teamMembers;

  if (team.length === 0) return null; // Don't show the section if no team members

  return (
    <section id="team" className="section-y bg-void relative border-t border-gradus-border">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8"
        >
          <div>
            <p className="label-utility mb-6 flex items-center gap-3">
              <span className="inline-block w-2 h-2 bg-accent" aria-hidden="true" />
              {lang === "fr" ? "Le studio" : "The studio"}
            </p>
            <h2 className="text-display-lg font-display text-text-primary">
              {t("team.title1")} <br className="hidden md:block" />
              <span className="text-accent">{t("team.title2")}</span>
            </h2>
          </div>
          <Link
            href="/contact"
            className="link-underline label-utility self-start md:self-auto text-text-secondary hover:text-text-primary transition-colors interactive"
          >
            {lang === "fr" ? "Intégrer le collectif" : "Join the collective"} →
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16 items-start">
          {team.map((member, i) => (
            <motion.article
              key={member.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              // Each portrait sits a step lower than the one before it (desktop)
              style={{ "--i": member.isCeo ? 0 : Math.min(i, 3) } as React.CSSProperties}
              className={`group ${
                member.isCeo ? "sm:col-span-2" : "lg:mt-[calc(var(--i)*2rem)]"
              }`}
            >
              <div className="border border-gradus-border p-1.5">
                <div
                  className={`relative overflow-hidden bg-surface ${
                    member.isCeo ? "aspect-[4/3]" : "aspect-[3/4]"
                  }`}
                >
                  {member.imageUrl ? (
                    <Image
                      src={member.imageUrl}
                      alt={`${member.name} — ${member.role}`}
                      fill
                      sizes={member.isCeo ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 768px) 100vw, 25vw"}
                      className="object-cover object-top grayscale group-hover:grayscale-0 transition-[filter] duration-700"
                      loading={i < 2 ? "eager" : "lazy"}
                    />
                  ) : (
                    <span
                      className="absolute inset-0 flex items-center justify-center text-display-md font-display text-text-primary/40"
                      aria-hidden="true"
                    >
                      {member.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-5 flex items-baseline justify-between gap-4">
                <h3 className={`font-display text-text-primary ${member.isCeo ? "text-display-md" : "text-heading"}`}>
                  {member.name}
                </h3>
                <span className="label-utility" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <p className="label-utility text-accent-text mt-2">{member.role}</p>

              {member.tags.length > 0 && (
                <p className="label-utility mt-4">{member.tags.join(" · ")}</p>
              )}

              {member.isCeo && (
                <blockquote className="mt-8 border-t border-gradus-border pt-6 text-heading font-display text-text-secondary">
                  {lang === "fr"
                    ? "« L'excellence n'est pas un acte, c'est une habitude. »"
                    : "“Excellence is not an act, it is a habit.”"}
                </blockquote>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
