/** @type {import('tailwindcss').Config} */

const { nextui } = require("@nextui-org/react");

export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
		"./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {},
	},
	darkMode: "class",
	plugins: [
		nextui({
			themes: {
				dark: {
					colors: {
						primary: "#d8dbe2",
						foreground: "#058ed9",
						background: "#0e0920",
						content2: "#F60E67",
						complement: "#78ffd6",
						content1: {
							DEFAULT: "#d8dbe2",
						},
					},
				},
				light: {
					colors: {
						primary: "#0e0920",
						foreground: "#058ed9",
						background: "#d8dbe2",
						content2: "#F60E67",
						complement: "#78ffd6",
						content1: {
							DEFAULT: "#0e0920",
						},
					},
				},
			},
		}),
	],
};
