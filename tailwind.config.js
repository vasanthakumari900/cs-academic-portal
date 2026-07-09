/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Core brand
        primary: "#2563EB",
        "primary-light": "#60A5FA",
        "primary-dark": "#1D4ED8",
        secondary: "#1E40AF",
        "secondary-light": "#3B82F6",
        accent: "#06B6D4",
        "accent-light": "#22D3EE",
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",

        // Surfaces
        dark: "#0F172A",
        "dark-surface": "#1E293B",
        "dark-card": "#334155",
        bg: "#FFFFFF",
        surface: "#F8FAFC",
        muted: "#64748B",

        // Legacy
        cream: "#F8FAFC",
        gold: "#2563EB",
        maroon: "#1E40AF",

        // Premium accents
        "premium-gold": "#F59E0B",
        "premium-rose": "#F43F5E",
        "premium-violet": "#8B5CF6",
        "premium-emerald": "#10B981",
        "premium-amber": "#F59E0B",
        "premium-sky": "#0EA5E9",

        // Subject colors
        dbms: "#2563EB",
        os: "#1E40AF",
        aspnet: "#06B6D4",
        dmt: "#0EA5E9",
      },
      fontFamily: {
        sans: ["Inter", "Plus Jakarta Sans", "system-ui", "-apple-system", "sans-serif"],
        display: ["Space Grotesk", "Inter", "system-ui", "sans-serif"],
        jakarta: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        grotesk: ["Space Grotesk", "system-ui", "sans-serif"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
        "3xl": "20px",
        "4xl": "24px",
      },
      backdropBlur: {
        xs: "2px",
        glass: "24px",
        "glass-lg": "40px",
      },
      boxShadow: {
        // Glass
        glass: "0 4px 30px 0 rgba(0, 0, 0, 0.04)",
        "glass-lg": "0 8px 48px 0 rgba(0, 0, 0, 0.06)",
        "glass-dark": "0 4px 30px 0 rgba(0, 0, 0, 0.2)",
        "glass-xl": "0 12px 56px 0 rgba(0, 0, 0, 0.08)",

        // Soft
        soft: "0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.06)",
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)",
        "card-hover": "0 10px 30px -5px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)",

        // Elevated
        elevated: "0 20px 40px -8px rgba(0, 0, 0, 0.08)",
        "premium": "0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 10px 24px -4px rgba(0, 0, 0, 0.06)",
        "premium-lg": "0 10px 30px -5px rgba(0, 0, 0, 0.08), 0 20px 40px -12px rgba(0, 0, 0, 0.06)",

        // Glows
        "neon-primary": "0 0 15px rgba(37, 99, 235, 0.2), 0 0 30px rgba(37, 99, 235, 0.05)",
        "neon-accent": "0 0 15px rgba(6, 182, 212, 0.2), 0 0 30px rgba(6, 182, 212, 0.05)",
        "neon-amber": "0 0 15px rgba(245, 158, 11, 0.2), 0 0 30px rgba(245, 158, 11, 0.05)",
        "neon-rose": "0 0 15px rgba(244, 63, 94, 0.2), 0 0 30px rgba(244, 63, 94, 0.05)",
        "neon-violet": "0 0 15px rgba(139, 92, 246, 0.2), 0 0 30px rgba(139, 92, 246, 0.05)",
        "neon-emerald": "0 0 15px rgba(16, 185, 129, 0.2), 0 0 30px rgba(16, 185, 129, 0.05)",

        // Inner
        "inner-glow": "inset 0 1px 0 0 rgba(255, 255, 255, 0.3)",
        "inner-glow-dark": "inset 0 1px 0 0 rgba(255, 255, 255, 0.08)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
        "fade-in-down": "fadeInDown 0.5s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
        "slide-down": "slideDown 0.3s ease-out forwards",
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        shimmer: "shimmer 1.6s linear infinite",
        "shimmer-fast": "shimmer 1s linear infinite",
        "pulse-slow": "pulse 4s ease-in-out infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "gradient-shift": "gradientShift 8s ease infinite",
        "gradient-rotate": "gradientRotate 12s ease infinite",
        "scale-in": "scaleIn 0.3s ease-out forwards",
        "spin-slow": "spin 8s linear infinite",
        "spin-reverse": "spin 12s linear infinite reverse",
        "wiggle": "wiggle 0.5s ease-in-out",
        "bounce-subtle": "bounceSubtle 2s ease-in-out infinite",
        "orb": "orb 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        fadeInUp: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%": { opacity: 0, transform: "translateY(-12px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: 0, transform: "translateY(16px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: 0, transform: "translateY(-8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.3", transform: "scale(1)" },
          "50%": { opacity: "0.6", transform: "scale(1.05)" },
        },
        gradientShift: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        gradientRotate: {
          "0%, 100%": { transform: "rotate(0deg) scale(1)" },
          "33%": { transform: "rotate(120deg) scale(1.1)" },
          "66%": { transform: "rotate(240deg) scale(0.9)" },
          "100%": { transform: "rotate(360deg) scale(1)" },
        },
        scaleIn: {
          "0%": { opacity: 0, transform: "scale(0.95)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-3deg)" },
          "75%": { transform: "rotate(3deg)" },
        },
        bounceSubtle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        orb: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(30px, -20px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "mesh-light":
          "radial-gradient(at 20% 20%, rgba(37,99,235,0.06) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(30,64,175,0.04) 0px, transparent 50%), radial-gradient(at 50% 100%, rgba(6,182,212,0.04) 0px, transparent 50%)",
        "mesh-dark":
          "radial-gradient(at 20% 20%, rgba(37,99,235,0.12) 0px, transparent 50%), radial-gradient(at 80% 100%, rgba(30,64,175,0.08) 0px, transparent 50%), radial-gradient(at 50% 0%, rgba(6,182,212,0.08) 0px, transparent 50%)",
      },
    },
  },
  plugins: [],
};
