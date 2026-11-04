"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import type { Feedback } from "@/lib/firebase-rest";
import { useLanguage } from "@/i18n/LanguageContext";
import Image from "next/image";

interface TestimonialsProps {
  feedbacks: Feedback[];
}

export default function Testimonials({ feedbacks }: TestimonialsProps) {
  const { lang } = useLanguage();
  const [paused, setPaused] = useState(false);
  if (feedbacks.length === 0) return null;

  // Duplicate items for infinite scroll effect
  const displayFeedbacks = [...feedbacks, ...feedbacks, ...feedbacks];

  return (
    <section className="section-y bg-void relative overflow-hidden border-t border-gradus-border">
      <div className="container mb-16 md:mb-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end"
        >
          <div className="lg:col-span-8">
            <p className="label-utility mb-6 flex items-center gap-3">
              <span className="inline-block w-2 h-2 bg-accent" aria-hidden="true" />
              {lang === "fr" ? "Témoignages" : "Testimonials"}
            </p>
            <h2 className="text-display-lg font-display text-text-primary">
              {lang === "fr" ? "La voix de nos " : "The voice of our "}
              <span className="text-accent">
                {lang === "fr" ? "partenaires." : "partners."}
              </span>
            </h2>
          </div>
          <p className="lg:col-span-4 text-body text-text-secondary">
            {lang === "fr"
              ? "La confiance de nos collaborateurs constitue le socle de notre réputation. Découvrez leurs retours d'expérience."
              : "The trust of our collaborators is the foundation of our reputation. Here is what they say."}
          </p>
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes testimonialsScroll {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-33.333%, 0, 0); }
        }
        .testimonials-track {
          animation: testimonialsScroll 50s linear infinite;
        }
        .testimonials-track[data-paused="true"],
        .testimonials-track:hover,
        .testimonials-track:focus-within {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .testimonials-track { animation: none; }
          .testimonials-viewport { overflow-x: auto; }
          .testimonials-dupe, .testimonials-toggle { display: none; }
        }
      `}} />

      <div className="container flex justify-end mb-8">
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          className="testimonials-toggle link-underline label-utility inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
        >
          {paused ? <Play size={12} aria-hidden="true" /> : <Pause size={12} aria-hidden="true" />}
          {paused
            ? lang === "fr" ? "Reprendre le défilement" : "Resume scrolling"
            : lang === "fr" ? "Mettre en pause" : "Pause scrolling"}
        </button>
      </div>

      <div className="testimonials-viewport relative flex">
        <div
          data-paused={paused}
          className="testimonials-track flex items-start gap-6 md:gap-10 px-5 sm:px-10 lg:px-20"
        >
          {displayFeedbacks.map((item, idx) => (
            <figure
              key={`${item.id}-${idx}`}
              // Only the first copy is real content; the others close the loop.
              aria-hidden={idx >= feedbacks.length ? true : undefined}
              // Alternate cards sit one step lower: the staircase, sideways.
              className={`${idx >= feedbacks.length ? "testimonials-dupe " : ""}w-[300px] md:w-[420px] lg:w-[480px] shrink-0 flex flex-col border-t border-gradus-border pt-8 ${idx % 2 === 1 ? "md:mt-12" : ""}`}
            >
              <div className="flex items-center justify-between mb-8">
                <span className="label-utility">
                  {String((idx % feedbacks.length) + 1).padStart(2, "0")}
                </span>
                <span className="flex gap-1" aria-hidden="true">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`inline-block w-2 h-2 ${i < item.rating ? "bg-accent" : "bg-white/10"}`}
                    />
                  ))}
                </span>
                <span className="sr-only">
                  {lang === "fr" ? `Note : ${item.rating} sur 5` : `Rating: ${item.rating} out of 5`}
                </span>
              </div>

              <blockquote className="text-heading font-display text-text-primary mb-10">
                &ldquo;{item.feedback}&rdquo;
              </blockquote>

              <figcaption className="flex items-center gap-4 mt-auto">
                {item.avatarUrl && (
                  <div className="w-12 h-12 shrink-0 border border-gradus-border p-0.5">
                    <div className="relative w-full h-full overflow-hidden">
                      <Image
                        src={item.avatarUrl}
                        alt=""
                        fill
                        sizes="48px"
                        className="object-cover grayscale"
                      />
                    </div>
                  </div>
                )}
                <div>
                  <div className="text-caption text-text-primary">{item.name}</div>
                  <div className="label-utility mt-1">{item.title}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
