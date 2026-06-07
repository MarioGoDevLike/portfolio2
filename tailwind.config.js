module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    fontFamily: {
      primary: ['Space Grotesk', 'sans-serif'],
      secondary: ['Inter', 'sans-serif'],
      tertiary: ['Space Grotesk', 'sans-serif'],
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '24px',
        lg: '48px',
      },
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '960px',
      xl: '1200px',
    },
    extend: {
      colors: {
        primary: '#050505',
        surface: '#0f0f0f',
        accent: '#818cf8',
        'accent-cyan': '#22d3ee',
        muted: '#6b7280',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out infinite 2s',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [],
};
