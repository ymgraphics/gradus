import { NextRequest, NextResponse } from "next/server";
import { dbList, getTokenFromRequest } from "@/lib/admin-db";

export async function GET(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const docs = await dbList("subscribers", token);
    const subscribers = docs.map((d) => ({
      id: d._id as string,
      email: (d.email as string) || "",
      source: (d.source as string) || "coming_soon",
      subscribed_at: (d.subscribed_at as string) || "",
      status: (d.status as string) || "new",
      notes: (d.notes as string) || "",
      last_contacted_at: (d.last_contacted_at as string) || "",
      ip: (d.ip as string) || "",
    })).sort((a, b) =>
      new Date(b.subscribed_at).getTime() - new Date(a.subscribed_at).getTime()
    );
    return NextResponse.json(subscribers);
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
