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
    <form className="flex flex-col gap-10" onSubmit={handleSubmit}>
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">{copy.company}</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="label-utility">{copy.name}</label>
          <input required id="name" name="name" type="text" placeholder={copy.namePlaceholder} className="w-full bg-transparent border-0 border-b border-gradus-border rounded-none px-0 py-3 text-body text-text-primary placeholder:text-white/50 focus:border-accent transition-colors" />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="label-utility">{copy.email}</label>
          <input required id="email" name="email" type="email" placeholder={copy.emailPlaceholder} className="w-full bg-transparent border-0 border-b border-gradus-border rounded-none px-0 py-3 text-body text-text-primary placeholder:text-white/50 focus:border-accent transition-colors" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="subject" className="label-utility">{copy.subject}</label>
        <input required id="subject" name="subject" type="text" defaultValue={service ? `${lang === "fr" ? "Demande service" : "Service inquiry"}: ${service}` : ""} placeholder={copy.subjectPlaceholder} className="w-full bg-transparent border-0 border-b border-gradus-border rounded-none px-0 py-3 text-body text-text-primary placeholder:text-white/50 focus:border-accent transition-colors" />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="label-utility">{copy.message}</label>
        <textarea required id="message" name="message" rows={4} placeholder={copy.messagePlaceholder} className="w-full bg-transparent border-0 border-b border-gradus-border rounded-none px-0 py-3 text-body text-text-primary placeholder:text-white/50 focus:border-accent transition-colors resize-none"></textarea>
      </div>

      {status === "error" && (
        <div role="alert" className="border-l-2 border-red-400 pl-4 py-1 text-caption text-red-300">
          {message}
        </div>
      )}

      {status === "success" && (
        <div role="status" className="border-l-2 border-accent pl-4 py-1 text-caption text-text-primary flex items-center gap-3">
          <CheckCircle2 className="w-4 h-4 text-accent shrink-0" aria-hidden="true" />
          {message}
        </div>
      )}

      <button
        disabled={pending}
        type="submit"
        className="group w-full inline-flex items-center justify-between gap-4 border border-accent px-8 py-5 label-utility text-text-primary hover:bg-accent hover:text-text-primary transition-colors duration-300 interactive disabled:opacity-70 disabled:hover:bg-transparent"
      >
        {pending ? (
          <>
            {copy.sending} <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          </>
        ) : (
          <>
            {copy.submit} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  );
}
