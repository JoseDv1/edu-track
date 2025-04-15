// @ts-check
import { defineConfig } from "astro/config";
import honoAstro from "hono-astro-adapter";
import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
	integrations: [svelte()],
	output: "server",
	adapter: honoAstro(),
	vite: {
		server: {
			proxy: {
				"/api": "http://localhost:3000",
			},
		},
	},
});
