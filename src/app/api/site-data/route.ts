import { NextResponse } from "next/server";
import { getRestJobs, getRestTeamMembers, getRestFeedbacks, getRestPartners, getRestProjects } from "@/lib/firebase-rest";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const [jobs, teamMembers, feedbacks, partners, projects] = await Promise.all([
      getRestJobs(),
      getRestTeamMembers(),
      getRestFeedbacks(),
      getRestPartners(),
      getRestProjects(),
    ]);

    return NextResponse.json(
      { jobs, teamMembers, feedbacks, partners, projects },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (error: any) {
    console.error("[API /site-data] Error:", error?.message);
    return NextResponse.json(
      { jobs: [], teamMembers: [], feedbacks: [], partners: [], projects: [], error: error?.message },
      { status: 500 }
    );
  }
}
