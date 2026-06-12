// Firebase REST API client - works reliably on Vercel serverless (no gRPC)
const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "gradus-portfolio";
const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDApEMlRaUq3UnRwM2cn3qQEByG6nsX7YM";
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

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

// Parse a Firestore REST API value field
function parseValue(val: any): any {
  if (!val) return null;
  if (val.stringValue !== undefined) return val.stringValue;
  if (val.integerValue !== undefined) return Number(val.integerValue);
  if (val.doubleValue !== undefined) return Number(val.doubleValue);
  if (val.booleanValue !== undefined) return val.booleanValue;
  if (val.arrayValue !== undefined) {
    return (val.arrayValue.values || []).map(parseValue);
  }
  if (val.mapValue !== undefined) {
    const obj: any = {};
    const fields = val.mapValue.fields || {};
    for (const [k, v] of Object.entries(fields)) {
      obj[k] = parseValue(v);
    }
    return obj;
  }
  return null;
}

// Parse a Firestore document into a plain JS object
function parseDoc(doc: any): any {
  const fields = doc.fields || {};
  const obj: any = {};
  for (const [key, val] of Object.entries(fields)) {
    obj[key] = parseValue(val as any);
  }
  // Extract ID from document name path
  obj._id = doc.name?.split("/").pop() || "";
  return obj;
}

async function fetchCollection(collectionName: string): Promise<any[]> {
  try {
    const url = `${BASE_URL}/${collectionName}?key=${API_KEY}`;
    const res = await fetch(url, { next: { revalidate: 30 } });
    if (!res.ok) {
      console.error(`[REST] Failed to fetch ${collectionName}: ${res.status} ${res.statusText}`);
      return [];
    }
    const json = await res.json();
    if (!json.documents) return [];
    return json.documents.map(parseDoc);
  } catch (err: any) {
    console.error(`[REST] Error fetching ${collectionName}:`, err?.message);
    return [];
  }
}

const toNum = (val: any) => {
  const n = Number(val);
  return isNaN(n) ? 999 : n;
};

export async function getRestJobs(): Promise<Job[]> {
  const docs = await fetchCollection("jobs");
  return docs
    .map((d) => ({
      id: d._id,
      title: d.title || "Position",
      location: d.location || "Remote",
      type: d.type || "Full-time",
      department: d.department || "Team",
      description: d.description || "",
      link: d.link || "#",
      order: toNum(d.sort_order ?? d.order),
    } as Job))
    .sort((a, b) => a.order - b.order);
}

export async function getRestTeamMembers(): Promise<TeamMember[]> {
  const docs = await fetchCollection("team_members");
  return docs
    .map((d) => ({
      id: d._id,
      name: d.name || "Member",
      role: d.role || "Team",
      tags: Array.isArray(d.tags) ? d.tags : [],
      isCeo: d.is_ceo === true,
      imageUrl: d.image_url || "",
      order: toNum(d.sort_order ?? d.order),
    } as TeamMember))
    .sort((a, b) => a.order - b.order);
}

export async function getRestFeedbacks(): Promise<Feedback[]> {
  const docs = await fetchCollection("feedbacks");
  return docs
    .map((d) => ({
      id: d._id,
      name: d.name || "Client",
      title: d.title || "",
      feedback: d.feedback || "",
      rating: toNum(d.rating || 5),
      avatarUrl: d.avatar_url || "",
      order: toNum(d.sort_order ?? d.order),
    } as Feedback))
    .sort((a, b) => a.order - b.order);
}

export async function getRestPartners(): Promise<Partner[]> {
  const docs = await fetchCollection("partners");
  return docs
    .map((d) => ({
      id: d._id,
      name: d.name || "Partner",
      imageUrl: d.image_url || "",
      order: toNum(d.sort_order ?? d.order),
    } as Partner))
    .sort((a, b) => a.order - b.order);
}

export interface BrandingGuideline {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  pdf_url: string;
  category: string;
  project_id: string;
  sort_order: number;
}

export async function getRestBrandingGuidelines(projectId?: string): Promise<BrandingGuideline[]> {
  const docs = await fetchCollection("branding_guidelines");
  return docs
    .map((d) => ({
      id: d._id,
      title: d.title || "Brand Guideline",
      description: d.description || "",
      thumbnail: d.thumbnail || d.image_url || "",
      pdf_url: d.pdf_url || d.pdfUrl || d.pdf || "",
      category: d.category || "Identity",
      project_id: d.project_id || d.projectId || "",
      sort_order: toNum(d.sort_order ?? d.order),
    } as BrandingGuideline))
    .filter((g) => !projectId || g.project_id === projectId || g.project_id === "")
    .sort((a, b) => a.sort_order - b.sort_order);
}

export async function getRestProjects(): Promise<any[]> {
  const docs = await fetchCollection("projects");
  return docs
    .map((d) => {
      // Handle modular media structure
      const mediaAssets = d.media?.assets || d.assets || []; // Support root 'assets' too
      const restVideos = mediaAssets
        .filter((a: any) => a.type === "video")
        .map((a: any) => a.url);
      const restImages = mediaAssets
        .filter((a: any) => a.type === "image")
        .map((a: any) => a.url);

      const legacyVideos = Array.isArray(d.videos || d.Videos) ? (d.videos || d.Videos) : [];
      const legacyImages = Array.isArray(d.gallery_images || d.galleryImages) ? (d.gallery_images || d.galleryImages) : [];

      const id = d._id;
      let category = d.category || d.Category || "";
      let tags = Array.isArray(d.tags) ? d.tags : [];
      let sort_order = toNum(d.sort_order ?? d.settings?.sort_order ?? d.order);

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

      // Default category fallback if not matched
      if (!category) {
        category = "Marketing";
      }

      return {
        id,
        client: d.client || d.Client || "Client",
        industry: d.industry || d.Industry || d.content?.industry || "",
        year: d.year || d.Year || "2024",
        category,
        tags,
        description: d.description || d.content?.description || "",
        challenge: d.challenge || d.content?.challenge || "",
        solution: d.solution || d.content?.solution || "",
        results: d.results || d.content?.results || "",
        coverImage: d.media?.cover || d.cover_image || d.CoverImage || d.coverImage || "",
        galleryImages: [...new Set([...restImages, ...legacyImages])], // Merge both to be safe
        videos: [...new Set([...restVideos, ...legacyVideos])], // Merge both to be safe
        logo: d.media?.logo || d.logo || d.Logo || "",
        media: { 
          cover: d.media?.cover || d.cover_image || d.CoverImage || d.coverImage || "",
          logo: d.media?.logo || d.logo || d.Logo || "",
          assets: mediaAssets 
        },
        format: d.format || d.Format || d.settings?.layout_format || "half",
        published: d.published ?? d.settings?.published ?? true,
        featured: d.featured ?? d.settings?.featured ?? false,
        seo_title: d.seo_title || d.seo?.title || "",
        seo_description: d.seo_description || d.seo?.description || "",
        sort_order,
      };
    })
    .filter(p => p.published !== false)
    .sort((a, b) => a.sort_order - b.sort_order);
}
