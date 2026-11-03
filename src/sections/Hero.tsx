"use client";

import { useEffect, useRef, useState } from "react";
import { motion, Variants, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Pause, Play } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const SHOWREEL_MP4 =
  "https://res.cloudinary.com/dxnjje6pf/video/upload/q_auto/f_auto/v1779352523/Gradus_Think_out_of_the_box_prob4_tvmddu.mp4";
const SHOWREEL_POSTER =
  "https://res.cloudinary.com/dxnjje6pf/video/upload/so_0,q_auto,f_jpg,w_960/v1779352523/Gradus_Think_out_of_the_box_prob4_tvmddu.jpg";

export default function Hero() {
  const { t, lang } = useLanguage();
  const reduced = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  // Autoplay only when the visitor hasn't asked for reduced motion. Starting
  // playback here (not via the autoPlay attribute) means it never begins
  // before we know the preference.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduced === null) return;
    if (reduced) {
      video.pause();
    } else {
      video.play().catch(() => {});
    }
  }, [reduced]);

  const toggleVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  const lines = [t("hero.title1"), t("hero.title2"), t("hero.title3")];

  // Each headline line rises from behind its own baseline — the staircase builds step by step
  const lineVariants: Variants = {
    hidden: { y: reduced ? 0 : "110%", opacity: reduced ? 0 : 1 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: { delay: 0.15 + i * 0.14, duration: 0.9, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  const fade: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : 16 },
    visible: (d: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: d, duration: 0.7, ease: "easeOut" },
    }),
  };

  // Staircase: each line indents one step further (half-steps on mobile)
  const indents = ["", "ml-[4%] md:ml-[8.333%]", "ml-[8%] md:ml-[16.666%]"];

  return (
    <section className="relative min-h-screen flex flex-col justify-center bg-void pt-28 pb-14 overflow-hidden">
      <div className="container w-full">
        <motion.p
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fade}
          className="label-utility mb-10 flex items-center gap-3"
        >
          <span className="inline-block w-2 h-2 bg-accent" aria-hidden="true" />
          {lang === "fr" ? "Studio créatif — Casablanca, MA" : "Creative studio — Casablanca, MA"}
        </motion.p>

        <h1 className="font-display flex flex-col">
          {lines.map((line, i) => (
            <div key={i} className={`overflow-hidden ${indents[i]}`}>
              <motion.span
                custom={i}
                initial="hidden"
                animate="visible"
                variants={lineVariants}
                className={`block text-display-xl ${i === 2 ? "text-accent" : "text-text-primary"}`}
              >
                {line}
              </motion.span>
            </div>
          ))}
        </h1>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-6 flex flex-col items-start gap-10">
            <motion.p
              custom={1.0}
              initial="hidden"
              animate="visible"
              variants={fade}
              className="text-body text-text-secondary max-w-[420px]"
            >
              {t("hero.tagline")}
            </motion.p>

            <motion.div custom={1.15} initial="hidden" animate="visible" variants={fade}>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-4 border border-accent px-8 py-4 label-utility text-text-primary hover:bg-accent hover:text-void transition-colors duration-300 interactive"
              >
                {t("hero.cta")}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>
          </div>

          {/* The reel is a framed object you choose to watch — not wallpaper */}
          <motion.div
            custom={1.3}
            initial="hidden"
            animate="visible"
            variants={fade}
            className="lg:col-span-4 lg:col-start-9"
          >
            <div className="relative border border-gradus-border p-1.5">
              <video
                ref={videoRef}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                loop
                muted
                playsInline
                preload="metadata"
                poster={SHOWREEL_POSTER}
                className="w-full aspect-video object-cover"
                aria-label={lang === "fr" ? "Showreel Gradus" : "Gradus showreel"}
              >
                <source src={SHOWREEL_MP4} type="video/mp4" />
              </video>
              <button
                type="button"
                onClick={toggleVideo}
                aria-label={
                  playing
                    ? lang === "fr" ? "Mettre le showreel en pause" : "Pause showreel"
                    : lang === "fr" ? "Lire le showreel" : "Play showreel"
                }
                className="absolute bottom-4 right-4 w-10 h-10 flex items-center justify-center border border-white/30 bg-void/60 backdrop-blur-md text-text-primary hover:bg-accent hover:border-accent transition-colors duration-300"
              >
                {playing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
              </button>
            </div>
            <p className="label-utility mt-3 flex items-center justify-between">
              <span>▸ Showreel ’26</span>
              <span>Gradus®</span>
            </p>
          </motion.div>
        </div>

        <motion.div custom={1.5} initial="hidden" animate="visible" variants={fade} className="mt-16">
          <div className="step-rule" style={{ "--step-at": "22%" } as React.CSSProperties} />
          <div className="mt-4 flex items-center justify-between label-utility">
            <span>contact@gradus.ma</span>
            <span>33.57°N — 7.58°W</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
