import type { Config } from "tailwindcss";

/**
 * Design tokens ported from the legacy static site (styles/theme.css) so the
 * Next platform keeps the established dark visual identity.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,md,mdx}",
    "./components/**/*.{ts,tsx}",
    "./mdx-components.tsx",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0e1116",
        "bg-elevated": "#161a22",
        "bg-elevated-2": "#1d222c",
        fg: "#e8e6e3",
        "fg-muted": "#9aa0a6",
        "fg-dim": "#6b7280",
        accent: "#58a6ff",
        "accent-warm": "#f5b942",
        success: "#6ee7b7",
        danger: "#f87171",
        border: "rgba(154, 160, 166, 0.2)",
        "border-strong": "rgba(154, 160, 166, 0.4)",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Iowan Old Style", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        DEFAULT: "10px",
        lg: "14px",
      },
      boxShadow: {
        card: "0 8px 24px rgba(0, 0, 0, 0.35)",
      },
      maxWidth: {
        page: "1100px",
        wide: "1280px",
      },
    },
  },
  plugins: [],
};

export default config;
