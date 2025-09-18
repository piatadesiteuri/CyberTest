/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        harmony: {
          dark: '#082C38',     // Dark Teal
          tan: '#C19976',     // Muted Tan
          cream: '#FCD8B4',   // Light Cream
          gradient: {
            from: '#FCD8B4',
            via: '#C19976', 
            to: '#082C38'
          }
        },
        primary: {
          50: '#f8f4f0',
          100: '#f0e8dc',
          200: '#e1d1b8',
          300: '#d1ba94',
          400: '#c1a370',
          500: '#C19976',
          600: '#a88564',
          700: '#8f7152',
          800: '#765d40',
          900: '#5d492e',
        },
        danger: {
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
        },
        success: {
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
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        cyber: {
          primary: '#082C38',      // Dark Teal - Primary cybersecurity color
          secondary: '#C19976',    // Muted Tan - Secondary color
          accent: '#FCD8B4',       // Light Cream - Accent color
          success: '#22c55e',      // Green - Success states
          warning: '#f59e0b',      // Orange - Warning states
          danger: '#ef4444',       // Red - Danger/Error states
          info: '#3b82f6',         // Blue - Information states
          purple: '#8b5cf6',       // Purple - Advanced features
          gray: '#6b7280',         // Gray - Neutral states
        },
        warm: {
          copper: '#B87333',       // Rich Copper - Main icon color
          amber: '#F59E0B',        // Warm Amber - Accent
          bronze: '#CD7F32',       // Bronze - Secondary
          gold: '#FFD700',         // Gold - Highlights
          brass: '#B5A642',        // Brass - Alternative
          honey: '#FFC107',        // Honey - Light accent
          sunset: '#FF8C00',       // Sunset Orange - Warm
          caramel: '#D2691E',      // Caramel - Deep warm
        },
      },
    },
  },
  plugins: [],
}
