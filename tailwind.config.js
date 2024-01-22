module.exports = {
  purge: [
    "./shared/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./pages/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
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
      colors: ({ colors }) => ({
        primary: "var(--color-primary)",
        "primary-disabled": "var(--color-primary-disabled)",
        "red-primary": "var(--color-red-primary)",
        "primary-opacity": "var(--color-primary-opacity)",
        secondary: "var(--color-secondary)",
        overlay: "var(--color-overlay)",
        "overlay-opacity": "var(--color-overlay-opacity)",
        ["overlay-2"]: "var(--color-overlay-2)",
        ["overlay-3"]: "var(--color-overlay-3)",
        ["green-button"]: "var(--color-green-button)",
        "overlay-border": "var(--color-overlay-border)",
        alert: {
          success: "var(--color-alert-success)",
          error: "var(--color-alert-error)",
        },
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
        "transparent-color": {
          gray: {
            200: "var(--transparent-gray-200)",
            800: "var(--transparent-gray-800)",
          },
          dark: {
            100: "var(--transparent-dark-100)",
          },
        },
        inherit: colors.inherit,
        current: colors.current,
        transparent: colors.transparent,
        black: colors.black,
        white: colors.white,
        slate: colors.slate,
        gray: colors.gray,
        zinc: colors.zinc,
        neutral: colors.neutral,
        stone: colors.stone,
        red: colors.red,
        orange: colors.orange,
        amber: colors.amber,
        yellow: colors.yellow,
        lime: colors.lime,
        green: colors.green,
        emerald: colors.emerald,
        teal: colors.teal,
        cyan: colors.cyan,
        sky: colors.sky,
        blue: colors.blue,
        indigo: colors.indigo,
        violet: colors.violet,
        purple: colors.purple,
        fuchsia: colors.fuchsia,
        pink: colors.pink,
        rose: colors.rose,
      }),
    },
  },
  variantOrder: [
    "first",
    "last",
    "odd",
    "even",
    "visited",
    "checked",
    "empty",
    "read-only",
    "group-hover",
    "group-focus",
    "focus-within",
    "hover",
    "focus",
    "focus-visible",
    "active",
    "disabled",
  ],
  plugins: [],
};
