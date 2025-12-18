/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#10b981", // Green (Emerald 500) - Dominant Primary
        "secondary": "#7c3aed", // Purple (Violet 600) - Secondary Accent
        "background-light": "#fafafa", // Neutral Light
        "background-dark": "#111827", // Neutral Dark (Gray 900)
      },
      fontFamily: {
        "display": ["Public Sans", "sans-serif"]
      },
      borderRadius: { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
