import { NextRequest, NextResponse } from "next/server";
import { dbGet, dbUpdate, getTokenFromRequest } from "@/lib/admin-db";

const SETTINGS_DOC = "site_settings";
const SETTINGS_ID = "global";

export async function GET(req: NextRequest) {
  const token = getTokenFromRequest(req);
  try {
    const doc = await dbGet(SETTINGS_DOC, SETTINGS_ID, token);
    return NextResponse.json(doc || {});
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const doc = await dbUpdate(SETTINGS_DOC, SETTINGS_ID, body, token);

    // Set the __cs_mode cookie so middleware can read it without a Firestore call
    const comingSoon = body.coming_soon === true;
    const response = NextResponse.json(doc);
    response.cookies.set("__cs_mode", comingSoon ? "1" : "0", {
      path: "/",
      maxAge: 3600,
      httpOnly: false, // needs to be readable by middleware
      sameSite: "lax",
    });
    return response;
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
