import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest } from "@/lib/admin-db";

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "gradus-portfolio";
const STORAGE_BASE = `https://firebasestorage.googleapis.com/v0/b/${PROJECT_ID}.firebasestorage.app/o`;
const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDApEMlRaUq3UnRwM2cn3qQEByG6nsX7YM";

export async function POST(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "uploads";

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const fileName = `${folder}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const encodedName = encodeURIComponent(fileName);

    // Upload via Firebase Storage REST API
    const uploadUrl = `${STORAGE_BASE}/${encodedName}?uploadType=media&name=${encodedName}&key=${API_KEY}`;
    const buffer = await file.arrayBuffer();

    const res = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "Content-Type": file.type || "application/octet-stream",
        Authorization: `Bearer ${token}`,
      },
      body: buffer,
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Upload failed: ${res.status} - ${err}`);
    }

    const data = await res.json();
    const downloadToken = data.downloadTokens || "";
    const publicUrl = `${STORAGE_BASE}/${encodedName}?alt=media&token=${downloadToken}`;

    return NextResponse.json({
      ok: true,
      name: file.name,
      fullPath: fileName,
      url: publicUrl,
      contentType: file.type,
      size: file.size,
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
