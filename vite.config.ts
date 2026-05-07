import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { analyzer } from 'vite-bundle-analyzer';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit(), analyzer()],
	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:8080',
				rewrite: (path) => path.replace(/^\/api/, '')
			}
		}
	}
});
