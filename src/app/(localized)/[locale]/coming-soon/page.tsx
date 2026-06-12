import { Metadata } from "next";
import { getDictionary } from "@/i18n/getDictionary";
import type { Locale } from "@/i18n-config";

import ComingSoonClient from "./ComingSoonClient";


// Always fresh — never cache this page
export const dynamic = "force-dynamic";

const PROJECT_ID =
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "gradus-portfolio";
const API_KEY =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
  "AIzaSyDApEMlRaUq3UnRwM2cn3qQEByG6nsX7YM";
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

function parseValue(val: any): any {
  if (!val) return null;
  if (val.stringValue !== undefined) return val.stringValue;
  if (val.booleanValue !== undefined) return val.booleanValue;
  if (val.integerValue !== undefined) return Number(val.integerValue);
  return null;
}

async function getComingSoonData() {
  try {
    const res = await fetch(
      `${BASE_URL}/site_settings/global?key=${API_KEY}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    const doc = await res.json();
    const f = doc.fields || {};
    return {
      headline: parseValue(f.cs_headline) || "Quelque chose arrive.",
      subheading: parseValue(f.cs_subheading) || "Gradus Agency — Casablanca, Maroc",
      launchDate: parseValue(f.cs_launch_date) || "",
      showEmail: parseValue(f.cs_show_email) !== false,
      instagram: parseValue(f.instagram) || "",
      facebook: parseValue(f.facebook) || "",
      linkedin: parseValue(f.linkedin) || "",
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const dict = await getDictionary(locale);
  return {
    title: dict.seo.coming_soon.title,
    description: dict.seo.coming_soon.description,
    alternates: {
      canonical: `${locale === "fr" ? "" : "/" + locale}/coming-soon`,
    },
  };
}

export default async function ComingSoonPage({
  searchParams,
}: {
  searchParams: Promise<{ preview?: string }>;
}) {
  const { preview } = await searchParams;
  const data = await getComingSoonData();

  return (
    <ComingSoonClient
      headline={data?.headline ?? "Quelque chose arrive."}
      subheading={data?.subheading ?? "Gradus Agency — Casablanca, Maroc"}
      launchDate={data?.launchDate ?? ""}
      showEmail={data?.showEmail ?? true}
      instagram={data?.instagram ?? ""}
      facebook={data?.facebook ?? ""}
      linkedin={data?.linkedin ?? ""}
      isPreview={preview === "1"}
    />
  );
}
