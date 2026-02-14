/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#050005",
        lavenderWhite: "#F9F5FF",
        electricPurple: "#8A2BE2",
        deepViolet: "#4B0082",
        neonMagenta: "#FF00FF",
        neonCyan: "#00FFFF",
        goldStar: "#FFD700",
        mutedViolet: "#A084CA",
      },
      fontFamily: {
        orbitron: ['"Orbitron"', 'sans-serif'],
        outfit: ['"Outfit"', 'sans-serif'],
        inter: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'subtle-grid': 'linear-gradient(to right, #ffffff05 1px, transparent 1px), linear-gradient(to bottom, #ffffff05 1px, transparent 1px)',
      }
    },
  },
  plugins: [],
}
