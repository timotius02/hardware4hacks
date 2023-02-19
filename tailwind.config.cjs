const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      colors: {
        brand: {
          50: "#f3f3f3",
          100: "#e7e7e7",
          200: "#c4c4c4",
          300: "#a0a0a0",
          400: "#585858",
          500: "#111111",
          600: "#0f0f0f",
          700: "#0d0d0d",
          800: "#0a0a0a",
          900: "#080808",
          DEFAULT: "#111111",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
