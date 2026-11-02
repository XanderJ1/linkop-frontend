<script lang="ts">
	import { onMount } from 'svelte';
	import { Toaster } from 'svelte-sonner';
	import { page } from '$app/state';
	import Sidebar from '$components/layout/Sidebar.svelte';
	import Navbar from '$components/layout/Navbar.svelte';
	import AppLoader from '$components/custom/AppLoader.svelte';
	import Button from '$components/general/Button.svelte';
	import { auth, login, logout } from '$stores/auth.store.svelte';
	import { session, syncSession, resetSession } from '$stores/session.store.svelte';
	import { breadcrumbTitles } from '$stores/breadcrumb.store.svelte';

	let { children } = $props();

	let collapsed = $state(false);

	onMount(() => {
		if (window.innerWidth < 1024) collapsed = true;
	});

	// Redirect to login if not authenticated — preserve the full URL so the
	// user lands back on the exact page after login
	$effect(() => {
		if (auth.authReady && !auth.isAuthenticated) {
			login(page.url.pathname + page.url.search);
		}
	});

	// Make sure a LinkOp profile exists for this Keycloak account
	$effect(() => {
		if (auth.isAuthenticated && auth.currentUserId) syncSession();
	});

	const contentLeft = $derived(
		collapsed
			? 'calc(var(--sidebar-collapsed-width) + var(--layout-gap) * 2)'
			: 'calc(var(--sidebar-width) + var(--layout-gap) * 2)'
	);

	const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

	const SEGMENT_LABELS: Record<string, string> = {
		dashboard: 'Home',
		events: 'My events',
		create: 'New event',
		edit: 'Edit',
		invites: 'Invites',
		nearby: 'Nearby',
		people: 'People',
		settings: 'Settings'
	};

	const breadcrumbs = $derived(
		page.url.pathname
			.split('/')
			.filter(Boolean)
			.map((segment, i, arr) => ({
				label: uuidRegex.test(segment)
					? (breadcrumbTitles[segment] ?? '…')
					: (SEGMENT_LABELS[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1)),
				href: '/' + arr.slice(0, i + 1).join('/')
			}))
	);

	function retry() {
		resetSession();
		syncSession();
	}
</script>

<Toaster
	position="bottom-right"
	closeButton
	toastOptions={{
		duration: 5000,
		style:
			'background: #ffffff; color: #17112b; border: 1px solid #e6e0d9; box-shadow: 0 12px 32px -8px rgba(23,17,43,0.18); border-radius: 18px; font-family: inherit;'
	}}
/>

{#if !auth.authReady || !auth.isAuthenticated || !session.ready}
	<div class="flex min-h-screen items-center justify-center">
		<AppLoader />
	</div>
{:else if !session.user}
	<div class="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
		<h1 class="text-2xl font-bold">We couldn't get you in.</h1>
		<p class="max-w-sm text-sm text-lo-mute-500">
			{session.error ?? 'Something went wrong while loading your profile.'} Make sure the LinkOp API is
			running, then try again.
		</p>
		<div class="flex flex-wrap items-center justify-center gap-2.5">
			<Button variant="primary" onclick={retry}>Try again</Button>
			<Button variant="secondary" onclick={logout}>Log out</Button>
		</div>
	</div>
{:else}
	<Sidebar {collapsed} />

	<div
		class="fixed top-(--layout-gap) right-(--layout-gap) overflow-hidden rounded-(--layout-radius)
			bg-lo-white/85 backdrop-blur transition-all duration-300 ease-in-out"
		style="left: {contentLeft}; height: var(--navbar-height)"
	>
		<Navbar {breadcrumbs} sidebarCollapsed={collapsed} ontoggle={() => (collapsed = !collapsed)} />
	</div>

	<div
		class="fixed right-(--layout-gap) bottom-(--layout-gap) overflow-hidden
			rounded-(--layout-radius) transition-all duration-300 ease-in-out"
		style="left: {contentLeft}; top: calc(var(--navbar-height) + var(--layout-gap) * 2)"
	>
		<main class="h-full overflow-y-auto px-2 py-4 sm:px-6">
			<div class="mx-auto max-w-6xl">
				{@render children()}
			</div>
		</main>
	</div>
{/if}
