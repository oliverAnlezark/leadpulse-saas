/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./client/index.html",
    "./client/src/**/*.{js,jsx,ts,tsx}",
    "./client/src/pages/**/*.{js,jsx}",
    "./client/src/components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7c3aed',
        'primary-dark': '#6d28d9',
        'primary-light': '#a78bfa',
        secondary: '#8b5cf6',
        accent: '#ec4899',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
      },
      fontFamily: {
        sans: ['Sora', 'system-ui', '-apple-system', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
  safelist: [
    'from-gray-900',
    'to-gray-800',
    'from-purple-600',
    'to-purple-700',
    'bg-purple-600',
    'text-white',
    'text-gray-300',
    'hover:bg-gray-700',
    'hover:text-white',
    'bg-gradient-to-b',
    'flex-col',
    'fixed',
    'left-0',
    'top-0',
    'h-screen',
    'w-64',
    'md:flex',
    'hidden',
  ],
}
