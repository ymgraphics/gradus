import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest } from "@/lib/admin-db";

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "gradus-portfolio";
const STORAGE_BASE = `https://firebasestorage.googleapis.com/v0/b/${PROJECT_ID}.firebasestorage.app/o`;
const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDApEMlRaUq3UnRwM2cn3qQEByG6nsX7YM";

// GET — list files from Firebase Storage
export async function GET(req: NextRequest) {
  const token = getTokenFromRequest(req);
  const { searchParams } = new URL(req.url);
  const prefix = searchParams.get("prefix") || "";

  try {
    const authHeader: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
    const url = `${STORAGE_BASE}?prefix=${encodeURIComponent(prefix)}&maxResults=200&key=${API_KEY}`;
    const res = await fetch(url, { headers: authHeader, cache: "no-store" });

    if (!res.ok) {
      // Return empty list gracefully if storage isn't configured
      return NextResponse.json({ files: [], error: "Storage not accessible" });
    }

    const data = await res.json();
    const items = data.items || [];

    const files = items.map((item: Record<string, unknown>) => {
      const name = item.name as string;
      const metadata = (item.metadata as Record<string, string>) || {};
      const size = Number(item.size || 0);
      const timeCreated = item.timeCreated as string || "";
      const contentType = (item.contentType as string) || "application/octet-stream";

      // Build download URL
      const encodedName = encodeURIComponent(name);
      const downloadUrl = `${STORAGE_BASE}/${encodedName}?alt=media&token=${metadata.firebaseStorageDownloadTokens || ""}&key=${API_KEY}`;

      return {
        name: name.split("/").pop() || name,
        fullPath: name,
        size,
        contentType,
        timeCreated,
        url: downloadUrl,
        isImage: contentType.startsWith("image/"),
        isVideo: contentType.startsWith("video/"),
        isPdf: contentType === "application/pdf",
      };
    });

    return NextResponse.json({ files });
  } catch (e: unknown) {
    return NextResponse.json({ files: [], error: (e as Error).message });
  }
}

// DELETE — delete a file from Firebase Storage
export async function DELETE(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path");
  if (!path) return NextResponse.json({ error: "Path required" }, { status: 400 });

  try {
    const encodedPath = encodeURIComponent(path);
    const url = `${STORAGE_BASE}/${encodedPath}?key=${API_KEY}`;
    const res = await fetch(url, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok && res.status !== 404) {
      throw new Error(`Delete failed: ${res.status}`);
    }

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
