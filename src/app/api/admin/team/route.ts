import { NextRequest, NextResponse } from "next/server";
import { dbList, dbCreate, getTokenFromRequest } from "@/lib/admin-db";

export async function GET(req: NextRequest) {
  const token = getTokenFromRequest(req);
  try {
    const docs = await dbList("team_members", token);
    return NextResponse.json(docs);
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const doc = await dbCreate("team_members", body, token);
    return NextResponse.json(doc, { status: 201 });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
