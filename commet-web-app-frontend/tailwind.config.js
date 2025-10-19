import { defineConfig } from "@tailwindcss/vite";

export default defineConfig({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Legacy colors for compatibility
        "primary-50": "var(--color-primary-50)",
        "primary-100": "var(--color-primary-100)",
        "primary-200": "var(--color-primary-200)",
        "primary-300": "var(--color-primary-300)",
        "primary-400": "var(--color-primary-400)",
        "primary-500": "var(--color-primary-500)",
        "primary-600": "var(--color-primary-600)",
        "primary-700": "var(--color-primary-700)",
        "primary-800": "var(--color-primary-800)",
        "primary-900": "var(--color-primary-900)",
        "accent-50": "var(--color-accent-50)",
        "accent-100": "var(--color-accent-100)",
        "accent-200": "var(--color-accent-200)",
        "accent-300": "var(--color-accent-300)",
        "accent-400": "var(--color-accent-400)",
        "accent-500": "var(--color-accent-500)",
        "accent-600": "var(--color-accent-600)",
        "accent-700": "var(--color-accent-700)",
        "accent-800": "var(--color-accent-800)",
        "accent-900": "var(--color-accent-900)",
        "black-50": "var(--color-black-50)",
        "black-100": "var(--color-black-100)",
        "black-200": "var(--color-black-200)",
        "black-300": "var(--color-black-300)",
        "black-400": "var(--color-black-400)",
        "black-500": "var(--color-black-500)",
        "black-600": "var(--color-black-600)",
        "black-700": "var(--color-black-700)",
        "black-800": "var(--color-black-800)",
        "black-900": "var(--color-black-900)",
        "black-950": "var(--color-black-950)",
        "github-dark": "var(--color-github-dark)",
        "github-gray": "var(--color-github-gray)",
        "github-border": "var(--color-github-border)",
        "github-text": "var(--color-github-text)",
        "github-muted": "var(--color-github-muted)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "scale-in": {
          "0%": {
            transform: "scale(0.95)",
            opacity: "0",
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1",
          },
        },
        "glow-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 20px hsl(var(--glow-primary) / 0.3)",
          },
          "50%": {
            boxShadow: "0 0 40px hsl(var(--glow-primary) / 0.6)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
      },
    },
  },
});
