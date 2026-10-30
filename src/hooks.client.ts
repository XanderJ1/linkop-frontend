import type { HandleClientError } from '@sveltejs/kit';
import { initAuth } from '$stores/auth.store.svelte';

export async function init() {
	await initAuth();
}

// SvelteKit shows "Internal Error" for any unexpected error. In development,
// surface the real message on the error page so problems are easy to spot.
export const handleError: HandleClientError = ({ error, message }) => {
	console.error('[App] Unexpected error', error);
	return { message: import.meta.env.DEV && error instanceof Error ? error.message : message };
};
