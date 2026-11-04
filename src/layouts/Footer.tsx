"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Project, defaultProjects } from "@/lib/constants";
import { useLanguage } from "@/i18n/LanguageContext";

interface FooterProps {
  projects?: Project[];
}

export default function Footer({ projects = defaultProjects }: FooterProps) {
  const getSeoSlug = (p: any) => {
    const catSlug = (p.category || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return catSlug ? `${p.id}-${catSlug}` : p.id;
  };

  const { t, lang } = useLanguage();

  const navLinks = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.services"), href: "/#services" },
    { label: t("nav.portfolio"), href: "/#portfolio" },
    { label: t("nav.about"), href: "/#about" },
    { label: t("nav.contact"), href: "/contact" },
  ];

  return (
    <footer className="bg-void pt-24 md:pt-32 border-t border-gradus-border relative overflow-hidden">
      <div className="container relative z-10">
        {/* Closing statement row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16">
          <div className="flex flex-col items-start gap-8 max-w-[420px]">
            <Image
              src="/assets/logo.svg"
              alt="Gradus"
              width={150}
              height={38}
              className="h-9 w-auto object-contain"
              style={{ width: "auto" }}
            />
            <p className="text-caption text-text-secondary leading-relaxed">
              {t("footer.tagline")}
            </p>
          </div>

          <Link
            href="/contact"
            className="group inline-flex items-center gap-4 border border-accent px-8 py-4 label-utility text-text-primary hover:bg-accent hover:text-text-primary transition-colors duration-300 interactive shrink-0"
          >
            {t("footer.cta")}
            <ArrowUpRight
              size={16}
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
            />
          </Link>
        </div>

        <div className="step-rule mb-16" style={{ "--step-at": "62%" } as React.CSSProperties} />

        {/* Systematic utility block — everything machine-set */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 mb-20">
          <div className="flex flex-col gap-4">
            <h4 className="label-utility text-text-primary/60 mb-2">{t("nav.contact")}</h4>
            <address className="label-utility not-italic flex flex-col gap-4 text-text-secondary">
              <span>217 Bd Brahim Roudani<br />Casablanca, 20000 — MA</span>
              <a href="tel:+212691404005" className="hover:text-text-primary transition-colors w-fit">
                +212 691 404 005
              </a>
              <a href="mailto:contact@gradus.ma" className="hover:text-text-primary transition-colors w-fit">
                contact@gradus.ma
              </a>
            </address>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="label-utility text-text-primary/60 mb-2">{t("footer.agency")}</h4>
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="label-utility text-text-secondary hover:text-text-primary transition-colors w-fit interactive"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="label-utility text-text-primary/60 mb-2">{t("nav.portfolio")}</h4>
            {projects.slice(0, 6).map((project) => (
              <Link
                key={project.id}
                href={`/projects/${getSeoSlug(project)}`}
                className="label-utility text-text-secondary hover:text-text-primary transition-colors w-fit interactive"
              >
                {project.client}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="label-utility text-text-primary/60 mb-2">
              {lang === "fr" ? "Réseaux" : "Social"}
            </h4>
            <a
              href="https://instagram.com/gradusofficiel"
              target="_blank"
              rel="noopener noreferrer"
              className="label-utility text-text-secondary hover:text-text-primary transition-colors w-fit interactive"
            >
              Instagram ↗
            </a>
            <a
              href="https://linkedin.com/company/gradus-agency"
              target="_blank"
              rel="noopener noreferrer"
              className="label-utility text-text-secondary hover:text-text-primary transition-colors w-fit interactive"
            >
              LinkedIn ↗
            </a>
            <a
              href="https://facebook.com/gradusofficiel"
              target="_blank"
              rel="noopener noreferrer"
              className="label-utility text-text-secondary hover:text-text-primary transition-colors w-fit interactive"
            >
              Facebook ↗
            </a>
          </div>
        </div>

        {/* Legal bar */}
        <div className="pt-6 border-t border-gradus-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 label-utility text-text-secondary/70 pb-10">
          <p>{t("footer.rights")}</p>
          <nav aria-label="Liens légaux" className="flex flex-wrap gap-6 md:gap-10">
            <Link href="/sitemap" className="hover:text-text-primary transition-colors interactive">Sitemap</Link>
            <Link href="/privacy" className="hover:text-text-primary transition-colors interactive">{t("footer.privacy")}</Link>
            <Link href="/legal" className="hover:text-text-primary transition-colors interactive">{t("footer.legal")}</Link>
          </nav>
        </div>
      </div>

      {/* The city is the last word — too big to fit, deliberately */}
      <div className="relative w-full overflow-hidden pointer-events-none select-none" aria-hidden="true">
        <p className="font-display font-semibold text-text-primary/90 text-[14.2vw] leading-none tracking-[-0.04em] whitespace-nowrap text-center -mb-[0.23em]">
          CASABLANCA
        </p>
      </div>
    </footer>
  );
}
