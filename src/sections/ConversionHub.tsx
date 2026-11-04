"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { ArrowRight, ArrowUpRight, MessageSquare, X } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useDialog } from "@/lib/useDialog";
import { sendLeadAction } from "@/app/actions/sendEmail";

// Booking link for the "schedule a call" row. The row is hidden until a real
// scheduling page is configured (it previously pointed at calendly.com itself).
const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL;

const WHATSAPP_URL =
  "https://wa.me/212691404005?text=Bonjour%20Gradus%2C%20je%20souhaite%20discuter%20d%27un%20projet%20de%20branding%20%2F%20marketing%20digital%20avec%20vous.";

export default function ConversionHub() {
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [showStickyCta, setShowStickyCta] = useState(false);
  
  // Lead form state
  const [selectedService, setSelectedService] = useState("branding");
  const [clientName, setClientName] = useState("");
  const [clientContact, setClientContact] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const drawerRef = useRef<HTMLDivElement>(null);
  const closeHub = useCallback(() => setIsOpen(false), []);

  // Non-modal panel: the page stays usable, so no focus trap or scroll lock,
  // but Escape closes it and focus moves in on open / back to the trigger on close.
  useDialog({
    open: isOpen,
    containerRef: drawerRef,
    onClose: closeHub,
    trapFocus: false,
    lockScroll: false,
  });

  // Monitor scroll for sticky CTA entrance
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setShowStickyCta(window.scrollY > 300);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLeadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!clientName || !clientContact) return;

    setIsSubmitting(true);
    setSubmitError("");

    const formData = new FormData(e.currentTarget);
    formData.set("service", selectedService);

    let result: Awaited<ReturnType<typeof sendLeadAction>>;
    try {
      result = await sendLeadAction(formData);
    } catch {
      result = { error: "send_failed" };
    }
    setIsSubmitting(false);

    if ("error" in result && result.error) {
      const fr = lang === "fr";
      setSubmitError(
        result.error === "invalid"
          ? fr ? "Vérifiez votre nom et votre numéro WhatsApp." : "Please check your name and WhatsApp number."
          : result.error === "rate_limited"
            ? fr ? "Trop de tentatives. Réessayez dans quelques minutes." : "Too many attempts. Please try again in a few minutes."
            : result.error === "missing"
              ? fr ? "Merci de remplir les deux champs." : "Please fill in both fields."
              : fr ? "L'envoi a échoué. Réessayez ou écrivez-nous sur WhatsApp." : "Sending failed. Please try again or message us on WhatsApp."
      );
      return;
    }

    setFormSubmitted(true);

    // Reset the form after the success banner has been read
    setTimeout(() => {
      setFormSubmitted(false);
      setClientName("");
      setClientContact("");
    }, 4000);
  };

  const servicesList = [
    { id: "branding", labelFr: "Branding & Logo", labelEn: "Branding & Logo" },
    { id: "social-media", labelFr: "Social Media", labelEn: "Social Media" },
    { id: "video", labelFr: "Vidéo / Reels", labelEn: "Video / Reels" },
    { id: "web-design", labelFr: "Web Design", labelEn: "Web Design" },
  ];

  const fr = lang === "fr";

  const channels = [
    {
      href: WHATSAPP_URL,
      external: true,
      title: "WhatsApp",
      note: fr ? "Consultation immédiate (24/7)" : "Immediate consultation (24/7)",
    },
    ...(CALENDLY_URL
      ? [{
          href: CALENDLY_URL,
          external: true,
          title: fr ? "Réserver un appel" : "Schedule a call",
          note: fr ? "Appel stratégique 15 min" : "15-min discovery call",
        }]
      : []),
    { href: "tel:+212691404005", external: false, title: fr ? "Appeler" : "Call", note: "+212 691 404 005" },
    { href: "mailto:contact@gradus.ma", external: false, title: fr ? "Écrire" : "Email", note: "contact@gradus.ma" },
  ];

  const inputClass =
    "w-full bg-transparent border-0 border-b border-gradus-border px-0 py-3 text-caption text-text-primary placeholder:text-white/50 focus:border-accent transition-colors";

  return (
    <>
      {/* 1. Sticky CTA (bottom-left, appears after the hero) */}
      <div
        inert={!(showStickyCta && !isOpen)}
        className={`fixed bottom-6 left-6 z-40 transition-[opacity,transform] duration-500 hidden sm:block ${
          showStickyCta && !isOpen
            ? "translate-y-0 opacity-100"
            : "translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        <button
          onClick={() => setIsOpen(true)}
          className="group inline-flex items-center gap-4 bg-void border border-gradus-border hover:border-accent px-6 py-4 label-utility text-text-primary transition-colors duration-300"
        >
          <span className="inline-block w-2 h-2 bg-accent" aria-hidden="true" />
          {fr ? "Obtenir une estimation" : "Get an estimate"}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true" />
        </button>
      </div>

      {/* 2. Panel toggle (bottom-right) */}
      <button
        id="conversion-fab"
        aria-label={
          isOpen
            ? fr ? "Fermer le panneau de contact" : "Close contact panel"
            : fr ? "Ouvrir le panneau de contact" : "Open contact panel"
        }
        aria-expanded={isOpen}
        aria-controls="conversion-hub"
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 flex items-center justify-center border transition-colors duration-300 ${
          isOpen
            ? "bg-void border-gradus-border text-text-primary hover:border-accent"
            : "bg-accent border-accent text-white hover:bg-void"
        }`}
      >
        {isOpen ? <X size={20} aria-hidden="true" /> : <MessageSquare size={20} aria-hidden="true" />}
      </button>

      {/* 3. Contact panel */}
      <div
        ref={drawerRef}
        id="conversion-hub"
        role="dialog"
        aria-modal="false"
        aria-labelledby="conversion-hub-title"
        inert={!isOpen}
        className={`fixed right-6 bottom-24 z-50 w-[calc(100vw-3rem)] sm:w-[400px] max-h-[calc(100vh-8rem)] overflow-y-auto bg-void border border-gradus-border transition-[opacity,transform] duration-300 ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <div className="p-6 border-b border-gradus-border">
          <p className="label-utility mb-4 flex items-center gap-3">
            <span className="inline-block w-2 h-2 bg-accent" aria-hidden="true" />
            {fr ? "Contact direct" : "Direct contact"}
          </p>
          <h2 id="conversion-hub-title" className="text-heading font-display text-text-primary">
            Gradus Studio
          </h2>
          <p className="text-caption text-text-secondary mt-2">
            {fr ? "Assistance stratégique instantanée sur WhatsApp" : "Instant strategic support on WhatsApp"}
          </p>
        </div>

        {/* Channels: one ruled row each */}
        <ul>
          {channels.map((c, i) => (
            <li key={c.title} className="border-b border-gradus-border">
              <a
                href={c.href}
                {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="step-x group grid grid-cols-[2rem_1fr_auto] items-baseline gap-3 px-6 py-4"
              >
                <span className="label-utility group-hover:text-accent-text transition-colors">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="block text-caption text-text-primary">{c.title}</span>
                  <span className="block label-utility mt-1">{c.note}</span>
                </span>
                <ArrowUpRight size={16} className="self-center text-text-secondary group-hover:text-accent transition-colors" aria-hidden="true" />
                {c.external && (
                  <span className="sr-only">{fr ? "(s'ouvre dans un nouvel onglet)" : "(opens in a new tab)"}</span>
                )}
              </a>
            </li>
          ))}
        </ul>

        {/* Estimate request */}
        <div className="p-6">
          {formSubmitted ? (
            <div className="py-4" role="status">
              <p className="label-utility text-accent-text mb-3">{fr ? "Envoyé" : "Sent"}</p>
              <h3 className="text-heading font-display text-text-primary">
                {fr ? "Demande reçue." : "Request received."}
              </h3>
              <p className="text-caption text-text-secondary mt-2">
                {fr
                  ? "Nos experts analyseront votre demande et vous recontacteront sous 5 minutes."
                  : "Our experts will analyze your request and contact you within 5 minutes."}
              </p>
            </div>
          ) : (
            <form onSubmit={handleLeadSubmit} className="flex flex-col gap-5">
              {/* Honeypot: hidden from people, filled by bots */}
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute -left-[9999px] w-px h-px opacity-0"
              />

              <h3 className="label-utility text-text-primary">
                {fr ? "Évaluer mon investissement digital" : "Evaluate my digital investment"}
              </h3>

              {/* Service choice */}
              <div className="grid grid-cols-2 gap-px bg-gradus-border border border-gradus-border" role="group" aria-label={fr ? "Service" : "Service"}>
                {servicesList.map((srv) => (
                  <button
                    key={srv.id}
                    type="button"
                    onClick={() => setSelectedService(srv.id)}
                    aria-pressed={selectedService === srv.id}
                    className={`label-utility py-3 px-2 text-center transition-colors ${
                      selectedService === srv.id
                        ? "bg-accent text-white"
                        : "bg-void text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {fr ? srv.labelFr : srv.labelEn}
                  </button>
                ))}
              </div>

              <div>
                <label htmlFor="hub-name" className="label-utility">
                  {fr ? "Nom ou entreprise" : "Name or company"}
                </label>
                <input
                  id="hub-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  maxLength={120}
                  placeholder={fr ? "Votre nom / Entreprise" : "Your name / Company"}
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="hub-phone" className="label-utility">
                  {fr ? "Numéro WhatsApp" : "WhatsApp number"}
                </label>
                <input
                  id="hub-phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+212 6…"
                  aria-invalid={submitError ? true : undefined}
                  aria-describedby={submitError ? "hub-error" : undefined}
                  required
                  value={clientContact}
                  onChange={(e) => setClientContact(e.target.value)}
                  className={inputClass}
                />
              </div>

              {submitError && (
                <p id="hub-error" role="alert" className="text-caption text-red-300">
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="group w-full inline-flex items-center justify-center gap-4 border border-accent px-8 py-4 label-utility text-text-primary hover:bg-accent transition-colors duration-300 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                    <span>{fr ? "Envoi en cours" : "Sending"}</span>
                  </>
                ) : (
                  <>
                    {fr ? "Valider ma demande" : "Submit request"}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
