import houdini from 'houdini/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');

	return {
		plugins: [houdini(), tailwindcss(), sveltekit()],
		optimizeDeps: {
			include: ['svelte-sonner']
		},
		server: {
			port: 5173,
			proxy: {
				// The backend has no CORS origins configured yet, so in dev every
				// GraphQL call goes through this proxy instead of hitting :8000 directly.
				'/graphql': {
					target: env.VITE_APP_SERVER_ORIGIN || 'http://localhost:8000',
					changeOrigin: true
				}
			}
		}
	};
});
