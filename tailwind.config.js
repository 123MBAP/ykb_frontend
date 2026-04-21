/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#D4A574',
                secondary: '#A0826D',
                accent: '#8B7355',
                dark: '#1A1A1A',
                'dark-light': '#2D2D2D',
            },
            fontFamily: {
                serif: ['Georgia', 'serif'],
                sans: ['system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
};