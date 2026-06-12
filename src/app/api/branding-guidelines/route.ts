import { NextResponse, NextRequest } from "next/server";
import { getRestBrandingGuidelines } from "@/lib/firebase-rest";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId") || undefined;
    
    const guidelines = await getRestBrandingGuidelines(projectId);

    return NextResponse.json(
      guidelines,
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (error: any) {
    console.error("[API /branding-guidelines] Error:", error?.message);
    return NextResponse.json(
      { error: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
