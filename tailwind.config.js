import plugin from "tailwindcss/plugin";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      xs: "360px",
      sm: "520px",
      md: "768px",
      lg: "1040px",
      xl: "1280px",
      "2xl": "1440px",
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        xs: "1.25rem",
        sm: "1.5rem",
        md: "2rem",
        lg: "2.5rem",
        xl: "3rem",
        "2xl": "4rem",
      },
    },
    layout: {
      maxWidth: {
        shell: "min(88rem, 100vw - clamp(2rem, 4vw, 5rem))",
        content: "min(72rem, 100%)",
        narrow: "68ch",
      },
      shadows: {
        navigation: "0 2px 12px -2px rgb(15 23 42 / 0.35), 0 8px clamp(16px, 3vw, 28px) rgb(15 23 42 / 0.25)",
        card: "0 16px clamp(18px, 2.75vw, 36px) rgb(15 23 42 / 0.22)",
        panel: "0 22px clamp(28px, 4vw, 52px) rgb(15 23 42 / 0.28)",
      },
      colors: {
        navigation: "rgb(15 23 42 / 0.85)",
        card: "rgb(30 41 59 / 0.95)",
        panel: "rgb(15 23 42 / 0.92)",
      },
    },
    extend: {
      colors: {
        // RhinoGuardians brand colors
        rhino: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        threat: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        surface: {
          navigation: "rgb(15 23 42 / 0.85)",
          card: "rgb(30 41 59 / 0.92)",
          panel: "rgb(15 23 42 / 0.88)",
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      const fluidTypography = {
        '.text-fluid-xs': { fontSize: 'clamp(0.75rem, 0.68rem + 0.2vw, 0.875rem)', lineHeight: '1.45' },
        '.text-fluid-sm': { fontSize: 'clamp(0.875rem, 0.8rem + 0.3vw, 1rem)', lineHeight: '1.5' },
        '.text-fluid-base': { fontSize: 'clamp(1rem, 0.94rem + 0.4vw, 1.15rem)', lineHeight: '1.6' },
        '.text-fluid-lg': { fontSize: 'clamp(1.5rem, 1.2rem + 1.2vw, 2.25rem)', lineHeight: '1.2' },
      };

      const fluidSpacing = {
        '.gap-fluid-sm': { gap: 'clamp(0.75rem, 0.5rem + 1vw, 1.5rem)' },
        '.gap-fluid-md': { gap: 'clamp(1rem, 0.75rem + 1.5vw, 2.5rem)' },
        '.py-fluid-section': { paddingBlock: 'clamp(3rem, 2.25rem + 3vw, 5.5rem)' },
      };

      const safeArea = {
        '.pt-safe': { paddingTop: 'max(env(safe-area-inset-top), 1.5rem)' },
        '.pb-safe': { paddingBottom: 'max(env(safe-area-inset-bottom), 1.5rem)' },
        '.px-safe': {
          paddingLeft: 'max(env(safe-area-inset-left), 1.25rem)',
          paddingRight: 'max(env(safe-area-inset-right), 1.25rem)',
        },
        '.py-safe': {
          paddingTop: 'max(env(safe-area-inset-top), 1.5rem)',
          paddingBottom: 'max(env(safe-area-inset-bottom), 1.5rem)',
        },
      };

      addUtilities({
        ...fluidTypography,
        ...fluidSpacing,
        ...safeArea,
      }, {
        variants: ['responsive'],
      });
    }),
    plugin(({ addBase, addUtilities, theme }) => {
      const layout = theme('layout.maxWidth') ?? {};
      const shadows = theme('layout.shadows') ?? {};
      const surfaces = theme('layout.colors') ?? {};

      const layoutVars = Object.entries(layout).reduce((acc, [key, value]) => {
        acc[`--layout-max-${key}`] = value;
        return acc;
      }, {});

      const shadowVars = Object.entries(shadows).reduce((acc, [key, value]) => {
        acc[`--shadow-${key}`] = value;
        return acc;
      }, {});

      const surfaceVars = Object.entries(surfaces).reduce((acc, [key, value]) => {
        acc[`--surface-${key}`] = value;
        return acc;
      }, {});

      addBase({
        ':root': {
          ...layoutVars,
          ...shadowVars,
          ...surfaceVars,
        },
      });

      const layoutUtilities = Object.keys(layout).reduce((acc, key) => {
        acc[`.max-w-layout-${key}`] = { maxWidth: `var(--layout-max-${key})` };
        return acc;
      }, {});

      const shadowUtilities = Object.keys(shadows).reduce((acc, key) => {
        acc[`.shadow-${key}`] = { boxShadow: `var(--shadow-${key})` };
        return acc;
      }, {});

      const surfaceUtilities = Object.keys(surfaces).reduce((acc, key) => {
        acc[`.bg-surface-${key}`] = { backgroundColor: `var(--surface-${key})` };
        acc[`.text-surface-${key}`] = { color: `var(--surface-${key})` };
        return acc;
      }, {});

      addUtilities({
        ...layoutUtilities,
        ...shadowUtilities,
        ...surfaceUtilities,
      }, {
        variants: ['responsive'],
      });
    }),
  ],
};
