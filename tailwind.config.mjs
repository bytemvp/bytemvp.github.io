/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}"],
	darkMode: ["class", '[data-theme="dark"]'],
	theme: {
		extend: {
			colors: {
				accent: "var(--accent)",
				"accent-dark": "var(--accent-dark)",
				paper: "var(--paper)",
				"paper-deep": "var(--paper-deep)",
				ink: "rgb(var(--ink))",
				"ink-muted": "rgb(var(--ink-muted))",
				cinnabar: "var(--cinnabar)",
				indigo: "var(--indigo)",
				jade: "var(--jade)",
				wash: "var(--wash)",
				"gray-light": "rgb(var(--gray-light))",
				gray: "rgb(var(--gray))",
				"gray-dark": "rgb(var(--gray-dark))",
				black: "rgb(var(--black))",
			},
			boxShadow: {
				card: "var(--box-shadow)",
				pop: "var(--pop-shadow)",
				soft: "var(--soft-shadow)",
			},
			fontFamily: {
				sans: ["Atkinson", "sans-serif"],
			},
			borderRadius: {
				"2xl": "1.25rem",
				"3xl": "1.75rem",
			},
		},
	},
	plugins: [],
};
