/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  important: true,
  theme: {
    extend: {
      zIndex: {
        1000: "1000",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        palatino: ['"Palatino Linotype"', "Arial", "sans-serif"],
        heading: ['Poppins', 'sans-serif'],
        body: ['Open Sans', 'sans-serif'],
        sans: ['Open Sans', 'sans-serif'],
      },
      colors: {
        customBlack: "#000000",
        customGreen: "#17b978",
        primary: "#DC2626", // Red-600
        secondary: "#EF4444", // Red-500
      },
      fontSize: {
        customSize: "1rem",
      },
      fontWeight: {
        customWeight: 600,
      },
      screens: {
        mt: "376px",

        mb: "480px",

        sm: "576px",

        md: "768px",

        lg: "992px",

        xl: "1200px",

        "2xl": "1536px",
      },
      minWidth: {
        25: "25%",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".ruby": {
          display: "inline-block",
          verticalAlign: "middle",
          fontSize: "16px",
        },
        ".whitespace-normal": {
          whiteSpace: "normal",
        },
      };

      addUtilities(newUtilities, ["responsive"]);
    },
  ],
};
