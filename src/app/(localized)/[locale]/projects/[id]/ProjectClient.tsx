"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight, Share2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Project } from "@/lib/constants";
import ImmersivePlayer from "@/components/ImmersivePlayer";
import { useRef, useMemo } from "react";
import { useLanguage } from "@/i18n/LanguageContext";

interface ProjectClientProps {
  project: Project;
}

// Media Item with orientation detection for layout
interface MediaItem {
  id: string;
  url: string;
  type: "video" | "image";
  aspect: "portrait" | "landscape" | "square";
}

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="label-utility mb-6 flex items-center gap-3">
      <span className="inline-block w-2 h-2 bg-accent" aria-hidden="true" />
      {children}
    </p>
  );
}

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

// Fallback when there is no cover: the client mark on a bare surface, machine-labeled
function CoverFallback({ client, year, logo, small = false }: { client: string; year: string | number; logo?: string; small?: boolean }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface p-8">
      <div className="absolute inset-x-6 top-6 flex justify-between label-utility">
        <span>Gradus</span>
        <span>{year}</span>
      </div>
      {logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logo} alt={client} className={`${small ? "h-12 md:h-16" : "h-16 md:h-24"} object-contain opacity-80`} />
      ) : (
        <span className="text-display-md font-display text-text-primary/70">{initials(client)}</span>
      )}
      {!small && (
        <span className="label-utility mt-6 text-center">Creative Direction & Strategy Campaign</span>
      )}
    </div>
  );
}

export default function ProjectClient({ project }: ProjectClientProps) {
  const { lang } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  // Content-Aware Media Processing (derived from props; no state needed)
  const processedMedia = useMemo<MediaItem[]>(() => {
    if (project.media?.assets && project.media.assets.length > 0) {
      return project.media.assets.map((a) => ({
        id: a.id,
        url: a.url,
        type: a.type,
        aspect: a.aspect
      }));
    }
    // Legacy Fallback
    return [
      ...(project.videos || []).map((v, i) => ({
        id: `v-${i}`,
        url: v,
        type: "video" as const,
        aspect: v.toLowerCase().includes("reel") || v.toLowerCase().includes("vertical") || v.toLowerCase().includes("tiktok") ? "portrait" as const : "landscape" as const
      })),
      ...(project.galleryImages || []).map((img, i) => ({
        id: `i-${i}`,
        url: img,
        type: "image" as const,
        aspect: "portrait" as const
      }))
    ];
  }, [project]);

  const logo = project.logo || project.media?.logo;

  return (
    <div ref={containerRef} className="relative bg-void text-text-primary">

      {/* 1. HERO */}
      <section className="relative pt-36 pb-16 md:pt-48 md:pb-24">
        <motion.div style={{ opacity }} className="container">
          <div className="flex items-start gap-6 md:gap-10 mb-10">
            <motion.div
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="w-20 h-20 md:w-28 md:h-28 shrink-0 relative flex items-center justify-center border border-gradus-border bg-surface p-4"
            >
              {project.media?.logo ? (
                <div className="relative w-full h-full">
                  <Image src={project.media.logo} alt={project.client} fill className="object-contain" />
                </div>
              ) : (
                <span className="text-display-md font-display text-text-primary">
                  {project.client.charAt(0)}
                </span>
              )}
            </motion.div>

            <motion.div
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="pt-2"
            >
              <Eyebrow>{project.industry || project.category}</Eyebrow>
            </motion.div>
          </div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-display-xl font-display text-text-primary mb-12"
          >
            {project.client}
          </motion.h1>

          {/* Metadata */}
          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 border-t border-gradus-border md:ml-[8.333%]"
          >
            <div className="py-4 pr-4 border-b border-gradus-border">
              <dt className="label-utility mb-2">Location</dt>
              <dd className="text-caption text-text-primary">Casablanca</dd>
            </div>
            <div className="py-4 pr-4 border-b border-gradus-border">
              <dt className="label-utility mb-2">Year</dt>
              <dd className="text-caption text-text-primary">{project.year}</dd>
            </div>
          </motion.dl>

          {/* Featured cover */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
            className="mt-16"
          >
            <div className="border border-gradus-border p-1.5">
              <div className="relative w-full aspect-video md:aspect-[21/9] overflow-hidden bg-surface">
                {project.coverImage ? (
                  <Image
                    src={project.coverImage}
                    alt={project.client}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <CoverFallback client={project.client} year={project.year} logo={logo} />
                )}
              </div>
            </div>
            <p className="label-utility mt-3 flex items-center justify-between">
              <span>▸ Campaign Overview</span>
              <span>{project.category}</span>
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* 2. THE BRIEF */}
      <section className="section-y border-t border-gradus-border">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-6">
            <motion.div {...fadeUp} className="lg:col-span-7">
              <h2 className="text-display-md font-display text-text-primary mb-10">
                Transformer l&apos;essence de <span className="text-accent">{project.client}</span> en une expérience digitale immersive.
              </h2>
              <p className="text-body text-text-secondary max-w-2xl mb-10">
                {project.description}
              </p>
              <ul className="flex flex-wrap gap-3">
                {project.tags.map((tag) => (
                  <li key={tag} className="border border-gradus-border px-3 py-1 label-utility">
                    {tag}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div {...fadeUp} transition={{ delay: 0.15 }} className="lg:col-span-4 lg:col-start-9 lg:mt-24 border-t border-gradus-border pt-8">
              <Eyebrow>Campaign Impact</Eyebrow>
              <h3 className="text-heading font-display text-text-primary mb-4">Performance.</h3>
              <p className="text-caption text-text-secondary">
                {project.results || "Une présence social media redéfinie pour capturer l'attention d'une audience premium."}
              </p>

              <dl className="grid grid-cols-2 mt-10 border-t border-gradus-border">
                <div className="py-4 pr-4">
                  <dt className="label-utility mb-2">Status</dt>
                  <dd className="text-caption text-text-primary flex items-center gap-2">
                    <span className="inline-block w-1.5 h-1.5 bg-accent" aria-hidden="true" />
                    Live
                  </dd>
                </div>
                <div className="py-4 pr-4">
                  <dt className="label-utility mb-2">Launch</dt>
                  <dd className="text-caption text-text-primary">{project.year}</dd>
                </div>
              </dl>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. MEDIA */}
      <section className="section-y border-t border-gradus-border">
        <div className="container">
          <motion.div {...fadeUp} className="mb-16 md:mb-24">
            <Eyebrow>Curated Assets</Eyebrow>
          </motion.div>

          <div className="columns-1 md:columns-2 gap-6 space-y-6">
            {processedMedia.map((item, idx) => (
              <motion.div
                key={item.id}
                {...fadeUp}
                transition={{ duration: 0.6, delay: (idx % 2) * 0.1 }}
                className="break-inside-avoid"
              >
                {item.type === "video" ? (
                  <ImmersivePlayer videoUrl={item.url} clientName={project.client} aspect={item.aspect} />
                ) : (
                  <div className="border border-gradus-border p-1.5">
                    <Image
                      src={item.url}
                      alt={lang === "fr" ? `Réalisation ${project.client} · ${project.category} à Casablanca, Maroc` : `Case Study Campaign ${project.client} · ${project.category} in Casablanca, Morocco`}
                      width={800}
                      height={1000}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="w-full h-auto object-contain"
                      style={{ width: "100%", height: "auto" }}
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Challenge / solution */}
          {(project.challenge || project.solution) && (
            <motion.div {...fadeUp} className="mt-32 pt-24 border-t border-gradus-border">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-6 items-start">
                <div className="lg:col-span-6">
                  <Eyebrow>The Narrative</Eyebrow>
                  <h3 className="text-display-md font-display text-text-primary mb-8">
                    Résoudre le <span className="text-accent">Challenge</span> créatif.
                  </h3>
                  <p className="text-body text-text-secondary mb-10">
                    {project.challenge}
                  </p>
                  {project.solution && (
                    <blockquote className="border-l border-accent pl-6 text-body text-text-primary">
                      &ldquo;{project.solution}&rdquo;
                    </blockquote>
                  )}
                </div>
                <div className="lg:col-span-5 lg:col-start-8 lg:mt-24">
                  <div className="border border-gradus-border p-1.5">
                    <div className="relative aspect-square overflow-hidden bg-surface">
                      {project.coverImage ? (
                        <Image src={project.coverImage} alt="Detail view" fill className="object-cover" />
                      ) : (
                        <CoverFallback client={project.client} year={project.year} logo={logo} small />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* 4. NAVIGATION */}
      <section className="section-y border-t border-gradus-border">
        <div className="container">
          <motion.div {...fadeUp}>
            <Eyebrow>Discover More</Eyebrow>
            <Link href="/#portfolio" className="group inline-flex items-baseline gap-4 interactive">
              <span className="text-display-xl font-display text-text-secondary group-hover:text-text-primary transition-colors duration-500">
                Portfolio.
              </span>
              <ArrowUpRight className="w-8 h-8 md:w-12 md:h-12 self-center text-text-secondary group-hover:text-accent transition-colors duration-300" aria-hidden="true" />
            </Link>

            <div className="mt-16 md:ml-[8.333%] flex flex-col sm:flex-row items-start sm:items-center gap-10">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-4 border border-accent px-8 py-4 label-utility text-text-primary hover:bg-accent hover:text-text-primary transition-colors duration-300 interactive"
              >
                Start Project
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true" />
              </Link>
              <button
                type="button"
                className="link-underline label-utility text-text-secondary hover:text-text-primary transition-colors inline-flex items-center gap-3 interactive"
                onClick={() => navigator.share?.({ title: project.client, url: window.location.href })}
              >
                <Share2 size={14} aria-hidden="true" />
                Share Campaign
              </button>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
