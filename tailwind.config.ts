import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "cb-base":     "var(--bg-base)",
        "cb-surface":  "var(--bg-surface)",
        "cb-elevated": "var(--bg-elevated)",
        "cb-green":    "var(--accent-green)",
        "cb-green-dim":"var(--accent-green-dim)",
        "cb-blue":     "var(--accent-blue)",
        "cb-primary":  "var(--text-primary)",
        "cb-secondary":"var(--text-secondary)",
        "cb-muted":    "var(--text-muted)",
        "cb-border":   "var(--border)",
        "cb-error":    "var(--error)",
        "cb-warning":  "var(--warning)",
      },
      fontFamily: {
        clash: ["Clash Display", "sans-serif"],
        dm:    ["DM Sans", "sans-serif"],
      },
      borderRadius: {
        "4": "4px",
        "10": "10px",
        "12": "12px",
        "16": "16px",
      },
      keyframes: {
        shake: {
          "0%,100%": { transform: "translateX(0)" },
          "20%":     { transform: "translateX(-8px)" },
          "40%":     { transform: "translateX(8px)" },
          "60%":     { transform: "translateX(-8px)" },
          "80%":     { transform: "translateX(8px)" },
        },
        pageIn: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          from: { opacity: "0", transform: "translateX(-8px)" },
          to:   { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          from: { backgroundPosition: "200% 0" },
          to:   { backgroundPosition: "-200% 0" },
        },
        pulseLogo: {
          "0%,100%": { transform: "scale(1)" },
          "50%":     { transform: "scale(1.1)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        particleBurst: {
          "0%":   { opacity: "1", transform: "scale(0) translate(0,0)" },
          "100%": { opacity: "0", transform: "scale(1) translate(var(--tx), var(--ty))" },
        },
        drawCircle: {
          from: { strokeDashoffset: "283" },
          to:   { strokeDashoffset: "0" },
        },
        drawCheck: {
          from: { strokeDashoffset: "100" },
          to:   { strokeDashoffset: "0" },
        },
        toastIn: {
          from: { opacity: "0", transform: "translateY(-12px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        toastOut: {
          from: { opacity: "1", transform: "translateY(0)" },
          to:   { opacity: "0", transform: "translateY(-12px)" },
        },
        borderPulse: {
          "0%,100%": { borderColor: "var(--error)" },
          "50%":     { borderColor: "transparent" },
        },
      },
      animation: {
        shake:        "shake 300ms ease-in-out",
        pageIn:       "pageIn 300ms ease-out both",
        slideIn:      "slideIn 200ms ease-out both",
        shimmer:      "shimmer 1.5s linear infinite",
        pulseLogo:    "pulseLogo 1.5s ease-in-out infinite",
        fadeUp:       "fadeUp 300ms ease-out both",
        drawCircle:   "drawCircle 600ms ease-out forwards",
        drawCheck:    "drawCheck 400ms ease-out 500ms forwards",
        toastIn:      "toastIn 200ms ease-out",
        toastOut:     "toastOut 150ms ease-in forwards",
        borderPulse:  "borderPulse 400ms ease-in-out 3",
      },
    },
  },
  plugins: [],
};

export default config;
