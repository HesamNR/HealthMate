/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        border: "var(--border)",
        muted: "var(--muted)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        animaSidebarBg: "#ffffff",
        animaSidebarAccent: "#f3d4c6", // Sidebar Settings background
        animaText: "#f0743e", // Orange menu heading
      },
      fontFamily: {
        roboto: ['"Roboto"', 'Helvetica', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        anima: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Optional: matches Anima style
      },
      borderRadius: {
        anima: "8px", // Optional: match Figma designs
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
  variants: {
    extend: {
      backgroundColor: ["data-state-checked", "data-state-unchecked"],
      translate: ["data-state-checked", "data-state-unchecked"],
    },
  },
};
