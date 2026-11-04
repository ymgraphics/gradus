"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { sendEmailAction } from "@/app/actions/sendEmail";
import { useLanguage } from "@/i18n/LanguageContext";

export default function ContactForm() {
  const { lang } = useLanguage();
  const searchParams = useSearchParams();
  const service = searchParams.get("service");
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const copy = {
    name: lang === "fr" ? "Nom complet" : "Full name",
    email: lang === "fr" ? "Email" : "Email",
    subject: lang === "fr" ? "Sujet" : "Subject",
    message: lang === "fr" ? "Message" : "Message",
    namePlaceholder: lang === "fr" ? "Votre nom" : "Your name",
    emailPlaceholder: "you@example.com",
    subjectPlaceholder:
      lang === "fr" ? "Objet de votre consultation ?" : "Purpose of your consultation?",
    messagePlaceholder:
      lang === "fr" ? "Détaillez vos objectifs et vos ambitions..." : "Detail your objectives and ambitions...",
    success:
      lang === "fr"
        ? "Requête transmise avec succès. Notre direction vous recontactera sous peu."
        : "Your message was sent successfully. We will contact you soon!",
    sending: lang === "fr" ? "Envoi en cours..." : "Sending...",
    submit: lang === "fr" ? "Transmettre la requête" : "Submit request",
    company: lang === "fr" ? "Entreprise" : "Company",
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setStatus("idle");
    setMessage("");

    const formData = new FormData(e.currentTarget);
    const result = await sendEmailAction(formData);

    setPending(false);

    if (result?.error) {
      setStatus("error");
      setMessage(result.error);
    } else if (result?.success) {
      setStatus("success");
      setMessage(copy.success);
      (e.target as HTMLFormElement).reset();
    }
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">{copy.company}</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium text-gradus-muted">{copy.name}</label>
          <input required id="name" name="name" type="text" placeholder={copy.namePlaceholder} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/60 focus:outline-none focus:border-accent/50 transition-colors" />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-gradus-muted">{copy.email}</label>
          <input required id="email" name="email" type="email" placeholder={copy.emailPlaceholder} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/60 focus:outline-none focus:border-accent/50 transition-colors" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="subject" className="text-sm font-medium text-gradus-muted">{copy.subject}</label>
        <input required id="subject" name="subject" type="text" defaultValue={service ? `${lang === "fr" ? "Demande service" : "Service inquiry"}: ${service}` : ""} placeholder={copy.subjectPlaceholder} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/60 focus:outline-none focus:border-accent/50 transition-colors" />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-sm font-medium text-gradus-muted">{copy.message}</label>
        <textarea required id="message" name="message" rows={4} placeholder={copy.messagePlaceholder} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/60 focus:outline-none focus:border-accent/50 transition-colors resize-none"></textarea>
      </div>

      {status === "error" && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-4 rounded-xl">
          {message}
        </div>
      )}

      {status === "success" && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm p-4 rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          {message}
        </div>
      )}

      <button disabled={pending} type="submit" className="group w-full flex items-center justify-center gap-2 bg-accent text-white py-4 rounded-xl font-bold text-lg hover:shadow-[0_0_30px_rgba(96,80,220,0.3)] transition-all mt-4 interactive disabled:opacity-70 disabled:hover:shadow-none">
        {pending ? (
          <>
            {copy.sending} <Loader2 className="w-5 h-5 animate-spin" />
          </>
        ) : (
          <>
            {copy.submit} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>
    </form>
  );
}
