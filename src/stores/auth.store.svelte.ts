import { browser } from '$app/environment';

const REFRESH_MIN_VALIDITY_SECONDS = 300;
const REFRESH_INTERVAL_MS = 30_000;

let keycloak: import('keycloak-js').default | null = null;
let initPromise: Promise<void> | null = null;
let refreshInterval: ReturnType<typeof setInterval> | null = null;
let loginStarted = false;

async function getKeycloak() {
	if (keycloak) return keycloak;
	const url = import.meta.env.VITE_KEYCLOAK_URL;
	const realm = import.meta.env.VITE_KEYCLOAK_REALM;
	const clientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID;
	// Without these keycloak-js builds a relative "undefined/protocol/…" URL and
	// redirects back to this site in an endless loop, so refuse to start instead.
	if (!url || !realm || !clientId) {
		console.error(
			'[Auth] Missing VITE_KEYCLOAK_URL, VITE_KEYCLOAK_REALM or VITE_KEYCLOAK_CLIENT_ID at build time'
		);
		return null;
	}
	const Keycloak = (await import('keycloak-js')).default;
	keycloak = new Keycloak({ url, realm, clientId });
	return keycloak;
}

// The backend checks the Keycloak realm roles "Admin" and "User" (see AuthContext.cs)
function readRole(): 'ADMIN' | 'USER' {
	const realmRoles: string[] = keycloak?.tokenParsed?.['realm_access']?.roles ?? [];
	return realmRoles.some((r) => r.toUpperCase() === 'ADMIN') ? 'ADMIN' : 'USER';
}

async function syncAuthState() {
	if (!keycloak) return;
	auth.isAuthenticated = keycloak.authenticated ?? false;
	auth.accessToken = keycloak.token ?? null;
	auth.userRole = readRole();
	if (keycloak.authenticated) {
		const t = keycloak.tokenParsed as Record<string, string> | undefined;
		auth.currentUserFirstName = t?.given_name ?? null;
		auth.currentUserLastName = t?.family_name ?? null;
		auth.currentUserEmail = t?.email ?? null;
		auth.currentUser =
			[auth.currentUserFirstName, auth.currentUserLastName].filter(Boolean).join(' ') ||
			t?.preferred_username ||
			null;
		auth.currentUserId = keycloak.subject ?? null;
	}
}

async function refreshToken(): Promise<string | null> {
	const client = await getKeycloak();
	if (!client?.authenticated) return null;
	try {
		await client.updateToken(REFRESH_MIN_VALIDITY_SECONDS);
		auth.accessToken = client.token ?? null;
		auth.userRole = readRole();
		return auth.accessToken;
	} catch (err) {
		console.warn('[Auth] Token refresh failed — attempting re-login', err);
		stopProactiveRefresh();
		auth.isAuthenticated = false;
		auth.accessToken = null;
		loginStarted = false;
		await login(window.location.pathname + window.location.search);
		return null;
	}
}

function startProactiveRefresh() {
	stopProactiveRefresh();
	refreshInterval = setInterval(async () => {
		if (keycloak?.authenticated) {
			await refreshToken();
		}
	}, REFRESH_INTERVAL_MS);
}

function stopProactiveRefresh() {
	if (refreshInterval) {
		clearInterval(refreshInterval);
		refreshInterval = null;
	}
}

export const auth = $state({
	isAuthenticated: false,
	accessToken: null as string | null,
	currentUser: null as string | null,
	currentUserFirstName: null as string | null,
	currentUserLastName: null as string | null,
	currentUserEmail: null as string | null,
	/** Keycloak subject (`sub`) */
	currentUserId: null as string | null,
	userRole: null as 'ADMIN' | 'USER' | null,
	authReady: false
});

export async function initAuth() {
	if (!browser) return;
	if (initPromise) return initPromise;
	initPromise = (async () => {
		try {
			const client = await getKeycloak();
			if (!client) return;
			await client.init({
				onLoad: 'check-sso',
				pkceMethod: 'S256',
				checkLoginIframe: false
			});
			await syncAuthState();
			if (client.authenticated) startProactiveRefresh();

			client.onAuthSuccess = () => {
				syncAuthState();
				startProactiveRefresh();
			};

			client.onAuthRefreshSuccess = () => {
				auth.accessToken = client.token ?? null;
				auth.userRole = readRole();
			};

			client.onAuthRefreshError = () => {
				console.warn('[Auth] Keycloak refresh error — forcing re-login');
				stopProactiveRefresh();
				auth.isAuthenticated = false;
				auth.accessToken = null;
				loginStarted = false;
				login(window.location.pathname + window.location.search);
			};

			client.onAuthLogout = () => {
				stopProactiveRefresh();
				auth.isAuthenticated = false;
				auth.currentUser = null;
				auth.currentUserFirstName = null;
				auth.currentUserLastName = null;
				auth.currentUserId = null;
				auth.currentUserEmail = null;
				auth.userRole = null;
				auth.accessToken = null;
				loginStarted = false;
			};

			client.onTokenExpired = () => {
				refreshToken().catch(() => {});
			};

			document.addEventListener('visibilitychange', () => {
				if (document.visibilityState === 'visible' && client.authenticated) {
					refreshToken().catch(() => {});
				}
			});
		} catch {
			console.warn('Auth init failed — rendering unauthenticated');
		} finally {
			auth.authReady = true;
		}
	})();
	return initPromise;
}

export async function login(redirectPath: string) {
	const client = await getKeycloak();
	if (!client || loginStarted) return;
	loginStarted = true;
	return client.login({
		redirectUri: `${window.location.origin}${redirectPath}`
	});
}

export async function openAccountConsole() {
	const client = await getKeycloak();
	return client?.accountManagement();
}

export function logout() {
	loginStarted = false;
	stopProactiveRefresh();
	return keycloak?.logout({
		redirectUri: window.location.origin
	});
}

export { refreshToken };
