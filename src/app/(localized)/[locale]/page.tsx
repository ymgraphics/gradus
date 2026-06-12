import Navbar from "@/layouts/Navbar";
import Hero from "@/sections/Hero";
import Marquee from "@/components/Marquee";
import Services from "@/sections/Services";
import Portfolio from "@/sections/Portfolio";
import Stats from "@/sections/Stats";
import Process from "@/sections/Process";
import Team from "@/sections/Team";
import Testimonials from "@/sections/Testimonials";
import Hiring from "@/sections/Hiring";
import Cta from "@/sections/Cta";
import Footer from "@/layouts/Footer";
import StepWitness from "@/components/StepWitness";

import type { Job, TeamMember, Feedback, Partner } from "@/lib/firebase-rest";
import { Project, defaultProjects, SITE_URL } from "@/lib/constants";
import { Metadata } from "next";
import { getRestJobs, getRestTeamMembers, getRestFeedbacks, getRestPartners, getRestProjects } from "@/lib/firebase-rest";

export const revalidate = 300; // Cache the home page at the edge for 5 minutes (ISR)


export default async function Home() {
  const baseUrl = SITE_URL.endsWith("/") ? SITE_URL.slice(0, -1) : SITE_URL;

  let projects: Project[] = defaultProjects;
  let jobs: Job[] = [];
  let teamMembers: TeamMember[] = [];
  let feedbacks: Feedback[] = [];
  let partners: Partner[] = [];

  try {
    // Direct REST queries inside Server Component for ultra-fast load time
    const [jobsData, teamData, feedbacksData, partnersData, projectsData] = await Promise.all([
      getRestJobs(),
      getRestTeamMembers(),
      getRestFeedbacks(),
      getRestPartners(),
      getRestProjects(),
    ]);

    if (projectsData && projectsData.length > 0) projects = projectsData;
    if (jobsData) jobs = jobsData;
    if (teamData) teamMembers = teamData;
    if (feedbacksData) feedbacks = feedbacksData;
    if (partnersData) partners = partnersData;
  } catch (error) {
    console.error("Error fetching data for home page:", error);
  }

  // Dynamic Schema.org Graph binding brand signals together
  const globalSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        "name": "Gradus Agency",
        "url": baseUrl,
        "logo": `${baseUrl}/assets/logo.png`,
        "sameAs": [
          "https://www.instagram.com/gradus.agency",
          "https://www.linkedin.com/company/gradus-agency"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+212691404005",
          "contactType": "sales",
          "areaServed": "MA",
          "availableLanguage": ["French", "Arabic", "English"]
        }
      },
      {
        "@type": "LocalBusiness",
        "@id": `${baseUrl}/#localbusiness`,
        "name": "Gradus Agency",
        "image": `${baseUrl}/assets/og-image.png`,
        "telephone": "+212691404005",
        "email": "contact@gradus.ma",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "217 Bd Brahim Roudani",
          "addressLocality": "Casablanca",
          "postalCode": "20000",
          "addressCountry": "MA"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "33.5898",
          "longitude": "-7.6039"
        },
        "url": baseUrl,
        "priceRange": "$$"
      }
    ]
  };

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(globalSchema) }}
      />
      <Navbar />
      <StepWitness />
      <Hero />
      <Marquee partners={partners} />
      <Services />
      <Portfolio projects={projects} />

      <Stats />
      <Process />
      <Testimonials feedbacks={feedbacks} />
      <Team teamMembers={teamMembers} />
      <Hiring jobs={jobs} />
      <Cta />
      <Footer projects={projects} />
    </main>
  );
}
