"use client";

import React from "react";

const FluidBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gradus-primary">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes ambientDrift {
          0% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(1%, -1%, 0) scale(1.05); }
          100% { transform: translate3d(0, 0, 0) scale(1); }
        }
        .ambient-mesh {
          position: absolute;
          inset: -10%;
          background-image: 
            radial-gradient(circle at 10% 20%, rgba(96, 80, 220, 0.15) 0%, transparent 40%),
            radial-gradient(circle at 90% 10%, rgba(232, 93, 36, 0.15) 0%, transparent 40%),
            radial-gradient(circle at 30% 90%, rgba(96, 80, 220, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(232, 93, 36, 0.1) 0%, transparent 40%);
          filter: blur(60px);
          animation: ambientDrift 25s ease-in-out infinite;
          will-change: transform;
        }
      `}} />
      
      {/* Premium Hardware-Accelerated Ambient Layer */}
      <div className="ambient-mesh" />
      
      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none brightness-150 contrast-150" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />
      
      {/* Subtle Vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-gradus-primary opacity-60" />
    </div>
  );
};

export default FluidBackground;
