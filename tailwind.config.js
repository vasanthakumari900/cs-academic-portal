/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // User-specified palette
        primary: "#2563EB",        // Royal Blue
        "primary-light": "#60A5FA", // Blue-400
        "primary-dark": "#1D4ED8",  // Blue-700
        secondary: "#1E40AF",       // Dark Blue
        "secondary-light": "#3B82F6",
        accent: "#06B6D4",         // Cyan-500
        "accent-light": "#22D3EE",
        success: "#22C55E",        // Green-500
        warning: "#F59E0B",        // Amber-500
        danger: "#EF4444",         // Red-500

        // Dark mode
        dark: "#0F172A",
        "dark-surface": "#1E293B",
        "dark-card": "#334155",

        // Light mode
        bg: "#FFFFFF",
        surface: "#F8FAFC",
        muted: "#64748B",

        // Legacy mapped
        cream: "#F8FAFC",
        gold: "#2563EB",
        maroon: "#1E40AF",

        // Subject colors
        dbms: "#2563EB",
        os: "#1E40AF",
        aspnet: "#06B6D4",
        dmt: "#0EA5E9",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        display: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
        "3xl": "20px",
      },
      backdropBlur: { xs: "2px" },
      boxShadow: {
        glass: "0 4px 24px 0 rgba(0, 0, 0, 0.04)",
        "glass-dark": "0 4px 24px 0 rgba(0, 0, 0, 0.2)",
        glow: "0 0 24px 0 rgba(37, 99, 235, 0.15)",
        soft: "0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.06)",
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.06)",
        "card-hover": "0 10px 30px -5px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)",
        elevated: "0 20px 40px -8px rgba(0, 0, 0, 0.08)",
        "premium": "0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 10px 24px -4px rgba(0, 0, 0, 0.06)",
        "premium-lg": "0 10px 30px -5px rgba(0, 0, 0, 0.08), 0 20px 40px -12px rgba(0, 0, 0, 0.06)",
        "neon-primary": "0 0 15px rgba(37, 99, 235, 0.2), 0 0 30px rgba(37, 99, 235, 0.05)",
        "neon-accent": "0 0 15px rgba(6, 182, 212, 0.2), 0 0 30px rgba(6, 182, 212, 0.05)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 1.6s linear infinite",
        "pulse-slow": "pulse 4s ease-in-out infinite",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        slideUp: {
          "0%": { opacity: 0, transform: "translateY(16px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-700px 0" },
          "100%": { backgroundPosition: "700px 0" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 15px rgba(37, 99, 235, 0.1)" },
          "50%": { boxShadow: "0 0 30px rgba(37, 99, 235, 0.2)" },
        },
      },
    },
  },
  plugins: [],
};
