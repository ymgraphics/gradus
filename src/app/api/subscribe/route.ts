import { NextRequest, NextResponse } from "next/server";

const PROJECT_ID =
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "gradus-portfolio";
const API_KEY =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
  "AIzaSyDApEMlRaUq3UnRwM2cn3qQEByG6nsX7YM";
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Save to Firestore `subscribers` collection with auto-generated ID
    const doc = {
      fields: {
        email: { stringValue: normalizedEmail },
        source: { stringValue: "coming_soon" },
        subscribed_at: { stringValue: new Date().toISOString() },
        ip: { stringValue: req.headers.get("x-forwarded-for") || "unknown" },
      },
    };

    const res = await fetch(
      `${BASE_URL}/subscribers?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doc),
        cache: "no-store",
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error("[subscribe] Firestore error:", err);
      return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[subscribe] Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
