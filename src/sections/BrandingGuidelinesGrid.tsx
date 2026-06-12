"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Download, X, ChevronLeft, ChevronRight, Loader2, ExternalLink } from "lucide-react";
import Image from "next/image";
import { BrandingGuideline } from "@/lib/firebase-rest";

interface BrandingGuidelinesGridProps {
  projectId?: string;
}

const MOCK_GUIDELINES: Record<string, BrandingGuideline[]> = {
  "tito": [
    {
      id: "tito-logo",
      title: "Charte Graphique Tito",
      description: "Règles d'utilisation du logotype principal, variations autorisées, zones d'exclusion et déclinaisons chromatiques.",
      thumbnail: "https://gradus.ma/wp-content/uploads/2022/08/MOCKUP-826x900.png",
      pdf_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      category: "Logotype",
      project_id: "tito",
      sort_order: 1
    },
    {
      id: "tito-packaging",
      title: "Normes de Packaging",
      description: "Directives techniques pour l'impression des boîtes à emporter, sacs en papier, emballages de frites et stickers de scellé.",
      thumbnail: "https://gradus.ma/wp-content/uploads/2022/08/SAC-EMPORTER-749x900.png",
      pdf_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      category: "Print",
      project_id: "tito",
      sort_order: 2
    },
    {
      id: "tito-merch",
      title: "Design Uniformes & Textile",
      description: "Spécifications de broderie et sérigraphie pour les tabliers de service, casquettes de cuisine et t-shirts du personnel.",
      thumbnail: "https://gradus.ma/wp-content/uploads/2022/08/tablier-1-900x847.png",
      pdf_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      category: "Merchandising",
      project_id: "tito",
      sort_order: 3
    }
  ],
  "dar-dada": [
    {
      id: "dada-voice",
      title: "Brand Book & Storytelling",
      description: "Ligne éditoriale, ton de voix, et narrations clés autour de l'expérience culinaire et traditionnelle de Dar Dada.",
      thumbnail: "https://gradus.ma/wp-content/uploads/2022/08/BROCHURE-DAR-DADA-900x600.png",
      pdf_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      category: "Narrative",
      project_id: "dar-dada",
      sort_order: 1
    },
    {
      id: "dada-social",
      title: "Social Media Guidelines",
      description: "Grille de publication Instagram, typographies recommandées pour les stories, et formats d'annonce pour le Ramadan.",
      thumbnail: "https://gradus.ma/wp-content/uploads/2022/08/STORY-INSTAGRAM-DARDADA-900x600.png",
      pdf_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      category: "Digital",
      project_id: "dar-dada",
      sort_order: 2
    },
    {
      id: "dada-menu",
      title: "Charte Éditoriale Menu",
      description: "Directives de mise en page pour la carte des boissons et le menu imprimé sur bois, choix des textures et reliures.",
      thumbnail: "https://gradus.ma/wp-content/uploads/2022/08/CARTE-BOISSONS-DARDADA-900x665.png",
      pdf_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      category: "Print",
      project_id: "dar-dada",
      sort_order: 3
    }
  ],
  "corniche": [
    {
      id: "corniche-3d",
      title: "Rendu 3D & Façade",
      description: "Cahier des charges pour les modélisations architecturales de façade, éclairages nocturnes et intégration d'enseignes lumineuses.",
      thumbnail: "https://gradus.ma/wp-content/uploads/2022/08/design-de-facade-corniche-casablanca-900x506.jpg",
      pdf_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      category: "Architecture 3D",
      project_id: "corniche",
      sort_order: 1
    },
    {
      id: "corniche-sign",
      title: "Guide de Signalétique",
      description: "Proportions et matériaux recommandés pour l'enseigne extérieure de l'espace Corniche à Casablanca.",
      thumbnail: "https://gradus.ma/wp-content/uploads/2022/08/rendu-3D-de-facade-conrniche-casablanca-gradus-agency-900x506.jpg",
      pdf_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      category: "Signalétique",
      project_id: "corniche",
      sort_order: 2
    }
  ],
  "louna": [
    {
      id: "louna-motion",
      title: "Social Motion Assets",
      description: "Règles d'animation pour les Reels et vidéos TikTok de Louna — tempos musicaux, styles de transitions et formats de texte.",
      thumbnail: "https://gradus.ma/wp-content/uploads/2022/09/Capture-decran-2023-03-02-a-17.16.43.png",
      pdf_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      category: "Motion Design",
      project_id: "louna",
      sort_order: 1
    },
    {
      id: "louna-photo",
      title: "Moodboard & Style Photo",
      description: "Directives de cadrage pour les shootings culinaires et d'ambiance nocturne, colorimétrie chaude et contrastes prononcés.",
      thumbnail: "https://gradus.ma/wp-content/uploads/2022/09/Capture-decran-2023-03-02-a-17.16.43.png",
      pdf_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      category: "Photographie",
      project_id: "louna",
      sort_order: 2
    }
  ]
};

const DEFAULT_MOCK: BrandingGuideline[] = [
  {
    id: "default-logo",
    title: "Brand Identity Guide",
    description: "Guidelines on corporate identity, logo placement, brand values, and color palettes.",
    thumbnail: "https://gradus.ma/wp-content/uploads/2022/08/MOCKUP-826x900.png",
    pdf_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    category: "Corporate",
    project_id: "",
    sort_order: 1
  },
  {
    id: "default-social",
    title: "Digital Communication rules",
    description: "Asset creation guide for digital media, templates, grid ratios, and typographical guidelines.",
    thumbnail: "https://gradus.ma/wp-content/uploads/2022/08/STORY-INSTAGRAM-DARDADA-900x600.png",
    pdf_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    category: "Marketing",
    project_id: "",
    sort_order: 2
  }
];

export default function BrandingGuidelinesGrid({ projectId = "" }: BrandingGuidelinesGridProps) {
  const [guidelines, setGuidelines] = useState<BrandingGuideline[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGuideline, setSelectedGuideline] = useState<BrandingGuideline | null>(null);
  const [iframeLoading, setIframeLoading] = useState(true);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchGuidelines() {
      try {
        setLoading(true);
        const res = await fetch(`/api/branding-guidelines?projectId=${projectId}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        
        if (Array.isArray(data) && data.length > 0) {
          setGuidelines(data);
        } else {
          // Empty or error: fallback to premium project-specific mocks
          const fallbacks = MOCK_GUIDELINES[projectId] || DEFAULT_MOCK;
          setGuidelines(fallbacks);
        }
      } catch (err) {
        console.error("Error loading guidelines:", err);
        // On network error: fallback to premium project-specific mocks
        const fallbacks = MOCK_GUIDELINES[projectId] || DEFAULT_MOCK;
        setGuidelines(fallbacks);
      } finally {
        setLoading(false);
      }
    }

    if (projectId) {
      fetchGuidelines();
    }
  }, [projectId]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.6;
      scrollContainerRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // If there are no guidelines, hide the section entirely to keep the editorial clean
  if (loading) {
    return (
      <div className="container max-w-7xl px-6 py-12 flex justify-center items-center">
        <Loader2 className="animate-spin text-gradus-gold" size={32} />
      </div>
    );
  }

  if (guidelines.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full overflow-hidden py-12">
      <div className="container max-w-7xl px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="w-12 h-[1px] bg-gradus-gold/30" />
              <span className="text-gradus-gold font-mono text-[10px] tracking-[0.6em] uppercase font-bold">Guidelines</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-medium leading-tight">
              Normes & <span className="italic font-light text-gradus-gold">Branding.</span>
            </h2>
          </div>

          {/* Navigation Buttons */}
          {guidelines.length > 3 && (
            <div className="flex gap-4">
              <button
                onClick={() => scroll("left")}
                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 transition-all duration-300"
                aria-label="Scroll left"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 transition-all duration-300"
                aria-label="Scroll right"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Sliding horizontal container */}
        <div className="relative -mx-6 px-6">
          <div
            ref={scrollContainerRef}
            className="flex gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-8 scroll-smooth"
            style={{ scrollbarWidth: "none" }}
          >
            {guidelines.map((guideline, idx) => (
              <motion.div
                key={guideline.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="snap-start shrink-0 w-[280px] md:w-[360px]"
              >
                <div
                  onClick={() => {
                    setSelectedGuideline(guideline);
                    setIframeLoading(true);
                  }}
                  className="group relative cursor-pointer rounded-[32px] overflow-hidden bg-white/[0.02] border border-white/5 backdrop-blur-md p-6 h-[400px] flex flex-col justify-between transition-all duration-700 hover:border-gradus-gold/30 hover:bg-white/[0.04] hover:-translate-y-2"
                >
                  {/* Subtle decorative grid/glow */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10" />
                  
                  {/* Card Background Image (Thumbnail) */}
                  {guideline.thumbnail ? (
                    <div className="absolute inset-0 z-0 overflow-hidden">
                      <Image
                        src={guideline.thumbnail}
                        alt={guideline.title}
                        fill
                        className="object-cover opacity-20 group-hover:opacity-40 group-hover:scale-105 transition-all duration-1000"
                      />
                    </div>
                  ) : (
                    <div className="absolute inset-0 z-0 bg-gradient-to-tr from-gradus-gold/5 via-transparent to-white/5 opacity-40" />
                  )}

                  {/* Top: Category label & Document badge */}
                  <div className="relative z-20 flex justify-between items-start">
                    <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-mono tracking-[0.2em] uppercase text-white/60">
                      {guideline.category}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-gradus-gold/10 border border-gradus-gold/20 flex items-center justify-center text-gradus-gold">
                      <FileText size={18} />
                    </div>
                  </div>

                  {/* Bottom: Title, Description, and Trigger Action */}
                  <div className="relative z-20 mt-auto">
                    <h3 className="text-xl md:text-2xl font-heading font-medium text-white mb-2 group-hover:text-gradus-gold transition-colors duration-300">
                      {guideline.title}
                    </h3>
                    <p className="text-white/40 text-xs md:text-sm font-light mb-6 line-clamp-2">
                      {guideline.description}
                    </p>
                    
                    <div className="flex items-center gap-2 text-gradus-gold font-mono text-[10px] tracking-[0.2em] uppercase">
                      <span>Consulter PDF</span>
                      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Left/Right Visual Fade Overlays to merge smoothly with background */}
          <div className="absolute top-0 bottom-8 left-0 w-12 bg-gradient-to-r from-[#080808] to-transparent pointer-events-none hidden md:block" />
          <div className="absolute top-0 bottom-8 right-0 w-12 bg-gradient-to-l from-[#080808] to-transparent pointer-events-none hidden md:block" />
        </div>
      </div>

      {/* PDF Preview Fullscreen Modal Overlay */}
      <AnimatePresence>
        {selectedGuideline && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 md:p-8"
          >
            {/* Background Modal Close click */}
            <div className="absolute inset-0 cursor-zoom-out" onClick={() => setSelectedGuideline(null)} />

            {/* Modal Body Container */}
            <motion.div
              initial={{ scale: 0.95, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 30, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative z-10 w-full max-w-6xl h-[85vh] bg-[#0c0c0c] border border-white/10 rounded-[32px] overflow-hidden flex flex-col shadow-2xl"
            >
              
              {/* Modal Header */}
              <div className="px-6 md:px-8 py-5 flex items-center justify-between border-b border-white/5 bg-[#0f0f0f]/80 backdrop-blur-xl">
                <div>
                  <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-gradus-gold mb-1 block">
                    {selectedGuideline.category}
                  </span>
                  <h4 className="text-lg md:text-xl font-heading font-medium text-white">
                    {selectedGuideline.title}
                  </h4>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                  <a
                    href={selectedGuideline.pdf_url}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-gradus-gold hover:border-gradus-gold/40 hover:scale-105 transition-all duration-300"
                    title="Télécharger / Ouvrir dans un nouvel onglet"
                  >
                    <Download size={18} />
                  </a>
                  <button
                    onClick={() => setSelectedGuideline(null)}
                    className="p-3 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/30 hover:scale-105 transition-all duration-300"
                    aria-label="Close modal"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* PDF Content Area */}
              <div className="flex-1 w-full bg-[#080808] relative">
                {iframeLoading && (
                  <div className="absolute inset-0 flex flex-col justify-center items-center gap-4 z-20 bg-[#080808]">
                    <Loader2 className="animate-spin text-gradus-gold" size={36} />
                    <span className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
                      Chargement du document...
                    </span>
                  </div>
                )}
                
                {/* Embed PDF inside an iframe or native viewer */}
                <iframe
                  src={`${selectedGuideline.pdf_url}#toolbar=0&navpanes=0`}
                  className="w-full h-full border-none z-10 relative"
                  onLoad={() => setIframeLoading(false)}
                />
              </div>

              {/* Modal Footer / External Link Fallback */}
              <div className="px-6 md:px-8 py-4 bg-[#0f0f0f] border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-[10px] font-mono text-white/30 max-w-md text-center sm:text-left">
                  Si le document ne s'affiche pas correctement, vous pouvez l'ouvrir directement.
                </span>
                <a
                  href={selectedGuideline.pdf_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradus-gold text-black font-semibold text-xs uppercase tracking-wider hover:scale-105 transition-all duration-300"
                >
                  <ExternalLink size={14} />
                  Ouvrir le document complet
                </a>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
