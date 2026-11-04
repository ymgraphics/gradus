"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, X, Maximize2, Volume2, VolumeX } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/i18n/LanguageContext";
import { useDialog } from "@/lib/useDialog";

interface ImmersivePlayerProps {
  videoUrl: string;
  poster?: string;
  clientName: string;
  aspect?: "portrait" | "landscape" | "square";
}

const controlBtn =
  "w-10 h-10 flex items-center justify-center text-text-primary hover:text-accent-text transition-colors focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2";

export default function ImmersivePlayer({ videoUrl, poster, clientName, aspect = "landscape" }: ImmersivePlayerProps) {
  const { lang } = useLanguage();
  const fr = lang === "fr";
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => setIsOpen(false), []);

  // Escape, focus trap + restore, scroll lock (incl. Lenis)
  useDialog({ open: isOpen, containerRef: dialogRef, onClose: close, initialFocusRef: closeRef });

  // Lazy play preview video only when visible in the viewport to save bandwidth and GPU execution cycles
  useEffect(() => {
    const video = previewVideoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(video);
    return () => {
      observer.unobserve(video);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(currentProgress);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const goFullscreen = () => {
    videoRef.current?.requestFullscreen?.().catch(() => {});
  };

  const aspectClass =
    aspect === "portrait" ? "aspect-[9/16]" : aspect === "square" ? "aspect-square" : "aspect-video";

  return (
    <>
      {/* Trigger / Thumbnail */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={fr ? `Regarder la vidéo du projet ${clientName}` : `Watch the ${clientName} project video`}
        className="group block w-full text-left border border-gradus-border p-1.5 hover:border-accent/40 transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
      >
        <span className={`relative block ${aspectClass} overflow-hidden bg-surface`}>
          <video
            ref={previewVideoRef}
            src={videoUrl}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />

          {/* Poster Image Overlay if provided */}
          {poster && (
            <Image
              src={poster}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="absolute inset-0 object-cover opacity-0"
            />
          )}

          <span className="absolute inset-0 flex items-center justify-center">
            <span className="w-16 h-16 md:w-20 md:h-20 border border-white/30 bg-void/40 flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-colors duration-300">
              <Play className="text-text-primary fill-current w-6 h-6 md:w-8 md:h-8" aria-hidden="true" />
            </span>
          </span>
        </span>
        <span className="label-utility mt-3 flex items-center justify-between">
          <span>▸ {fr ? "Cliquer pour regarder" : "Click to watch"}</span>
          <span>{clientName}</span>
        </span>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={fr ? `Vidéo du projet ${clientName}` : `${clientName} project video`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12"
          >
            <div onClick={close} className="absolute inset-0 bg-void/95" aria-hidden="true" />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className={`relative w-full ${aspect === "portrait" ? "max-w-[450px]" : "max-w-7xl"} flex flex-col gap-3`}
            >
              {/* Header */}
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="label-utility mb-2 flex items-center gap-3">
                    <span className="inline-block w-2 h-2 bg-accent" aria-hidden="true" />
                    {fr ? "Vidéo du projet" : "Project Video"}
                  </p>
                  <h3 className="text-heading font-display text-text-primary">{clientName}</h3>
                </div>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={close}
                  aria-label={fr ? "Fermer la vidéo" : "Close video"}
                  className={`${controlBtn} border border-gradus-border hover:border-accent/40`}
                >
                  <X size={20} aria-hidden="true" />
                </button>
              </div>

              <div className={`relative w-full ${aspect === "portrait" ? "aspect-[9/16]" : "aspect-video"} border border-gradus-border p-1.5 bg-void`}>
                <video
                  ref={videoRef}
                  src={videoUrl}
                  autoPlay
                  muted={isMuted}
                  onTimeUpdate={handleTimeUpdate}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onClick={togglePlay}
                  className="w-full h-full object-contain cursor-pointer bg-black"
                />

                {/* Control bar */}
                <div className="absolute bottom-1.5 left-1.5 right-1.5 bg-void/70">
                  <div className="h-px w-full bg-gradus-border" aria-hidden="true">
                    <div className="h-px bg-accent" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="flex items-center justify-between px-2 py-1">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={togglePlay}
                        aria-label={isPlaying ? (fr ? "Pause" : "Pause") : (fr ? "Lecture" : "Play")}
                        className={controlBtn}
                      >
                        {isPlaying ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
                      </button>
                      <button
                        type="button"
                        onClick={toggleMute}
                        aria-label={isMuted ? (fr ? "Activer le son" : "Unmute") : (fr ? "Couper le son" : "Mute")}
                        aria-pressed={!isMuted}
                        className={controlBtn}
                      >
                        {isMuted ? <VolumeX size={18} aria-hidden="true" /> : <Volume2 size={18} aria-hidden="true" />}
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="label-utility hidden sm:block" aria-live="polite">
                        {isPlaying ? (fr ? "Lecture" : "Playing") : (fr ? "En pause" : "Paused")}
                      </span>
                      <button
                        type="button"
                        onClick={goFullscreen}
                        aria-label={fr ? "Plein écran" : "Fullscreen"}
                        className={controlBtn}
                      >
                        <Maximize2 size={18} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
