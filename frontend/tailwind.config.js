/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'neon-blue': '#2de2e6',
                'neon-purple': '#7627dc',
                'dark-bg': '#050505',
            },
            fontFamily: {
                display: ['Orbitron', 'sans-serif'],
                body: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
