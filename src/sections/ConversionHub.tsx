"use client";

import React, { useState, useEffect } from "react";
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

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientContact) return;

    setIsSubmitting(true);
    // Simulate lead registration (and optionally forward to Firestore/Webhook)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setFormSubmitted(true);
    
    // Auto-close after success banner
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
          <div className="bg-accent text-black text-[10px] font-heading font-bold px-2 py-0.5 rounded-full animate-bounce shadow-md pointer-events-none">
            {lang === "fr" ? "En ligne · Online" : "Online"}
          </div>
        )}
        
        <button
          id="conversion-fab"
          aria-label="Open conversion panel"
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
            <span className="text-[10px] font-heading font-semibold tracking-wider uppercase">Active</span>
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
                <span className="block text-[10px] text-gradus-muted uppercase leading-none">Phone</span>
                <span className="text-xs font-semibold text-white leading-tight">Appeler</span>
              </div>
            </a>
            <a
              href="mailto:contact@gradus.ma"
              className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors duration-300 text-left"
            >
              <Mail size={14} className="text-accent" />
              <div>
                <span className="block text-[10px] text-gradus-muted uppercase leading-none">Email</span>
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
                      className={`text-[9px] font-heading font-medium py-1.5 px-0.5 rounded-lg border text-center transition-all ${
                        selectedService === srv.id
                          ? "bg-accent border-accent text-black"
                          : "bg-transparent border-white/5 hover:border-white/10 text-gradus-muted hover:text-white"
                      }`}
                    >
                      {lang === "fr" ? srv.labelFr.split(" ")[0] : srv.labelEn.split(" ")[0]}
                    </button>
                  ))}
                </div>

                {/* Inputs */}
                <input
                  type="text"
                  placeholder={lang === "fr" ? "Votre nom / Entreprise" : "Your Name / Company"}
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 focus:border-accent/50 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none transition-colors"
                />

                <input
                  type="text"
                  placeholder={lang === "fr" ? "Téléphone WhatsApp" : "WhatsApp Number"}
                  required
                  value={clientContact}
                  onChange={(e) => setClientContact(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 focus:border-accent/50 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none transition-colors"
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-accent to-gradus-orange hover:from-white hover:to-white hover:scale-[1.02] text-black font-heading font-extrabold text-xs py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
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
