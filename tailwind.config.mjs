/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}"],
	darkMode: ["class", '[data-theme="dark"]'],
	theme: {
		extend: {
			colors: {
				accent: "var(--accent)",
				"accent-dark": "var(--accent-dark)",
				candy: "var(--candy)",
				mango: "var(--mango)",
				lime: "var(--lime)",
				aqua: "var(--aqua)",
				bubble: "var(--bubble)",
				ink: "rgb(var(--ink))",
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
