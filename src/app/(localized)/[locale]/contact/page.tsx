import Navbar from "@/layouts/Navbar";
import Footer from "@/layouts/Footer";
import ContactContent from "./ContactContent";
import { getRestProjects } from "@/lib/firebase-rest";
import { Project, defaultProjects, SITE_URL } from "@/lib/constants";
import { Metadata } from "next";
import { getDictionary } from "@/i18n/getDictionary";
import type { Locale } from "@/i18n-config";



export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const dict = await getDictionary(locale);
  return {
    title: dict.seo.contact.title,
    description: dict.seo.contact.description,
    alternates: {
      canonical: `${locale === "fr" ? "" : "/" + locale}/contact`,
    },
  };
}

export default async function ContactPage() {
  const baseUrl = SITE_URL.endsWith("/") ? SITE_URL.slice(0, -1) : SITE_URL;
  let projects: Project[] = defaultProjects;
  try {
    const dbProjects = await getRestProjects();
    if (dbProjects && dbProjects.length > 0) projects = dbProjects;
  } catch (error) {
    console.error("Error fetching projects for contact page:", error);
  }

  const contactSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${baseUrl}/contact/#breadcrumb`,
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
            "name": "Contact",
            "item": `${baseUrl}/contact`
          }
        ]
      }
    ]
  };

  return (
    <main className="min-h-screen bg-gradus-primary flex flex-col pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <Navbar />
      <ContactContent />
      <Footer projects={projects} />
    </main>
  );
}
