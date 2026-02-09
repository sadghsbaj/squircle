import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";

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
			external: [/^lit/],

			output: {
				globals: {
					lit: "Lit",
					"lit/decorators.js": "LitDecorators",
				},
			},
		},
	},
	plugins: [dts({ rollupTypes: true })],
});
