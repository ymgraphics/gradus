"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, Maximize2, Volume2, VolumeX } from "lucide-react";
import Image from "next/image";

interface ImmersivePlayerProps {
  videoUrl: string;
  poster?: string;
  clientName: string;
  aspect?: "portrait" | "landscape" | "square";
}

export default function ImmersivePlayer({ videoUrl, poster, clientName, aspect = "landscape" }: ImmersivePlayerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);

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
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
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

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      {/* Trigger / Thumbnail */}
      <div 
        onClick={() => setIsOpen(true)}
        className={`relative ${aspect === 'portrait' ? 'aspect-[9/16]' : aspect === 'square' ? 'aspect-square' : 'aspect-video'} rounded-[32px] overflow-hidden cursor-pointer group bg-black/20`}
      >
        <video 
          ref={previewVideoRef}
          src={videoUrl}
          muted
          loop
          playsInline
          preload="metadata"
          className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-105"
        />
        
        {/* Poster Image Overlay if provided */}
        {poster && (
          <Image
            src={poster}
            alt={clientName}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="absolute inset-0 object-cover opacity-0 group-hover:opacity-0 transition-opacity"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-all duration-500 shadow-2xl"
          >
            <Play size={32} className="text-white group-hover:text-gradus-primary fill-current translate-x-1" />
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
           <span className="text-white font-mono text-[10px] tracking-[0.3em] uppercase bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
             Cliquer pour regarder
           </span>
        </div>
      </div>

      {/* Cinematic Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12"
          >
            {/* Liquid Glass Backdrop */}
            <motion.div 
              initial={{ backdropFilter: "blur(0px)" }}
              animate={{ backdropFilter: "blur(40px)" }}
              exit={{ backdropFilter: "blur(0px)" }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/80"
            />

            {/* Video Container */}
            <motion.div
              layoutId={`video-${videoUrl}`}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`relative w-full ${aspect === 'portrait' ? 'max-w-[450px] aspect-[9/16]' : 'max-w-7xl aspect-video'} rounded-[40px] overflow-hidden shadow-[0_0_100px_rgba(96,80,220,0.15)] border border-white/10 bg-black`}
            >
              <video
                ref={videoRef}
                src={videoUrl}
                autoPlay
                muted={isMuted}
                onTimeUpdate={handleTimeUpdate}
                onClick={togglePlay}
                className="w-full h-full object-contain cursor-pointer"
              />

              {/* Floating Header */}
              <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
                <div className="flex flex-col">
                  <span className="text-accent font-mono text-[10px] tracking-[0.3em] uppercase mb-1">Project Video</span>
                  <h3 className="text-white text-xl font-heading font-bold">{clientName}</h3>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="pointer-events-auto w-12 h-12 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:scale-110 transition-all duration-300"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Floating Control Deck */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-3xl px-8 flex flex-col gap-4">
                {/* Progress Bar */}
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden backdrop-blur-md cursor-pointer group/progress">
                   <motion.div 
                     className="h-full bg-accent shadow-[0_0_15px_rgba(96,80,220,0.5)]"
                     style={{ width: `${progress}%` }}
                   />
                </div>

                <div className="flex items-center justify-between px-4 py-3 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl">
                  <div className="flex items-center gap-6">
                    <button onClick={togglePlay} className="text-white hover:text-accent transition-colors">
                      {isPlaying ? <Play className="fill-current" /> : <Play />}
                    </button>
                    <button onClick={toggleMute} className="text-white hover:text-accent transition-colors">
                      {isMuted ? <VolumeX /> : <Volume2 />}
                    </button>
                  </div>

                  <div className="flex items-center gap-6">
                    <span className="text-white/40 font-mono text-[10px] tracking-widest hidden sm:block">
                      {isPlaying ? "PLAYING CINEMATIC" : "PAUSED"}
                    </span>
                    <button className="text-white hover:text-accent transition-colors">
                      <Maximize2 size={20} />
                    </button>
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
