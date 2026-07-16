/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Light "beige" palette inspired by wemakedevs.org light mode
        bg: "#f7f4ec",
        panel: "#ffffff",
        elevated: "#f1ede2",
        border: "#e7e1d4",
        muted: "#6c6f78",
        text: "#1b1e26",
        accent: "#2f5bff",
        "accent-soft": "#1e40e6",
        secondary: "#e11d48",
        success: "#16a34a",
        warn: "#ea580c",
        purple: "#7c3aed",
        sky: "#2563eb",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
        display: ["Space Grotesk", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
