import { NextRequest, NextResponse } from "next/server";
import { dbGet, dbCreateWithId, getTokenFromRequest } from "@/lib/admin-db";

const COLLECTION = "site_content";
const DOC_ID = "main";

export async function GET(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const doc = await dbGet(COLLECTION, DOC_ID, token);
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
    const result = await dbCreateWithId(COLLECTION, DOC_ID, body, token);
    return NextResponse.json(result);
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
