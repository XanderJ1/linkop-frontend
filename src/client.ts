import { HoudiniClient } from '$houdini';
import { auth } from '$stores/auth.store.svelte';

// In development use the Vite proxy path to avoid CORS
// In production use the full API URL
const url = import.meta.env.DEV ? '/graphql' : import.meta.env.VITE_APP_SERVER_API_URL;

export default new HoudiniClient({
	url,
	fetchParams() {
		if (!auth.accessToken) return {};

		return {
			headers: { Authorization: `Bearer ${auth.accessToken}` }
		};
	}
});
