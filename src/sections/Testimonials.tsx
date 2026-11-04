"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Pause, Play, Star } from "lucide-react";
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
    <section className="section-y bg-transparent relative overflow-hidden">
      <div className="container mb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-display-lg font-display text-text-primary mb-6">
            {lang === "fr" ? "La Voix de Nos " : "The Voice of Our "}
            <span className="text-accent">
              {lang === "fr" ? "Partenaires." : "Partners."}
            </span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg leading-relaxed font-light">
            {lang === "fr"
              ? "La confiance de nos collaborateurs prestigieux constitue le socle de notre réputation. Découvrez leurs retours d'expérience."
              : "The trust of our prestigious collaborators forms the foundation of our reputation. Discover their feedback."}
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

      <div className="container flex justify-end mb-6">
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          className="testimonials-toggle label-utility inline-flex items-center gap-2 text-text-primary/70 hover:text-text-primary transition-colors"
        >
          {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
          {paused
            ? lang === "fr" ? "Reprendre le défilement" : "Resume scrolling"
            : lang === "fr" ? "Mettre en pause" : "Pause scrolling"}
        </button>
      </div>

      <div className="testimonials-viewport relative flex group">
        <div
          data-paused={paused}
          className="testimonials-track flex gap-6 md:gap-10 px-4"
        >
          {displayFeedbacks.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              // Only the first copy is real content; the others close the loop.
              aria-hidden={idx >= feedbacks.length ? true : undefined}
              className={`${idx >= feedbacks.length ? "testimonials-dupe " : ""}liquid-glass w-[320px] md:w-[450px] lg:w-[550px] flex-shrink-0 rounded-[40px] p-8 md:p-12 hover:border-accent/30 transition-all duration-700 shadow-2xl relative overflow-hidden group/card`}
            >
              <div className="flex gap-2 mb-8">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={`${
                      i < item.rating ? "text-accent fill-accent drop-shadow-[0_0_10px_rgba(96,80,220,0.4)]" : "text-white/5"
                    }`}
                  />
                ))}
              </div>
              
              <blockquote className="text-white/80 text-lg md:text-2xl leading-relaxed mb-12 italic font-light">
                &ldquo;{item.feedback}&rdquo;
              </blockquote>

              <div className="flex items-center gap-5 mt-auto">
                {item.avatarUrl && (
                  <div className="w-14 h-14 rounded-full overflow-hidden border border-white/10 shadow-lg relative group-hover/card:scale-105 transition-transform duration-500">
                    <Image
                      src={item.avatarUrl}
                      alt={item.name}
                      fill
                      sizes="56px"
                      className="object-cover grayscale group-hover/card:grayscale-0 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
                  </div>
                )}
                <div>
                  <div className="text-white font-bold text-lg mb-0.5">{item.name}</div>
                  <div className="text-accent-text text-[11px] font-mono tracking-widest uppercase">{item.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
