import { notFound } from "next/navigation";
import { getRestProjects } from "@/lib/firebase-rest";
import { defaultProjects as fallbackProjects, SITE_URL } from "@/lib/constants";
import Navbar from "@/layouts/Navbar";
import Footer from "@/layouts/Footer";
import { Metadata } from "next";
import ProjectClient from "./ProjectClient";

// Revalidate every 60s so admin changes appear quickly
export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const projects = await getRestProjects();
    const getSeoSlug = (p: any) => {
      const catSlug = (p.category || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      return catSlug ? `${p.id}-${catSlug}` : p.id;
    };
    return projects.flatMap((p: any) => [
      { id: p.id },
      { id: getSeoSlug(p) }
    ]);
  } catch (error) {
    console.error("Error generating static params for projects:", error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const baseUrl = SITE_URL.endsWith("/") ? SITE_URL.slice(0, -1) : SITE_URL;
  
  try {
    const { id } = await params;
    const decodedId = decodeURIComponent(id).toLowerCase();
    
    // Helper to find project by exact ID or descriptive slug prefix (e.g. "dar-dada-branding" -> "dar-dada")
    const findProject = (list: any[], searchId: string) => {
      const cleanId = searchId.toLowerCase();
      return list.find((p) => p.id.toLowerCase() === cleanId) || 
             list.find((p) => cleanId.startsWith(p.id.toLowerCase() + "-"));
    };

    // Fetch project details using our REST API client
    const projects = await getRestProjects();
    const project = findProject(projects, decodedId);

    if (!project) {
      return {
        title: "Project Not Found | Gradus",
        description: "The requested project case study could not be found.",
      };
    }

    const title = project.seo_title || `Projet ${project.client} · ${project.category} Casablanca | Gradus Agency`;
    const description = project.seo_description || project.description || `Découvrez le cas d'étude complet du projet ${project.client} réalisé par Gradus, agence de communication et design à Casablanca, Maroc.`;
    const canonicalUrl = `${baseUrl}/projects/${project.id}`;
    const shareImage = project.coverImage || `${baseUrl}/assets/og-image.png`;

    return {
      title,
      description,
      alternates: {
        canonical: canonicalUrl,
      },
      keywords: [
        project.client,
        project.category,
        ...(project.tags || []),
        "casablanca creative agency",
        "morocco digital marketing",
        "case study",
        "design portfolio",
      ],
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        type: "article",
        siteName: "Gradus Agency",
        images: [
          {
            url: shareImage,
            width: 1200,
            height: 630,
            alt: `Gradus Agency Case Study — ${project.client}`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [shareImage],
      },
    };
  } catch (error) {
    console.error("[generateMetadata] Error parsing project metadata:", error);
    return { 
      title: "Project Showcase | Gradus", 
      description: "Discover our creative design and digital marketing case studies at Gradus." 
    };
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  let project = null;
  let allProjects = [];
  const baseUrl = SITE_URL.endsWith("/") ? SITE_URL.slice(0, -1) : SITE_URL;

  try {
    const { id } = await params;
    const decodedId = decodeURIComponent(id).toLowerCase();
    
    // Fetch dynamic project page content
    allProjects = await getRestProjects();
    
    // DB offline/empty fallback
    if (allProjects.length === 0) allProjects = fallbackProjects;
    
    const findProject = (list: any[], searchId: string) => {
      const cleanId = searchId.toLowerCase();
      return list.find((p) => p.id.toLowerCase() === cleanId) || 
             list.find((p) => cleanId.startsWith(p.id.toLowerCase() + "-"));
    };
    project = findProject(allProjects, decodedId);
  } catch (error) {
    console.error("Error loading project content in page.tsx:", error);
  }

  if (!project) {
    notFound();
  }

  // Schema.org CaseStudy/CreativeWork & BreadcrumbList JSON-LD
  const projectSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${baseUrl}/projects/${project.id}/#creativework`,
        "name": `${project.client} · Case Study`,
        "headline": project.seo_title || `Projet ${project.client} · ${project.category} Casablanca | Gradus Agency`,
        "description": project.seo_description || project.description,
        "image": project.coverImage || `${baseUrl}/assets/og-image.png`,
        "genre": project.category,
        "keywords": [project.category, ...(project.tags || []), "case study", "Gradus Agency"].join(", "),
        "creator": {
          "@type": "Organization",
          "@id": `${baseUrl}/#organization`
        },
        "publisher": {
          "@type": "Organization",
          "@id": `${baseUrl}/#organization`
        },
        "datePublished": project.year ? `${project.year}-01-01` : "2024-01-01"
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${baseUrl}/projects/${project.id}/#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": baseUrl
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Projects",
            "item": `${baseUrl}/#portfolio`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": project.client,
            "item": `${baseUrl}/projects/${project.id}`
          }
        ]
      }
    ]
  };

  return (
    <main className="min-h-screen bg-gradus-primary text-white">
      {/* Inject specific Case Study JSON-LD schema graph */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
      />
      <Navbar />
      <ProjectClient project={project} />
      <Footer projects={allProjects} />
    </main>
  );
}
