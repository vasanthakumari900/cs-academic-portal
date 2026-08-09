// src/components/common/TiltCard.jsx
import { useState } from "react";
import { motion } from "framer-motion";

export default function TiltCard({ children, className = "", onClick, style }) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });

  function handleMouseMove(e) {
    const card = e.currentTarget.getBoundingClientRect();
    const cardWidth = card.width;
    const cardHeight = card.height;
    const mouseX = e.clientX - card.left;
    const mouseY = e.clientY - card.top;

    const rX = ((mouseY - cardHeight / 2) / (cardHeight / 2)) * -8;
    const rY = ((mouseX - cardWidth / 2) / (cardWidth / 2)) * 8;

    setRotateX(rX);
    setRotateY(rY);
    setGlarePosition({
      x: (mouseX / cardWidth) * 100,
      y: (mouseY / cardHeight) * 100,
    });
  }

  function handleMouseLeave() {
    setRotateX(0);
    setRotateY(0);
  }

  return (
    <motion.div
      style={{
        perspective: 1000,
        transformStyle: "preserve-3d",
        ...style,
      }}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <motion.div
        animate={{ rotateX, rotateY }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="w-full h-full relative overflow-hidden rounded-2xl"
      >
        {children}

        {/* Dynamic Light Sheen Following Mouse */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.18) 0%, transparent 60%)`,
          }}
        />
      </motion.div>
    </motion.div>
  );
}
