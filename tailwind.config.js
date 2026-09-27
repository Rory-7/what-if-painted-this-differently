/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F7F5F0",
        ink: "#1C1B19",
        bronze: "#8B7355",
        clay: "#B54B3A",
        line: "#E4E0D6",
        muted: "#8B8578",
        body: "#4A4844",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
