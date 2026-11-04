"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Instagram, Linkedin, Facebook } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useDialog } from "@/lib/useDialog";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeMenu = useCallback(() => setMobileMenuOpen(false), []);

  // Open menu is a full-screen modal: Escape closes, Tab stays inside the
  // header (logo, toggle, menu), and the page behind stops scrolling.
  useDialog({
    open: mobileMenuOpen,
    containerRef: headerRef,
    onClose: closeMenu,
    initialFocusRef: toggleRef,
  });

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: t("nav.home"), href: "/" },
    { name: t("nav.services"), href: "/#services" },
    { name: t("nav.portfolio"), href: "/#portfolio" },
    { name: t("nav.about"), href: "/#about" },
    { name: t("nav.contact"), href: "/contact" },
  ];

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${
        scrolled
          ? "bg-void/85 backdrop-blur-xl border-gradus-border py-3"
          : "bg-transparent border-transparent py-6"
      }`}
    >
      <div className="container flex items-center justify-between">
        <Link href="/" className="relative z-50 interactive interactive-hover" aria-label="Gradus — Accueil">
          <Image
            src="/assets/logo.svg"
            alt="Gradus"
            width={160}
            height={40}
            className="h-8 md:h-10 w-auto object-contain"
            style={{ width: "auto" }}
            priority
          />
        </Link>
        {/* Right cluster: two anchors + lang + menu trigger */}
        <nav className="flex items-center gap-6 md:gap-10" aria-label="Navigation principale">
          <Link
            inert={mobileMenuOpen}
            href="/#portfolio"
            className="link-underline hidden md:inline-block label-utility text-text-primary/70 hover:text-text-primary transition-colors interactive"
          >
            {t("nav.portfolio")}
          </Link>
          <Link
            inert={mobileMenuOpen}
            href="/contact"
            className="link-underline hidden md:inline-block label-utility text-text-primary/70 hover:text-text-primary transition-colors interactive"
          >
            {t("nav.contact")}
          </Link>

          <button
            inert={mobileMenuOpen}
            onClick={() => setLang(lang === "fr" ? "en" : "fr")}
            className="hidden md:flex label-utility text-text-primary/70 hover:text-text-primary transition-colors items-center gap-1.5 interactive"
            aria-label={lang === "fr" ? "Passer en anglais" : "Switch to French"}
          >
            <span className={lang === "fr" ? "text-accent-text" : ""}>FR</span>
            <span className="text-white/30">/</span>
            <span className={lang === "en" ? "text-accent-text" : ""}>EN</span>
          </button>

          <button
            ref={toggleRef}
            className="relative z-50 flex items-center gap-3 label-utility text-text-primary interactive"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
            aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            <span className="flex flex-col gap-[5px]" aria-hidden="true">
              <span className={`block h-px w-6 bg-current transition-transform duration-300 ${mobileMenuOpen ? "translate-y-[3px] rotate-45" : ""}`} />
              <span className={`block h-px w-6 bg-current transition-transform duration-300 ${mobileMenuOpen ? "-translate-y-[3px] -rotate-45" : ""}`} />
            </span>
            {mobileMenuOpen ? (lang === "fr" ? "Fermer" : "Close") : "Menu"}
          </button>
        </nav>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              id="mobile-nav"
              role="navigation"
              aria-label="Navigation mobile"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-0 bg-void z-40 flex flex-col justify-center gap-6 px-6 sm:px-12 lg:px-20"
            >
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-baseline gap-6"
                  style={{ marginLeft: `min(${i * 2.5}rem, ${i * 6}vw)` }}
                >
                  <span className="label-utility" aria-hidden="true">0{i + 1}</span>
                  {link.href.startsWith("/#") ? (
                    <a
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-display-md font-display text-text-primary hover:text-accent transition-colors"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-display-md font-display text-text-primary hover:text-accent transition-colors"
                    >
                      {link.name}
                    </Link>
                  )}
                </motion.div>
              ))}



              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-12 flex flex-col items-start gap-8 border-t border-gradus-border pt-8"
              >
                <div className="flex items-center gap-8">
                  <button
                    onClick={() => {
                      setLang(lang === "fr" ? "en" : "fr");
                      setMobileMenuOpen(false);
                    }}
                    className="label-utility text-text-primary flex items-center gap-2 interactive"
                    aria-label={lang === "fr" ? "Passer en anglais" : "Switch to French"}
                  >
                    <span className={lang === "fr" ? "text-accent-text" : ""}>FR</span>
                    <span className="text-white/30">/</span>
                    <span className={lang === "en" ? "text-accent-text" : ""}>EN</span>
                  </button>

                  <Link
                    href="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="label-utility border border-accent text-text-primary px-6 py-3 hover:bg-accent hover:text-text-primary transition-colors duration-300 inline-block"
                  >
                    {t("nav.cta")} →
                  </Link>
                </div>
                <div className="flex items-center gap-6">
                  <a
                    href="https://instagram.com/gradusofficiel"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram Gradus"
                    className="text-text-secondary hover:text-accent transition-colors p-2"
                  >
                    <Instagram size={24} />
                  </a>
                  <a
                    href="https://linkedin.com/company/gradus-agency"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn Gradus"
                    className="text-text-secondary hover:text-accent transition-colors p-2"
                  >
                    <Linkedin size={24} />
                  </a>
                  <a
                    href="https://facebook.com/gradusofficiel"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook Gradus"
                    className="text-text-secondary hover:text-accent transition-colors p-2"
                  >
                    <Facebook size={24} />
                  </a>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
