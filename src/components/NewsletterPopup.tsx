"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { subscribeToNewsletter } from "@/app/actions/newsletter";
import { useLanguage } from "@/i18n/LanguageContext";
import { useDialog } from "@/lib/useDialog";

const POPUP_KEY = "gradus_popup_seen";
const SCROLL_TRIGGER_RATIO = 0.45;

function hasSeenPopup() {
  try {
    return localStorage.getItem(POPUP_KEY) === "true";
  } catch {
    return false;
  }
}

export default function NewsletterPopup() {
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const copy = {
    eyebrow: lang === "fr" ? "NEWSLETTER GRADUS" : "GRADUS NEWSLETTER",
    title: lang === "fr" ? "Accédez aux insights stratégiques." : "Access strategic insights.",
    body:
      lang === "fr"
        ? "Analyses de marché, stratégies d'acquisition et études de cas exclusives livrées directement dans votre messagerie. Désinscription à tout moment."
        : "Branding advice, project notes, and creative news delivered to your inbox. No spam. Unsubscribe in one click.",
    placeholder: lang === "fr" ? "votre@email.com" : "your@email.com",
    submit: lang === "fr" ? "Rejoindre le Cercle Privé" : "Join the Private Circle",
    loading: lang === "fr" ? "Inscription en cours..." : "Subscribing...",
    skip: lang === "fr" ? "Poursuivre la navigation sans inscription" : "Continue browsing without subscribing",
    invalid:
      lang === "fr"
        ? "Adresse email invalide — vérifiez et réessayez."
        : "Invalid email address — please check and try again.",
    genericError:
      lang === "fr"
        ? "Une erreur est survenue. Réessayez dans un instant."
        : "Something went wrong. Please try again in a moment.",
    successTitle: lang === "fr" ? "Inscription Confirmée" : "Subscription Confirmed",
    successBody:
      lang === "fr"
        ? "Votre intégration à notre liste de diffusion est confirmée. Nos prochaines analyses stratégiques vous seront transmises sous peu."
        : "Thanks for joining the Gradus community. Quality creative notes are on the way.",
    discover: lang === "fr" ? "Explorer nos expertises" : "Explore our expertise",
    close: lang === "fr" ? "Fermer la fenêtre" : "Close window",
    emailLabel: lang === "fr" ? "Adresse email" : "Email address",
  };

  const closePopup = useCallback(() => {
    setIsOpen(false);
    try {
      localStorage.setItem(POPUP_KEY, "true");
    } catch {}
  }, []);

  const openPopup = useCallback(() => {
    if (!hasSeenPopup()) setIsOpen(true);
  }, []);

  useEffect(() => {
    if (hasSeenPopup()) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollable = document.documentElement.scrollHeight - window.innerHeight;
          if (scrollable > 0 && window.scrollY / scrollable >= SCROLL_TRIGGER_RATIO) {
            openPopup();
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    const handleMouseLeave = (event: MouseEvent) => {
      if (event.clientY <= 0) openPopup();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [openPopup]);

  // Escape, focus trap + restore, and scroll lock (incl. Lenis).
  useDialog({
    open: isOpen,
    containerRef: dialogRef,
    onClose: closePopup,
    initialFocusRef: inputRef,
  });

  function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!isValidEmail(email)) {
      setErrorMsg(copy.invalid);
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      // Calls the server action — API key never leaves the server
      const result = await subscribeToNewsletter(email.trim());

      if (result.ok || result.status === 201 || result.status === 204) {
        setStatus("success");
        // Auto-close after 3 seconds
        setTimeout(() => closePopup(), 3000);
      } else {
        setStatus("error");
        setErrorMsg(copy.genericError);
      }
    } catch {
      setStatus("error");
      setErrorMsg(copy.genericError);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          ref={dialogRef}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/78 backdrop-blur-[8px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="popup-headline"
          onClick={(e) => {
            if (e.target === e.currentTarget) closePopup();
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 pointer-events-none"
          />

          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.93 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative bg-[#111111] border border-[#2A2A2A] rounded-[20px] w-full max-w-[480px] p-[48px_40px_40px] shadow-[0_32px_80px_rgba(0,0,0,0.65)] overflow-hidden max-[560px]:p-[32px_24px_28px] max-[560px]:rounded-[16px]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 text-[#444] hover:text-[#F5F5F0] hover:bg-[#1A1A1A] p-2 rounded-[6px] transition-all cursor-pointer"
              aria-label={copy.close}
            >
              <X size={20} />
            </button>

            {/* Content Swap */}
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center text-center py-4"
                >
                  <div className="w-14 h-14 rounded-full border-2 border-[#6050DC] flex items-center justify-center mb-4">
                    <motion.svg
                      width="28"
                      height="20"
                      viewBox="0 0 28 20"
                      fill="none"
                      aria-hidden="true"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                      <path
                        d="M2 10L10 18L26 2"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </motion.svg>
                  </div>
                  <h3 className="text-[22px] font-bold text-white mb-2">
                    {copy.successTitle}
                  </h3>
                  <p className="text-[#888] text-[14px] leading-relaxed">
                    {copy.successBody}
                  </p>
                  <button
                    onClick={closePopup}
                    className="mt-6 w-full h-[48px] bg-transparent border border-[#6050DC] text-[#6050DC] rounded-[10px] text-[14px] font-medium hover:bg-[#6050DC] hover:text-[#111111] transition-all cursor-pointer"
                  >
                    {copy.discover}
                  </button>
                </motion.div>
              ) : (
                <motion.div key="form" exit={{ opacity: 0, y: -10 }}>
                  <span className="block text-[#6050DC] font-mono text-[11px] uppercase tracking-[0.15em] mb-3">
                    {copy.eyebrow}
                  </span>
                  <h2
                    id="popup-headline"
                    className="text-[32px] max-[560px]:text-[26px] font-bold text-white leading-[1.1] mb-2.5 font-display"
                  >
                    {copy.title}
                  </h2>
                  <p className="text-[#888] text-[14px] leading-[1.65] font-body">
                    {copy.body}
                  </p>

                  <div className="h-[0.5px] bg-[#1E1E1E] my-[22px]" />

                  <form onSubmit={handleSubscribe} className="space-y-2.5" noValidate>
                    <div className="relative">
                      <label htmlFor="newsletter-email" className="sr-only">
                        {copy.emailLabel}
                      </label>
                      <input
                        id="newsletter-email"
                        ref={inputRef}
                        type="email"
                        placeholder={copy.placeholder}
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (status === "error") setStatus("idle");
                        }}
                        className={`w-full h-[52px] bg-[#1A1A1A] border ${
                          status === "error" ? "border-[#E85D24]" : "border-[#2A2A2A]"
                        } rounded-[10px] px-[18px] text-[#F5F5F0] text-[15px] outline-none focus:border-[#6050DC] focus:ring-2 focus:ring-[#6050DC]/20 transition-all font-body`}
                        disabled={status === "loading"}
                        autoComplete="email"
                        aria-describedby={status === "error" ? "newsletter-error" : undefined}
                        aria-invalid={status === "error"}
                      />
                      {status === "error" && (
                        <motion.p
                          id="newsletter-error"
                          role="alert"
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-[#E85D24] text-[12px] mt-1.5 font-body"
                        >
                          {errorMsg}
                        </motion.p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="w-full h-[52px] bg-[#6050DC] text-[#111111] font-semibold rounded-[10px] text-[15px] hover:bg-[#7466E3] hover:-translate-y-0.5 transition-all cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed font-body"
                    >
                      {status === "loading" ? copy.loading : copy.submit}
                    </button>
                  </form>

                  <button
                    onClick={closePopup}
                    className="block w-full text-center mt-3.5 text-[#444] text-[12px] hover:text-[#888] transition-colors font-body cursor-pointer"
                  >
                    {copy.skip}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
