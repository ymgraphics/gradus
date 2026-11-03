"use client";

import Image from "next/image";
import type { Partner } from "@/lib/firebase-rest";

interface MarqueeProps {
  partners?: Partner[];
}

const fallbackPartners = Array.from({ length: 9 }, (_, i) => ({
  id: `fallback-${i + 1}`,
  imageUrl: `/assets/partners/Asset ${i + 1}.svg`,
  name: `Partner ${i + 1}`
}));

export default function Marquee({ partners = [] }: MarqueeProps) {
  const displayPartners = partners.length > 0 ? partners : fallbackPartners;

  return (
    <div className="w-full bg-gradus-surface border-y border-gradus-border overflow-hidden marquee-viewport py-8 md:py-12 group flex items-center relative z-10">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marqueeScroll {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .animate-marquee-css {
          display: flex;
          width: max-content;
          animation: marqueeScroll 45s linear infinite;
        }
        .animate-marquee-css:hover,
        .animate-marquee-css:focus-within {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee-css { animation: none; }
          .marquee-viewport { overflow-x: auto; }
        }
      `}} />

      <div className="animate-marquee-css">
        {/* We render twice to create the infinite loop effect */}
        {[1, 2].map((set) => (
          // The second set only exists to close the loop: hide it from AT and
          // drop it entirely when motion is reduced.
          <div
            key={`set-${set}`}
            className={`flex shrink-0 px-4 md:px-8 ${set === 2 ? "motion-reduce:hidden" : ""}`}
            aria-hidden={set === 2 ? true : undefined}
          >
            {displayPartners.map((partner, index) => (
              <div 
                key={`${set}-${partner.id}-${index}`} 
                className="flex items-center justify-center mx-6 md:mx-12 shrink-0 h-12 md:h-16 w-32 md:w-40 opacity-50 hover:opacity-100 transition-all duration-300 grayscale hover:grayscale-0 interactive cursor-pointer relative"
              >
                <Image 
                  src={partner.imageUrl} 
                  alt={partner.name || `Logo du partenaire Gradus`} 
                  fill
                  className="object-contain brightness-0 invert opacity-70 hover:opacity-100 hover:brightness-100 hover:invert-0 transition-all duration-300" 
                  loading="lazy" 
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
