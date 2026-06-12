import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs, query, where, orderBy } from "firebase/firestore";
import type { Project } from "@/lib/constants";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDApEMlRaUq3UnRwM2cn3qQEByG6nsX7YM",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "gradus-portfolio.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "gradus-portfolio",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "gradus-portfolio.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1090805777507",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1090805777507:web:83f4140e15430738482456"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

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

export interface Partner {
  id: string;
  name: string;
  imageUrl: string;
  order: number;
}

// Helper to safely convert types from Firestore
const toBool = (val: any) => val === true || val === "true";
const toNum = (val: any) => {
  const n = Number(val);
  return isNaN(n) ? 999 : n;
};

// Smart Normalizer to handle Old vs New structures without breaking the UI
function normalizeProject(id: string, data: any): Project {
  // 1. Identity & Content
  const client = data.client || data.Client || "Client";
  const year = data.year || data.Year || "2024";
  
  let category = data.category || data.Category || "";
  let tags = data.tags || data.Tags || [];
  let sort_order = toNum(data.settings?.sort_order ?? data.sort_order ?? data.SortOrder ?? data.order);

  // Smart fallback for known project IDs with incomplete database records
  const projectFallbacks: Record<string, { category: string; tags: string[]; order: number }> = {
    "aiku-corniche": {
      category: "Branding · Social Media",
      tags: ["Branding", "Social Media", "Identité Visuelle"],
      order: 10
    },
    "corniche": {
      category: "Social Media · Photo & Vidéo",
      tags: ["Social Media", "Photo", "Vidéo"],
      order: 20
    },
    "dar-dada": {
      category: "Branding · Social Media",
      tags: ["Branding", "Social Media", "Gastronomie"],
      order: 30
    },
    "domaine-limoune": {
      category: "Branding · Photo & Vidéo",
      tags: ["Branding", "Photo", "Vidéo", "Production Vidéo"],
      order: 40
    },
    "kamanja-55": {
      category: "Branding · Social Media",
      tags: ["Branding", "Social Media", "Identité Visuelle"],
      order: 50
    },
    "louna": {
      category: "Branding · Print",
      tags: ["Branding", "Print", "Charte Graphique"],
      order: 60
    },
    "marion-corniche": {
      category: "Branding · Social Media",
      tags: ["Branding", "Social Media", "Print"],
      order: 70
    },
    "movenpick-casablanca": {
      category: "Photo & Vidéo · Social Media",
      tags: ["Photo", "Vidéo", "Social Media", "Production Vidéo"],
      order: 80
    },
    "sunset-corniche": {
      category: "Photo & Vidéo · Social Media",
      tags: ["Photo", "Vidéo", "Social Media", "Production Vidéo"],
      order: 90
    }
  };

  if (projectFallbacks[id]) {
    if (!category || category === "Marketing" || category === "") {
      category = projectFallbacks[id].category;
    }
    if (tags.length === 0) {
      tags = projectFallbacks[id].tags;
    }
    if (sort_order === 999) {
      sort_order = projectFallbacks[id].order;
    }
  }

  // Default category fallback
  if (!category) {
    category = "Marketing";
  }
  
  // Use nested content if exists, else fallback to root
  const description = data.content?.description || data.description || "";
  const challenge = data.content?.challenge || data.challenge || data.Challenge || "";
  const solution = data.content?.solution || data.solution || data.Solution || "";
  const results = data.content?.results || data.results || data.Results || "";
  const industry = data.content?.industry || data.industry || data.Industry || "";

  // 2. Media System (The most critical part)
  const coverImage = data.media?.cover || data.cover_image || data.CoverImage || data.coverImage || "";
  const logo = data.media?.logo || data.logo || data.Logo || "";
  const logo_light = data.media?.logo_light || "";
  
  // Convert legacy gallery/videos to new asset format if new media.assets is missing
  const assets = data.media?.assets || [];
  if (assets.length === 0) {
    const legacyVideos = data.videos || data.Videos || [];
    const legacyImages = data.gallery_images || data.GalleryImages || data.galleryImages || [];
    
    legacyVideos.forEach((v: string, i: number) => {
      assets.push({
        id: `v-${i}`,
        url: v,
        type: "video",
        format: v.includes("reel") || v.includes("vertical") ? "reel" : "landscape",
        aspect: v.includes("reel") || v.includes("vertical") ? "portrait" : "landscape",
      });
    });
    
    legacyImages.forEach((img: string, i: number) => {
      assets.push({
        id: `i-${i}`,
        url: img,
        type: "image",
        format: "photography",
        aspect: "landscape", // Default for legacy
      });
    });
  }

  // 3. SEO & Settings
  const seo_title = data.seo?.title || data.seo_title || data.SeoTitle || "";
  const seo_description = data.seo?.description || data.seo_description || data.SeoDescription || "";
  const published = data.settings?.published ?? data.published ?? data.Published ?? true;
  const featured = data.settings?.featured ?? data.featured ?? data.Featured ?? false;
  const format = data.settings?.layout_format || data.format || data.Format || "half";

  return {
    id,
    client,
    year,
    category,
    tags,
    description,
    industry,
    challenge,
    solution,
    results,
    coverImage,
    logo,
    galleryImages: data.gallery_images || [], // Maintain legacy field for UI
    videos: data.videos || [], // Maintain legacy field for UI
    format,
    published,
    featured,
    seo_title,
    seo_description,
    sort_order,
    // Include new objects for UI components that are ready
    content: { description, challenge, solution, results, industry },
    media: { cover: coverImage, logo, logo_light, assets },
    seo: { title: seo_title, description: seo_description },
    settings: { published, featured, sort_order, layout_format: format }
  } as Project;
}

export async function getProjects(): Promise<Project[]> {
  try {
    if (!firebaseConfig.projectId) return [];
    const querySnapshot = await getDocs(collection(db, "projects"));
    
    if (querySnapshot.empty) return [];

    const projects = querySnapshot.docs.map(doc => normalizeProject(doc.id, doc.data()));
    
    return projects
      .filter(p => p.published !== false)
      .sort((a, b) => (a.sort_order || 999) - (b.sort_order || 999));
  } catch (error: any) {
    console.error("[Firebase] Error fetching projects:", error?.message || error);
    return [];
  }
}

export async function getJobs(): Promise<Job[]> {
  try {
    if (!firebaseConfig.projectId) return [];
    
    const variations = ["jobs", "Jobs", "jobs ", " jobs", "hiring", "Hiring", "JOB", "Jobs_List"];
    let querySnapshot = null;
    
    for (const name of variations) {
      try {
        const snap = await getDocs(collection(db, name));
        if (!snap.empty) { querySnapshot = snap; break; }
      } catch (e: any) {
        continue;
      }
    }
    
    if (!querySnapshot || querySnapshot.empty) return [];

    const jobs = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || data.Title || "Position",
        location: data.location || data.Location || "Remote",
        type: data.type || data.Type || "Full-time",
        department: data.department || data.Department || "Team",
        description: data.description || data.Description || "",
        link: data.link || data.Link || "#",
        order: toNum(data.sort_order ?? data.SortOrder ?? data.order),
      } as Job;
    });
    
    return jobs.sort((a, b) => a.order - b.order);
  } catch (error: any) {
    console.error("[Firebase] Error fetching jobs:", error?.message || error);
    return [];
  }
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    if (!firebaseConfig.projectId) return [];
    
    const variations = ["team_members", "team", "Team", "TeamMembers", "team_members ", " team_members", "team ", " team", "MEMBERS"];
    let querySnapshot = null;
    
    for (const name of variations) {
      try {
        const snap = await getDocs(collection(db, name));
        if (!snap.empty) { querySnapshot = snap; break; }
      } catch (e: any) {
        continue;
      }
    }
    
    if (!querySnapshot || querySnapshot.empty) return [];

    const members = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || data.Name || "Member",
        role: data.role || data.Role || "Team",
        tags: data.tags || data.Tags || [],
        isCeo: toBool(data.is_ceo ?? data.IsCeo ?? data.isCeo),
        imageUrl: data.image_url || data.ImageUrl || data.imageUrl || "",
        order: toNum(data.sort_order ?? data.SortOrder ?? data.order),
      } as TeamMember;
    });
    
    return members.sort((a, b) => a.order - b.order);
  } catch (error: any) {
    console.error("[Firebase] Error fetching team members:", error?.message || error);
    return [];
  }
}

export async function getFeedbacks(): Promise<Feedback[]> {
  try {
    if (!firebaseConfig.projectId) return [];
    const querySnapshot = await getDocs(collection(db, "feedbacks"));
    
    if (querySnapshot.empty) return [];

    const feedbacks = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || data.Name || "Client",
        title: data.title || data.Title || "",
        feedback: data.feedback || data.Feedback || "",
        rating: toNum(data.rating || data.Rating || 5),
        avatarUrl: data.avatar_url || data.AvatarUrl || data.avatarUrl || "",
        order: toNum(data.sort_order ?? data.SortOrder ?? data.order),
      } as Feedback;
    });
    
    return feedbacks.sort((a, b) => a.order - b.order);
  } catch (error: any) {
    console.error("[Firebase] Error fetching feedbacks:", error?.message || error);
    return [];
  }
}

export async function getPartners(): Promise<Partner[]> {
  try {
    if (!firebaseConfig.projectId) return [];
    
    const variations = ["partners", "Partners", "brands", "Brands", "PARTNERS", "Logos"];
    let querySnapshot = null;
    
    for (const name of variations) {
      try {
        const snap = await getDocs(collection(db, name));
        if (!snap.empty) { querySnapshot = snap; break; }
      } catch (e: any) {
        continue;
      }
    }
    
    if (!querySnapshot || querySnapshot.empty) return [];

    const partners = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || data.Name || "Partner",
        imageUrl: data.image_url || data.ImageUrl || data.imageUrl || "",
        order: toNum(data.sort_order ?? data.SortOrder ?? data.order),
      } as Partner;
    });
    
    return partners.sort((a, b) => a.order - b.order);
  } catch (error: any) {
    console.error("[Firebase] Error fetching partners:", error?.message || error);
    return [];
  }
}
