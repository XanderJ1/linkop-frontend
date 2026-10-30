import { FetchMeStore, RegisterStore } from '$houdini';
import { auth } from '$stores/auth.store.svelte';

export interface BackendUser {
	id: string;
	keycloakSub: string;
	firstname: string;
	lastname: string;
	email: string;
	role: string;
	phoneNumber: string | null;
	profilePictureUrl: string | null;
	created_at: string;
}

const fetchMe = new FetchMeStore();
const register = new RegisterStore();

/**
 * Links the Keycloak login to a LinkOp `UserContext` row. Most queries
 * (myEvents, invitedEvents, …) look the user up by `keycloakSub`, so the row
 * must exist before the app is usable — if it doesn't, we register it.
 */
export const session = $state({
	user: null as BackendUser | null,
	ready: false,
	error: null as string | null
});

let syncPromise: Promise<void> | null = null;

async function lookup(sub: string) {
	const result = await fetchMe.fetch({ variables: { sub }, policy: 'NetworkOnly' });
	return (result.data?.fetchUsers?.nodes?.[0] as BackendUser | undefined) ?? null;
}

export function syncSession() {
	if (syncPromise) return syncPromise;
	syncPromise = (async () => {
		const sub = auth.currentUserId;
		if (!sub) return;
		try {
			let user = await lookup(sub);
			if (!user) {
				await register.mutate({
					input: {
						keycloakSub: sub,
						email: auth.currentUserEmail ?? '',
						firstName: auth.currentUserFirstName ?? '',
						lastName: auth.currentUserLastName ?? ''
					}
				});
				user = await lookup(sub);
			}
			session.user = user;
			session.error = user ? null : 'We could not set up your LinkOp profile.';
		} catch (err) {
			console.error('[Session] sync failed', err);
			session.error = 'We could not reach the LinkOp server.';
		} finally {
			session.ready = true;
		}
	})();
	return syncPromise;
}

export function resetSession() {
	syncPromise = null;
	session.user = null;
	session.ready = false;
	session.error = null;
}
