/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./dist/index.html", "./src/index.js"],
  theme: {
    extend: {
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      colors: {
        primary: "#1CC691",
        enabled: "#1CC691",
        disabled: "#ff8080",
      },
      maxWidth: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
    },
  },
  plugins: [],
};
