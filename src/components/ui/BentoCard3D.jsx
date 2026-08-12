import { useState, useRef } from "react";
import { motion } from "framer-motion";

export default function BentoCard3D({
  children,
  className = "",
  glowColor = "rgba(244, 194, 102, 0.3)",
  conicColor = "from-[#F4C266] via-[#C50337] to-[#D97706]",
  onClick,
  style = {},
}) {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -8; // Max 8 deg rotation
    const rY = ((x - centerX) / centerX) * 8;

    setRotateX(rX);
    setRotateY(rY);

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setGlarePos({ x: glareX, y: glareY, opacity: 0.15 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        perspective: 1000,
        transformStyle: "preserve-3d",
        ...style,
      }}
      animate={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        scale: isHovered ? 1.02 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      className={`group relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#22101A]/90 to-[#14070D]/95 border border-white/10 p-6 shadow-xl transition-shadow duration-500 cursor-pointer ${
        onClick ? "active:scale-[0.99]" : ""
      } ${className}`}
    >
      {/* ── Animated Conic Border Trace ── */}
      <div
        className={`absolute -inset-[1.5px] rounded-3xl bg-gradient-to-r ${conicColor} opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none blur-[1px]`}
      />

      {/* ── Dynamic Radial Cursor Glare ── */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10"
        style={{
          background: `radial-gradient(600px circle at ${glarePos.x}% ${glarePos.y}%, ${glowColor}, transparent 40%)`,
          opacity: glarePos.opacity,
        }}
      />

      {/* ── Background Subtle Mesh Glow ── */}
      <div
        className="absolute -top-24 -right-24 h-48 w-48 rounded-full pointer-events-none blur-3xl transition-opacity duration-500 opacity-20 group-hover:opacity-40"
        style={{ backgroundColor: glowColor.split(",")[0].replace("rgba(", "rgb(") || "#F4C266" }}
      />

      {/* ── Card Content ── */}
      <div className="relative z-20 h-full flex flex-col justify-between">
        {children}
      </div>
    </motion.div>
  );
}
