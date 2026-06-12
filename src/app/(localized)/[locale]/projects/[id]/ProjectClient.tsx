"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, Share2, Award, TrendingUp, Target, Plus, Play, Info } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Project } from "@/lib/constants";
import ImmersivePlayer from "@/components/ImmersivePlayer";
import { useRef, useState, useEffect } from "react";
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

export default function ProjectClient({ project }: ProjectClientProps) {
  const { lang } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [processedMedia, setProcessedMedia] = useState<MediaItem[]>([]);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.1], [1, 0.95]);

  // Content-Aware Media Processing
  useEffect(() => {
    if (project.media?.assets && project.media.assets.length > 0) {
      const media: MediaItem[] = project.media.assets.map((a) => ({
        id: a.id,
        url: a.url,
        type: a.type,
        aspect: a.aspect
      }));
      setProcessedMedia(media);
    } else {
      // Legacy Fallback
      const media: MediaItem[] = [
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
      setProcessedMedia(media);
    }
  }, [project]);

  return (
    <div ref={containerRef} className="relative bg-[#080808] text-white selection:bg-gradus-gold selection:text-black">
      
      {/* 1. ADAPTIVE EDITORIAL HERO */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-12 overflow-hidden">
        <motion.div 
          style={{ opacity, scale }}
          className="container max-w-7xl px-6 relative z-10"
        >
          {/* Client Identity Header */}
          <div className="flex flex-col items-center mb-16">
             <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-24 h-24 md:w-32 md:h-32 mb-8 relative flex items-center justify-center bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl overflow-hidden p-6"
             >
                {project.media?.logo ? (
                   <div className="relative w-full h-full">
                      <Image 
                         src={project.media.logo} 
                         alt={project.client} 
                         fill 
                         className="object-contain"
                      />
                   </div>
                ) : (
                   <span className="text-4xl font-heading font-bold text-gradus-gold">
                      {project.client.charAt(0)}
                   </span>
                )}
                {/* Subtle Glow */}
                <div className="absolute inset-0 bg-gradus-gold/5 blur-3xl rounded-full" />
             </motion.div>
             
             <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-center"
             >
                <motion.span 
                  initial={{ opacity: 0, letterSpacing: "0.2em" }}
                  animate={{ opacity: 1, letterSpacing: "0.6em" }}
                  className="text-gradus-gold font-mono text-[8px] md:text-[10px] uppercase font-bold mb-8 block"
                >
                   {project.industry || project.category}
                </motion.span>
                
                <h1 className="text-6xl md:text-[10vw] font-heading font-bold tracking-normal leading-[0.85] mb-12">
                   {project.client}
                </h1>

                <div className="flex items-center justify-center gap-12 opacity-40">
                   <div className="flex flex-col items-center">
                      <span className="text-[8px] font-mono uppercase tracking-widest mb-1 text-white/50">Location</span>
                      <span className="text-[10px] font-mono font-bold tracking-[0.2em]">Casablanca</span>
                   </div>
                   <div className="w-[1px] h-8 bg-white/20" />
                   <div className="flex flex-col items-center">
                      <span className="text-[8px] font-mono uppercase tracking-widest mb-1 text-white/50">Year</span>
                      <span className="text-[10px] font-mono font-bold tracking-[0.2em]">{project.year}</span>
                   </div>
                </div>
             </motion.div>
          </div>

          {/* Featured Cover - Respects aspect ratio */}
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="relative w-full aspect-video md:aspect-[21/9] rounded-[40px] overflow-hidden group shadow-2xl border border-white/10"
          >
             {project.coverImage ? (
                <Image
                  src={project.coverImage}
                  alt={project.client}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  priority
                />
             ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#12100e] via-[#090807] to-[#040404] p-8 overflow-hidden">
                   {/* Glowing sphere */}
                   <div className="absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full bg-gradus-gold/[0.04] blur-[120px]" />
                   
                   <div className="relative z-10 flex flex-col items-center gap-4 text-center">
                      {project.logo || project.media?.logo ? (
                         <div className="px-8 py-6 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-xl">
                            <img src={project.logo || project.media?.logo} alt={project.client} className="h-16 md:h-24 object-contain opacity-70" />
                         </div>
                      ) : (
                         <span className="text-7xl md:text-9xl font-display font-light italic text-transparent bg-clip-text bg-gradient-to-r from-gradus-gold via-white to-white/70">
                            {project.client.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                         </span>
                      )}
                      <span className="font-mono text-[9px] md:text-[11px] tracking-[0.4em] uppercase text-white/40 mt-4">
                         Creative Direction & Strategy Campaign
                      </span>
                   </div>
                </div>
             )}
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
             
             <div className="absolute bottom-10 left-10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                   <Plus size={20} className="text-white" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/60">Campaign Overview</span>
             </div>
          </motion.div>
        </motion.div>

        {/* Ambient Glows */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-30">
           <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-gradus-gold/10 blur-[150px] rounded-full" />
           <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 blur-[120px] rounded-full" />
        </div>
      </section>

      {/* 2. THE ART DIRECTION BRIEF */}
      <section className="py-32 md:py-48 border-t border-white/5 relative z-10">
        <div className="container max-w-7xl px-6">
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
              
              <div className="lg:col-span-7">
                 <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                 >
                    <h2 className="text-4xl md:text-6xl font-heading font-medium leading-tight mb-12">
                       Transformer l'essence de <span className="text-gradus-gold">{project.client}</span> en une expérience <span className="italic">digitale immersive.</span>
                    </h2>
                    <div className="flex flex-col gap-10">
                       <p className="text-white/50 text-xl md:text-2xl font-light leading-relaxed max-w-3xl">
                          {project.description}
                       </p>
                       <div className="flex flex-wrap gap-4">
                          {project.tags.map(tag => (
                             <span key={tag} className="px-5 py-2 rounded-full border border-white/10 text-white/40 text-[10px] font-mono uppercase tracking-[0.2em] hover:text-gradus-gold hover:border-gradus-gold transition-colors duration-300">
                                {tag}
                             </span>
                          ))}
                       </div>
                    </div>
                 </motion.div>
              </div>

              <div className="lg:col-span-5 flex flex-col gap-12">
                 <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="p-10 rounded-[40px] bg-white/[0.02] border border-white/5 backdrop-blur-3xl"
                 >
                    <div className="flex items-center gap-4 mb-8 text-gradus-gold">
                       <TrendingUp size={24} />
                       <span className="font-mono text-[10px] tracking-[0.4em] uppercase font-bold">Campaign Impact</span>
                    </div>
                    
                    <div className="space-y-8">
                       <div>
                          <div className="text-4xl font-heading font-bold text-white mb-2">Performance.</div>
                          <p className="text-white/40 text-sm">
                             {project.results || "Une présence social media redéfinie pour capturer l'attention d'une audience premium."}
                          </p>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4 pt-8 border-t border-white/5">
                          <div>
                             <div className="text-gradus-gold text-2xl font-bold">Live</div>
                             <div className="text-[8px] font-mono uppercase tracking-widest text-white/20 mt-1">Status</div>
                          </div>
                          <div>
                             <div className="text-white text-2xl font-bold">{project.year}</div>
                             <div className="text-[8px] font-mono uppercase tracking-widest text-white/20 mt-1">Launch</div>
                          </div>
                       </div>
                    </div>
                 </motion.div>
              </div>
            </div>
         </div>
      </section>

      {/* 3. ADAPTIVE MEDIA SHOWCASE */}
      <section className="pb-32 md:pb-64 relative z-10">
        <div className="container max-w-7xl px-6">
           
           <div className="flex items-center gap-4 mb-20">
              <span className="w-12 h-[1px] bg-gradus-gold/30" />
              <h2 className="text-gradus-gold font-mono text-[10px] tracking-[0.6em] uppercase font-bold">Curated Assets</h2>
           </div>

           <div className="columns-1 md:columns-2 gap-8 space-y-8">
              {processedMedia.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                  className="relative break-inside-avoid overflow-hidden rounded-[40px] border border-white/5 bg-white/[0.02] transition-all duration-700 hover:border-white/20 group"
                >
                  {item.type === "video" ? (
                    <div className="relative w-full h-auto">
                       <ImmersivePlayer videoUrl={item.url} clientName={project.client} aspect={item.aspect} />
                       <div className="absolute top-6 left-6 p-3 rounded-full bg-black/20 backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <Play size={14} className="text-gradus-gold" />
                       </div>
                    </div>
                  ) : (
                    <div className="relative overflow-hidden cursor-zoom-in h-auto">
                       <Image 
                          src={item.url} 
                          alt={lang === "fr" ? `Réalisation ${project.client} · ${project.category} à Casablanca, Maroc` : `Case Study Campaign ${project.client} · ${project.category} in Casablanca, Morocco`}
                          width={800}
                          height={1000}
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="w-full h-auto object-contain transition-transform duration-1000 group-hover:scale-110"
                          style={{ width: "100%", height: "auto" }}
                       />
                       <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all duration-700" />
                    </div>
                  )}
                </motion.div>
              ))}
           </div>

           {/* Deep Dive Breakout */}
           {(project.challenge || project.solution) && (
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mt-48 pt-48 border-t border-white/5"
              >
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <div>
                       <div className="flex items-center gap-4 mb-8 text-gradus-gold">
                          <Info size={20} />
                          <span className="font-mono text-[10px] tracking-[0.4em] uppercase font-bold">The Narrative</span>
                       </div>
                       <h3 className="text-5xl font-heading font-medium leading-tight mb-8">
                          Résoudre le <span className="text-gradus-gold italic">Challenge</span> créatif.
                       </h3>
                       <p className="text-white/60 text-xl leading-relaxed font-light mb-8">
                          {project.challenge}
                       </p>
                       <div className="p-8 rounded-3xl bg-gradus-gold/5 border border-gradus-gold/10">
                          <p className="text-gradus-gold font-medium italic text-lg leading-relaxed">
                             "{project.solution}"
                          </p>
                       </div>
                    </div>
                     <div className="relative aspect-square rounded-[60px] overflow-hidden border border-white/10">
                        {project.coverImage ? (
                           <Image 
                              src={project.coverImage} 
                              alt="Detail view" 
                              fill 
                              className="object-cover opacity-60 transition-transform duration-1000 group-hover:scale-105"
                           />
                        ) : (
                           <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#12100e] via-[#090807] to-[#040404] p-8 overflow-hidden">
                              <div className="absolute w-[200px] h-[200px] rounded-full bg-gradus-gold/[0.04] blur-[80px]" />
                              {project.logo || project.media?.logo ? (
                                 <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-xl">
                                    <img src={project.logo || project.media?.logo} alt={project.client} className="h-12 md:h-16 object-contain opacity-50" />
                                 </div>
                              ) : (
                                 <span className="text-5xl md:text-7xl font-display font-light italic text-transparent bg-clip-text bg-gradient-to-r from-gradus-gold via-white to-white/70">
                                    {project.client.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                                 </span>
                              )}
                           </div>
                        )}
                     </div>
                 </div>
              </motion.div>
           )}
        </div>
      </section>

      {/* 4. EDITORIAL NAVIGATION */}
      <section className="py-48 bg-black border-t border-white/5 relative z-10 overflow-hidden">
        <div className="container max-w-7xl px-6 text-center">
           <motion.div
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
           >
              <span className="text-gradus-gold font-mono text-[10px] tracking-[0.6em] uppercase font-bold mb-12 block">Discover More</span>
              <Link href="/#portfolio" className="group block relative">
                 <h2 className="text-[12vw] md:text-[15vw] font-heading font-bold text-white/5 group-hover:text-white transition-all duration-1000 leading-none tracking-normal">
                    Portfolio.
                 </h2>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-700">
                    <ArrowLeft className="rotate-180 text-gradus-gold" size={100} />
                 </div>
              </Link>

              <div className="mt-32 flex flex-col md:flex-row items-center justify-center gap-12">
                 <Link 
                   href="/contact" 
                   className="px-16 py-7 rounded-full bg-gradus-gold text-black font-bold text-xl hover:scale-105 transition-transform duration-500 shadow-[0_20px_50px_rgba(212,175,55,0.2)]"
                 >
                   Start Project
                 </Link>
                 <button 
                   className="flex items-center gap-4 text-white/30 hover:text-white transition-colors font-mono text-xs uppercase tracking-widest"
                   onClick={() => navigator.share?.({ title: project.client, url: window.location.href })}
                 >
                   <Share2 size={18} />
                   Share Campaign
                 </button>
              </div>
           </motion.div>
        </div>
        
        <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 opacity-[0.02] pointer-events-none select-none">
           <span className="text-[40vw] font-heading font-bold leading-none">GRADUS</span>
        </div>
      </section>

    </div>
  );
}
