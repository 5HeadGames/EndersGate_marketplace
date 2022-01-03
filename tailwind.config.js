module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      "3xl": "1700px",
    },
    fontFamily: {
      roboto: ["Roboto", "sans-serif"],
      montserrat: ["Montserrat", "sans-serif"],
    },
    colors: {
      primary: "var(--color-primary)",
      "primary-disabled": "var(--color-primary-disabled)",
      primaryOpacity: "var(--color-primary-opacity)",
      secondary: "var(--color-secondary)",
      overlay: "var(--color-overlay)",
      alert: {
        success: "var(--color-alert-success)",
        error: "var(--color-alert-error)",
      },
      facebook: "var(--color-facebook)",

      gray: {
        0: "var(--color-gray-0)",
        200: "var(--color-gray-200)",
        500: "var(--color-gray-500)",
        800: "var(--color-gray-800)",
        900: "var(--color-gray-900)",
        opacity: {
          10: "var(--color-gray-500-opacity-10)",
        },
      },
      white: "var(--color-white)",
      dark: "var(--color-dark)",
      transparent: "rgba(0, 0, 0, 0)",
      "transparent-color": {
        gray: {
          200: "var(--transparent-gray-200)",
          800: "var(--transparent-gray-800)",
        },
      },
    },
    customForms: (theme) => ({
      default: {
        checkbox: {
          iconColor: theme("colors.primary"),
        },
      },
    }),
    extend: {
      backgroundSize: {
        full: "100% 100%",
      },
      backgroundImage: () => ({
        register: "url('/img/bg-transport-public.jpg')",
      }),
      inset: {
        15: "3.563rem",
      },
      borderRadius: {
        10: "0.625rem",
        20: "1.25rem",
      },
      spacing: {
        0.5: "0.063rem",
        37: "9.125rem",
        41: "10.5rem",
        61: "15.313rem",
        75: "18.875rem",
      },
      padding: {
        18: "4.375rem",
        21: "5.313rem",
      },
      fontSize: {
        caption: "0.5rem",
        "4.5xl": "2.5rem",
      },
      borderWidth: {
        10: "0.625rem",
      },
      rotate: {
        135: "135deg",
        "-135": "-135deg",
      },
      boxShadow: {
        danger: "inset -2px 2px 19px 0px rgba(181,35,34,0.75)",
      },
    },
  },
  plugins: [],
};
