// src/components/notes/CanvasAudioVisualizer.jsx
import React, { useEffect, useRef } from "react";

export default function CanvasAudioVisualizer({ isPlaying, height = 48, className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    let phase = 0;
    const numBars = 32;

    const render = () => {
      const width = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, width, h);

      // Draw background ambient glow
      const bgGrad = ctx.createLinearGradient(0, 0, width, 0);
      bgGrad.addColorStop(0, "rgba(13, 148, 136, 0.08)");
      bgGrad.addColorStop(0.5, "rgba(245, 158, 11, 0.12)");
      bgGrad.addColorStop(1, "rgba(225, 29, 72, 0.08)");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, h);

      // Draw Spectrum Bars
      const barWidth = width / numBars - 2;
      for (let i = 0; i < numBars; i++) {
        let barHeight;
        if (isPlaying) {
          const sinVal = Math.sin(phase + i * 0.3);
          const cosVal = Math.cos(phase * 1.5 + i * 0.2);
          barHeight = Math.abs(sinVal * cosVal) * (h * 0.75) + 6;
        } else {
          barHeight = Math.sin(phase + i * 0.1) * 4 + 6;
        }

        const x = i * (barWidth + 2);
        const y = (h - barHeight) / 2;

        const barGrad = ctx.createLinearGradient(0, y, 0, y + barHeight);
        if (i % 3 === 0) {
          barGrad.addColorStop(0, "#F59E0B"); // Amber
          barGrad.addColorStop(1, "#14B8A6"); // Teal
        } else if (i % 3 === 1) {
          barGrad.addColorStop(0, "#14B8A6"); // Teal
          barGrad.addColorStop(1, "#F43F5E"); // Rose
        } else {
          barGrad.addColorStop(0, "#A855F7"); // Purple
          barGrad.addColorStop(1, "#F59E0B"); // Amber
        }

        ctx.fillStyle = barGrad;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 3);
        ctx.fill();
      }

      // Draw overlay smooth sine wave
      ctx.beginPath();
      ctx.lineWidth = 2;
      const waveGrad = ctx.createLinearGradient(0, 0, width, 0);
      waveGrad.addColorStop(0, "rgba(20, 184, 166, 0.8)");
      waveGrad.addColorStop(0.5, "rgba(245, 158, 11, 0.9)");
      waveGrad.addColorStop(1, "rgba(244, 63, 94, 0.8)");
      ctx.strokeStyle = waveGrad;

      for (let x = 0; x < width; x += 4) {
        const amplitude = isPlaying ? h * 0.25 : 3;
        const frequency = isPlaying ? 0.04 : 0.02;
        const y = h / 2 + Math.sin(x * frequency + phase * 2) * amplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      phase += isPlaying ? 0.08 : 0.02;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying]);

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-teal-500/30 shadow-inner bg-slate-950 ${className}`}>
      <canvas
        ref={canvasRef}
        width={360}
        height={height}
        className="w-full h-full block"
      />
    </div>
  );
}
