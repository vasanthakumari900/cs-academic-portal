// src/components/chatbot/CSAIAgentLogo.jsx
// SVG logo: AI robot face + graduation cap inside a blue-cyan circle

export default function CSAIAgentLogo({ size = 32 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Circular background with gradient */}
      <defs>
        <linearGradient id="csai-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
        <linearGradient id="csai-shine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>

      {/* Circle background */}
      <circle cx="32" cy="32" r="32" fill="url(#csai-grad)" />
      
      {/* Subtle shine overlay */}
      <circle cx="32" cy="32" r="32" fill="url(#csai-shine)" />

      {/* Circuit lines (top-left) */}
      <path
        d="M12 20 L18 20 L18 16 L22 16"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="10" cy="20" r="1.5" fill="rgba(255,255,255,0.4)" />
      <circle cx="24" cy="16" r="1.5" fill="rgba(255,255,255,0.4)" />

      {/* Circuit lines (bottom-right) */}
      <path
        d="M44 48 L50 48 L50 44 L54 44"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="42" cy="48" r="1.5" fill="rgba(255,255,255,0.4)" />
      <circle cx="56" cy="44" r="1.5" fill="rgba(255,255,255,0.4)" />

      {/* Circuit line (right side) */}
      <path
        d="M50 28 L54 28"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="48" cy="28" r="1" fill="rgba(255,255,255,0.35)" />

      {/* Graduation Cap (top of head) */}
      <g transform="translate(32, 17)">
        {/* Cap base - diamond shape */}
        <polygon
          points="0,-8 -12,-2 0,4 12,-2"
          fill="white"
          opacity="0.95"
        />
        {/* Cap top ornament */}
        <rect x="-1.5" y="-11" width="3" height="4" rx="1" fill="white" opacity="0.9" />
        {/* Cap tassel */}
        <line x1="12" y1="-2" x2="15" y2="2" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.85" />
        <circle cx="15" cy="3" r="1.5" fill="white" opacity="0.8" />
      </g>

      {/* Robot Face */}
      <g transform="translate(32, 34)">
        {/* Head outline - rounded square */}
        <rect
          x="-14"
          y="-12"
          width="28"
          height="24"
          rx="6"
          fill="white"
          opacity="0.95"
        />

        {/* Antenna on robot head */}
        <line x1="0" y1="-16" x2="0" y2="-12" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        <circle cx="0" cy="-18" r="2.5" fill="white" opacity="0.85" />

        {/* Eyes */}
        <rect x="-9" y="-6" width="6" height="6" rx="2" fill="url(#csai-grad)" opacity="0.9" />
        <rect x="3" y="-6" width="6" height="6" rx="2" fill="url(#csai-grad)" opacity="0.9" />

        {/* Eye shine */}
        <circle cx="-6" cy="-4" r="1.2" fill="rgba(255,255,255,0.8)" />
        <circle cx="6" cy="-4" r="1.2" fill="rgba(255,255,255,0.8)" />

        {/* Mouth - small smile */}
        <path
          d="M-5 4 Q0 8 5 4"
          stroke="url(#csai-grad)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
        />
      </g>
    </svg>
  );
}
