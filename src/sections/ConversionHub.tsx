"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
  MessageSquare, 
  Calendar, 
  Phone, 
  Mail, 
  Send, 
  X, 
  Clock, 
  Sparkles, 
  CheckCircle,
  MapPin,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useDialog } from "@/lib/useDialog";
import { sendLeadAction } from "@/app/actions/sendEmail";

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

  return (
    <>
      {/* 1. Sticky Scrolling CTA Pill (Slides in bottom-left corner) */}
      <div
        inert={!(showStickyCta && !isOpen)}
        className={`fixed bottom-6 left-6 z-40 transition-all duration-500 transform hidden sm:block ${
          showStickyCta && !isOpen 
            ? "translate-y-0 opacity-100 scale-100" 
            : "translate-y-10 opacity-0 scale-90 pointer-events-none"
        }`}
      >
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3 bg-gradus-primary/90 hover:bg-black/90 backdrop-blur-xl border border-white/10 hover:border-accent/30 text-white pl-4 pr-5 py-3 rounded-full transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] group"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
          <span className="text-sm font-heading font-medium tracking-normal">
            {lang === "fr" ? "⚡️ Obtenir Une Estimation Détaillée" : "⚡️ Get Detailed Estimate"}
          </span>
          <ChevronRight size={16} className="text-accent group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </div>

      {/* 2. Floating Action Button (FAB - Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Pulsing notification badge if closed */}
        {!isOpen && (
          <div className="bg-accent text-white text-[11px] font-heading font-bold px-2 py-0.5 rounded-full animate-bounce shadow-md pointer-events-none">
            {lang === "fr" ? "En ligne · Online" : "Online"}
          </div>
        )}
        
        <button
          id="conversion-fab"
          aria-label={
            isOpen
              ? lang === "fr" ? "Fermer le panneau de contact" : "Close contact panel"
              : lang === "fr" ? "Ouvrir le panneau de contact" : "Open contact panel"
          }
          aria-expanded={isOpen}
          aria-controls="conversion-hub"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.5)] border ${
            isOpen 
              ? "bg-black/80 border-white/20 text-white rotate-90" 
              : "bg-gradient-to-tr from-accent to-gradus-orange border-white/10 hover:border-white/30 text-black hover:scale-105"
          }`}
        >
          {isOpen ? (
            <X size={24} />
          ) : (
            <div className="relative">
              <MessageSquare size={24} className="animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-white border border-accent" />
            </div>
          )}
        </button>
      </div>

      {/* 3. Immersive Glassmorphic Conversion Hub Drawer */}
      <div
        ref={drawerRef}
        id="conversion-hub"
        role="dialog"
        aria-modal="false"
        aria-label={lang === "fr" ? "Contacter Gradus" : "Contact Gradus"}
        inert={!isOpen}
        className={`fixed right-6 bottom-24 z-50 w-[92vw] sm:w-[400px] max-h-[80vh] overflow-y-auto rounded-[28px] bg-gradus-primary/95 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-all duration-500 origin-bottom-right transform ${
          isOpen 
            ? "scale-100 opacity-100 translate-y-0 pointer-events-auto" 
            : "scale-90 opacity-0 translate-y-10 pointer-events-none"
        }`}
      >
        {/* Hub Header */}
        <div className="p-6 border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent relative">
          <div className="absolute top-6 right-6 flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] font-heading font-semibold tracking-wider uppercase">Active</span>
          </div>

          <h3 className="text-xl font-heading font-extrabold text-white flex items-center gap-2">
            Gradus Studio <Sparkles size={16} className="text-accent" />
          </h3>
          <p className="text-xs text-gradus-muted mt-1 flex items-center gap-1">
            <Clock size={12} /> {lang === "fr" ? "Assistance stratégique instantanée sur WhatsApp" : "Instant strategic support on WhatsApp"}
          </p>
        </div>

        {/* Channels Grid (Instant Contact Options) */}
        <div className="p-6 flex flex-col gap-4">
          
          {/* A. Live WhatsApp Chat Shortcut */}
          <a
            href="https://wa.me/212691404005?text=Bonjour%20Gradus%2C%20je%20souhaite%20discuter%20d%27un%20projet%20de%20branding%20%2F%20marketing%20digital%20avec%20vous."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-emerald-600/20 to-emerald-500/5 hover:from-emerald-600/30 hover:to-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <MessageSquare size={20} />
              </div>
              <div className="text-left">
                <h4 className="text-white font-heading font-bold text-sm leading-tight">WhatsApp Live Chat</h4>
                <p className="text-[11px] text-emerald-400 font-medium leading-tight mt-0.5">
                  {lang === "fr" ? "Consultation immédiate (24/7)" : "Immediate consultation (24/7)"}
                </p>
              </div>
            </div>
            <ExternalLink size={16} className="text-emerald-400/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </a>

          {/* B. Calendly 15-Min Briefing Reservation */}
          <a
            href="https://calendly.com" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-white/10 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent shrink-0">
                <Calendar size={20} />
              </div>
              <div className="text-left">
                <h4 className="text-white font-heading font-bold text-sm leading-tight">
                  {lang === "fr" ? "Réserver un appel" : "Schedule a call"}
                </h4>
                <p className="text-[11px] text-gradus-muted leading-tight mt-0.5">
                  {lang === "fr" ? "Appel stratégique 15 min" : "15-min discovery call"}
                </p>
              </div>
            </div>
            <ChevronRight size={16} className="text-gradus-muted group-hover:translate-x-1 transition-transform duration-300" />
          </a>

          {/* C. Quick Phone Dial & Direct Mail */}
          <div className="grid grid-cols-2 gap-3">
            <a
              href="tel:+212691404005"
              className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors duration-300 text-left"
            >
              <Phone size={14} className="text-accent" />
              <div>
                <span className="block text-[11px] text-gradus-muted uppercase leading-none">Phone</span>
                <span className="text-xs font-semibold text-white leading-tight">Appeler</span>
              </div>
            </a>
            <a
              href="mailto:contact@gradus.ma"
              className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors duration-300 text-left"
            >
              <Mail size={14} className="text-accent" />
              <div>
                <span className="block text-[11px] text-gradus-muted uppercase leading-none">Email</span>
                <span className="text-xs font-semibold text-white leading-tight">Écrire</span>
              </div>
            </a>
          </div>

          <div className="h-px bg-white/5 my-2" />

          {/* D. Premium Lead Capture Estimator Form */}
          <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-xl pointer-events-none" />
            
            {formSubmitted ? (
              <div className="py-6 flex flex-col items-center justify-center text-center animate-fadeIn">
                <CheckCircle size={36} className="text-accent mb-3 animate-scaleIn" />
                <h4 className="text-white font-heading font-bold text-sm">
                  {lang === "fr" ? "Demande reçue !" : "Request received!"}
                </h4>
                <p className="text-[11px] text-gradus-muted mt-1 max-w-[240px]">
                  {lang === "fr" 
                    ? "Nos experts analyseront votre demande et vous recontacteront sous 5 minutes." 
                    : "Our experts will analyze your request and contact you within 5 minutes."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="flex flex-col gap-3">
                {/* Honeypot: hidden from people, filled by bots */}
                <input
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute -left-[9999px] w-px h-px opacity-0"
                />
                <h4 className="text-xs font-heading font-extrabold text-white tracking-wide uppercase flex items-center gap-1.5">
                  <Sparkles size={12} className="text-accent" /> 
                  {lang === "fr" ? "Évaluer mon investissement digital" : "Evaluate my digital investment"}
                </h4>
                
                {/* Service Tabs */}
                <div className="grid grid-cols-4 gap-1 mt-1">
                  {servicesList.map((srv) => (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() => setSelectedService(srv.id)}
                      aria-pressed={selectedService === srv.id}
                      className={`text-[11px] font-heading font-medium py-1.5 px-0.5 rounded-lg border text-center transition-all ${
                        selectedService === srv.id
                          ? "bg-accent border-accent text-white"
                          : "bg-transparent border-white/5 hover:border-white/10 text-gradus-muted hover:text-white"
                      }`}
                    >
                      {lang === "fr" ? srv.labelFr.split(" ")[0] : srv.labelEn.split(" ")[0]}
                    </button>
                  ))}
                </div>

                {/* Inputs */}
                <label htmlFor="hub-name" className="sr-only">
                  {lang === "fr" ? "Votre nom ou entreprise" : "Your name or company"}
                </label>
                <input
                  id="hub-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  maxLength={120}
                  placeholder={lang === "fr" ? "Votre nom / Entreprise" : "Your Name / Company"}
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 focus:border-accent/50 rounded-xl px-3 py-2 text-xs text-white placeholder-white/50 focus:outline-none transition-colors"
                />

                <label htmlFor="hub-phone" className="sr-only">
                  {lang === "fr" ? "Numéro WhatsApp" : "WhatsApp number"}
                </label>
                <input
                  id="hub-phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder={lang === "fr" ? "Téléphone WhatsApp" : "WhatsApp Number"}
                  aria-invalid={submitError ? true : undefined}
                  aria-describedby={submitError ? "hub-error" : undefined}
                  required
                  value={clientContact}
                  onChange={(e) => setClientContact(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 focus:border-accent/50 rounded-xl px-3 py-2 text-xs text-white placeholder-white/50 focus:outline-none transition-colors"
                />

                {submitError && (
                  <p id="hub-error" role="alert" className="text-xs text-red-300">
                    {submitError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-accent hover:bg-white hover:scale-[1.02] text-white hover:text-black font-heading font-extrabold text-xs py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                      <span className="sr-only">{lang === "fr" ? "Envoi en cours" : "Sending"}</span>
                    </>
                  ) : (
                    <>
                      {lang === "fr" ? "Valider Ma Demande" : "Submit Request"}
                      <Send size={12} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
