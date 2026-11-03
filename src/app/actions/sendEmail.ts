"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 3;
const rateLimit = new Map<string, { count: number; resetAt: number }>();

function readField(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isRateLimited(email: string) {
  const now = Date.now();
  const key = email.toLowerCase();
  const current = rateLimit.get(key);

  if (!current || current.resetAt <= now) {
    rateLimit.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  current.count += 1;
  return current.count > MAX_REQUESTS;
}

export async function sendEmailAction(formData: FormData) {
  const name = readField(formData, "name");
  const email = readField(formData, "email");
  const subject = readField(formData, "subject");
  const message = readField(formData, "message");
  const company = readField(formData, "company");

  if (company) {
    return { success: true };
  }

  if (!name || !email || !subject || !message) {
    return { error: "Veuillez remplir les champs obligatoires." };
  }

  if (!isValidEmail(email)) {
    return { error: "Veuillez entrer une adresse email valide." };
  }

  if (name.length > 120 || subject.length > 180 || message.length > 4000) {
    return { error: "Votre message est trop long. Merci de le raccourcir." };
  }

  if (isRateLimited(email)) {
    return { error: "Trop de tentatives. Merci de réessayer dans quelques minutes." };
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br/>");
  const agencyEmail = process.env.CONTACT_TO_EMAIL || "contact@gradus.ma";
  const fromEmail = process.env.CONTACT_FROM_EMAIL || "Gradus Agency <contact@measbahrain.live>";

  try {
    const leadEmail = await resend.emails.send({
      from: fromEmail,
      to: agencyEmail,
      replyTo: email,
      subject: `Nouveau lead Gradus: ${subject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #111111;">Nouveau message depuis gradus.ma</h2>
          <p><strong>Nom :</strong> ${safeName}</p>
          <p><strong>Email :</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
          <p><strong>Sujet :</strong> ${safeSubject}</p>
          <blockquote style="border-left: 4px solid #D4A843; padding-left: 16px; color: #555; font-style: italic;">
            ${safeMessage}
          </blockquote>
        </div>
      `,
    });

    if (leadEmail.error) {
      return { error: leadEmail.error.message };
    }

    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: `Merci pour votre message, ${name} !`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #111111;">Bonjour ${safeName},</h2>
          <p>Nous avons bien reçu votre message concernant <strong>${safeSubject}</strong>.</p>
          <p>Notre équipe créative vous répondra sous 24 à 48 heures.</p>
          <p>À très vite,<br/><strong>L'équipe Gradus</strong></p>
        </div>
      `,
    });

    return { success: true };
  } catch {
    return { error: "Une erreur est survenue lors de l'envoi du message." };
  }
}

const LEAD_SERVICES: Record<string, string> = {
  branding: "Branding & Logo",
  "social-media": "Social Media",
  video: "Vidéo / Reels",
  "web-design": "Web Design",
};

function isValidPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return /^[+\d\s().-]+$/.test(phone) && digits.length >= 8 && digits.length <= 15;
}

/**
 * Quick estimate request from the floating ConversionHub panel.
 * Collects a name and a WhatsApp number (no email), so it gets its own action.
 */
export async function sendLeadAction(formData: FormData) {
  const name = readField(formData, "name");
  const phone = readField(formData, "phone");
  const serviceId = readField(formData, "service");
  const company = readField(formData, "company");

  // Honeypot: silently accept bot submissions.
  if (company) {
    return { success: true };
  }

  if (!name || !phone) {
    return { error: "missing" as const };
  }

  if (name.length > 120 || !isValidPhone(phone)) {
    return { error: "invalid" as const };
  }

  if (isRateLimited(`lead:${phone.replace(/\D/g, "")}`)) {
    return { error: "rate_limited" as const };
  }

  const service = LEAD_SERVICES[serviceId] ?? "Non précisé";
  const safeName = escapeHtml(name);
  const safePhone = escapeHtml(phone);
  const waNumber = phone.replace(/\D/g, "");
  const agencyEmail = process.env.CONTACT_TO_EMAIL || "contact@gradus.ma";
  const fromEmail = process.env.CONTACT_FROM_EMAIL || "Gradus Agency <contact@measbahrain.live>";

  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to: agencyEmail,
      subject: `Demande d'estimation Gradus: ${service} — ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #111111;">Nouvelle demande d'estimation (widget du site)</h2>
          <p><strong>Nom / Entreprise :</strong> ${safeName}</p>
          <p><strong>WhatsApp :</strong> <a href="https://wa.me/${waNumber}">${safePhone}</a></p>
          <p><strong>Service :</strong> ${escapeHtml(service)}</p>
        </div>
      `,
    });

    if (result.error) {
      return { error: "send_failed" as const };
    }

    return { success: true };
  } catch {
    return { error: "send_failed" as const };
  }
}
