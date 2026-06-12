import { NextResponse } from "next/server";

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
  if (val.nullValue !== undefined) return null;
  return null;
}

export async function GET() {
  try {
    const res = await fetch(
      `${BASE_URL}/site_settings/global?key=${API_KEY}`,
      { cache: "no-store" }
    );
    if (!res.ok) return NextResponse.json({ coming_soon: false });
    const doc = await res.json();
    const fields = doc.fields || {};
    const comingSoon = parseValue(fields.coming_soon) === true;
    const headline = parseValue(fields.cs_headline) || "Quelque chose arrive.";
    const subheading = parseValue(fields.cs_subheading) || "Gradus Agency — Casablanca, Maroc";
    const launchDate = parseValue(fields.cs_launch_date) || "";
    const showEmail = parseValue(fields.cs_show_email) !== false;
    const instagram = parseValue(fields.instagram) || "";
    const facebook = parseValue(fields.facebook) || "";
    const linkedin = parseValue(fields.linkedin) || "";

    return NextResponse.json({
      coming_soon: comingSoon,
      headline,
      subheading,
      launch_date: launchDate,
      show_email: showEmail,
      instagram,
      facebook,
      linkedin,
    });
  } catch {
    return NextResponse.json({ coming_soon: false });
  }
}
