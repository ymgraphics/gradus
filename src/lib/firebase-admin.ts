import * as admin from "firebase-admin";

// Initialize Firebase Admin (singleton pattern)
function getAdminApp() {
  if (admin.apps.length > 0) {
    return admin.apps[0]!;
  }

  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "gradus-portfolio",
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      // Replace \n in the private key (Vercel env vars escape newlines)
      privateKey: (process.env.FIREBASE_ADMIN_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    }),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "gradus-portfolio",
  });
}

function getAdminDb() {
  const app = getAdminApp();
  return admin.firestore(app);
}

export interface Job {
  id: string;
  title: string;
  location: string;
  type: string;
  department: string;
  description: string;
  link: string;
  order: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  tags: string[];
  isCeo: boolean;
  imageUrl: string;
  order: number;
}

export interface Feedback {
  id: string;
  name: string;
  title: string;
  feedback: string;
  rating: number;
  avatarUrl: string;
  order: number;
}

const toNum = (val: any) => {
  const n = Number(val);
  return isNaN(n) ? 999 : n;
};

export async function getAdminJobs(): Promise<Job[]> {
  try {
    const db = getAdminDb();
    const snap = await db.collection("jobs").get();
    if (snap.empty) return [];

    return snap.docs
      .map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          title: d.title || "Position",
          location: d.location || "Remote",
          type: d.type || "Full-time",
          department: d.department || "Team",
          description: d.description || "",
          link: d.link || "#",
          order: toNum(d.sort_order ?? d.order),
        } as Job;
      })
      .sort((a, b) => a.order - b.order);
  } catch (error: any) {
    console.error("[Admin] Error fetching jobs:", error?.message);
    return [];
  }
}

export async function getAdminTeamMembers(): Promise<TeamMember[]> {
  try {
    const db = getAdminDb();
    const snap = await db.collection("team_members").get();
    if (snap.empty) return [];

    return snap.docs
      .map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          name: d.name || "Member",
          role: d.role || "Team",
          tags: d.tags || [],
          isCeo: d.is_ceo === true,
          imageUrl: d.image_url || "",
          order: toNum(d.sort_order ?? d.order),
        } as TeamMember;
      })
      .sort((a, b) => a.order - b.order);
  } catch (error: any) {
    console.error("[Admin] Error fetching team members:", error?.message);
    return [];
  }
}

export async function getAdminFeedbacks(): Promise<Feedback[]> {
  try {
    const db = getAdminDb();
    const snap = await db.collection("feedbacks").get();
    if (snap.empty) return [];

    return snap.docs
      .map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          name: d.name || "Client",
          title: d.title || "",
          feedback: d.feedback || "",
          rating: toNum(d.rating || 5),
          avatarUrl: d.avatar_url || "",
          order: toNum(d.sort_order ?? d.order),
        } as Feedback;
      })
      .sort((a, b) => a.order - b.order);
  } catch (error: any) {
    console.error("[Admin] Error fetching feedbacks:", error?.message);
    return [];
  }
}
