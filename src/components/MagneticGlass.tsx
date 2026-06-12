"use client";

import React, { useRef } from "react";
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";

interface MagneticGlassProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

const MagneticGlass: React.FC<MagneticGlassProps> = ({ 
  children, 
  className = "", 
  strength = 15 
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const rotateX = useTransform(springY, [-strength, strength], [strength / 2, -strength / 2]);
  const rotateY = useTransform(springX, [-strength, strength], [-strength / 2, strength / 2]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`perspective-1000 h-full ${className}`}
    >
      <motion.div
        style={{
          z: 40,
        }}
        className="h-full w-full flex"
      >
        <div className="h-full w-full flex">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MagneticGlass;
