import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";
import { svelte } from "@sveltejs/vite-plugin-svelte";

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// --------------------------------------------------

export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, "src/index.ts"),
			name: "SquircleLib",
			fileName: "squircle-lib",
		},
		rollupOptions: {
			external: [/^lit/, /^svelte/],
			output: {
				globals: {
					lit: "Lit",
					svelte: "Svelte",
				},
			},
		},
	},
	plugins: [
		svelte({
			compilerOptions: { runes: true },
		}),
		dts({ rollupTypes: true }),
	],
});
