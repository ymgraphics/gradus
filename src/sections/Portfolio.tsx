"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Project, defaultProjects } from "@/lib/constants";

/** Export of the fallback list — used by other components */
export const projects: Project[] = defaultProjects;

interface PortfolioProps {
  projects?: Project[];
}

// Editorial rhythm: 7/4 offset pair → full-bleed breaker → indented 4/6 pair
const PATTERN = [
  { cols: "md:col-span-7", aspect: "aspect-[4/3]" },
  { cols: "md:col-span-4 md:col-start-9 md:mt-28", aspect: "aspect-[4/5]" },
  { cols: "md:col-span-12", aspect: "aspect-[16/9] md:aspect-[21/9]", bleed: true },
  { cols: "md:col-span-4 md:col-start-2", aspect: "aspect-[4/5]" },
  { cols: "md:col-span-6 md:col-start-7 md:mt-20", aspect: "aspect-[4/3]" },
];

export default function Portfolio({ projects: projectsProp }: PortfolioProps = {}) {
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
  const projects = projectsProp ?? defaultProjects;
  const { lang } = useLanguage();
  const fr = lang === "fr";
  const filterCategories = [
    { key: "all", label: fr ? "Tous" : "All" },
    { key: "Branding", label: "Branding" },
    { key: "Social Media", label: "Social Media" },
    { key: "Photo & Vidéo", label: fr ? "Photo & Vidéo" : "Photo & Video" },
    { key: "3D", label: "3D" },
    { key: "Print", label: "Print" },
  ];

  const [activeTab, setActiveTab] = useState(filterCategories[0].key);

  const filteredProjects = projects.filter((p) => {
    if (activeTab === "all") return true;
    if (activeTab === "Branding" && (p.category.includes("Branding") || p.id === "the-cloud-identity")) return true;
    if (activeTab === "Social Media" && (p.category.includes("Social Media"))) return true;
    if (activeTab === "Photo & Vidéo" && (p.category.includes("Photo & Vidéo"))) return true;
    if (activeTab === "3D" && (p.category.includes("3D"))) return true;
    if (activeTab === "Print" && (p.category.includes("Print"))) return true;
    return false;
  });

  const isVideoProject = (id: string) => id === "coco-lounge" || id === "manaos";

  return (
    <section id="portfolio" className="section-y bg-void relative">
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="label-utility mb-6 flex items-center gap-3">
            <span className="inline-block w-2 h-2 bg-accent" aria-hidden="true" />
            {fr ? "Travaux" : "Work"}
          </p>
          <h2 className="text-display-lg font-display text-text-primary">
            {fr ? "Travaux Sélectionnés" : "Selected Works"}
          </h2>
        </motion.div>

        {/* Filter index — text, not pills */}
        <div className="flex flex-wrap gap-x-8 gap-y-3 mb-16 md:mb-24 border-b border-gradus-border pb-5">
          {filterCategories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveTab(cat.key)}
              className={`label-utility transition-colors duration-300 interactive ${
                activeTab === cat.key
                  ? "text-accent"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Editorial grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-16 md:gap-y-24 md:gap-x-6 items-start">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, i) => {
              const slot = PATTERN[i % PATTERN.length];
              const hasCover = !!project.coverImage;
              const coverSrc =
                hasCover && (project.coverImage || "").endsWith(".mp4")
                  ? (project.galleryImages && project.galleryImages[0]) || "/assets/placeholder.jpg"
                  : project.coverImage || "/assets/placeholder.jpg";

              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className={`col-span-1 ${slot.cols}`}
                >
                  <Link
                    href={`/projects/${getSeoSlug(project)}`}
                    aria-label={fr ? `Explorer l'étude de cas ${project.client} - ${project.category}` : `Explore case study ${project.client} - ${project.category}`}
                    className="group block interactive"
                  >
                    <div
                      className={`relative overflow-hidden border border-gradus-border bg-surface ${slot.aspect} ${
                        slot.bleed ? "-mx-5 sm:-mx-10 lg:-mx-20 md:border-x-0" : ""
                      }`}
                    >
                      {hasCover ? (
                        <>
                          <Image
                            src={coverSrc}
                            alt={fr ? `Étude de cas ${project.client} · ${project.category} par Gradus Agency Maroc` : `Case study ${project.client} · ${project.category} by Gradus Agency Morocco`}
                            fill
                            sizes={slot.bleed ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                          />
                          {isVideoProject(project.id) && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-16 h-16 md:w-20 md:h-20 border border-white/30 bg-void/40 backdrop-blur-md flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-colors duration-300">
                                <Play className="text-white fill-current w-6 h-6 md:w-8 md:h-8" />
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        // No cover: the client mark on a bare surface, machine-labeled
                        <div className="relative w-full h-full flex flex-col items-center justify-center p-8">
                          <div className="absolute inset-x-6 top-6 flex justify-between label-utility opacity-40">
                            <span>Gradus</span>
                            <span>{project.year}</span>
                          </div>
                          {project.logo ? (
                            <img
                              src={project.logo}
                              alt={`${project.client} logo`}
                              className="object-contain max-w-[45%] max-h-[40%] opacity-70 group-hover:opacity-100 transition-opacity duration-500"
                            />
                          ) : (
                            <span className="text-display-md font-display text-text-primary/70 group-hover:text-text-primary transition-colors duration-500">
                              {project.client.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Caption below the image — the image stays untouched */}
                    <div className="mt-4 flex items-baseline justify-between gap-4">
                      <h3 className="text-heading font-display text-text-primary">
                        {project.client}
                      </h3>
                      <span className="label-utility text-text-secondary whitespace-nowrap">
                        {project.category} — {project.year}
                      </span>
                    </div>
                    <span className="label-utility text-accent mt-2 inline-block opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {fr ? "Voir l'étude de cas" : "View case study"} →
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
