/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/**/*.{js,jsx,ts,tsx}",
		"./public/index.html",
	],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				neon: {
					blue: "#00E5FF",
					cyan: "#00FFFF",
					ice: "#8BE9FD",
				},
				bg: {
					dark: "#071018",
					darker: "#040a11",
				},
			},
			boxShadow: {
				neonBlue: "0 0 10px rgba(0,229,255,0.8), 0 0 24px rgba(0,229,255,0.6)",
				neonCyan: "0 0 10px rgba(0,255,255,0.7), 0 0 22px rgba(0,255,255,0.5)",
			},
		},
	},
	plugins: [],
};
