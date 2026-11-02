<script lang="ts">
	import { Toaster } from 'svelte-sonner';
	import { page } from '$app/state';
	import TopNav from '$components/layout/TopNav.svelte';
	import AppLoader from '$components/custom/AppLoader.svelte';
	import Button from '$components/general/Button.svelte';
	import { auth, login, logout } from '$stores/auth.store.svelte';
	import { session, syncSession, resetSession } from '$stores/session.store.svelte';

	let { children } = $props();

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
			'background: #ffffff; color: #131517; border: 1px solid rgba(19,21,23,0.06); box-shadow: 0 3px 3px #00000008, 0 8px 7px #0000000a, 0 17px 14px #0000000d; border-radius: 12px; font-family: inherit;'
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
	<div class="relative isolate min-h-screen">
		<div class="lo-wash"></div>
		<TopNav />
		<main class="mx-auto w-full max-w-205 px-4 pt-6 pb-16">
			{@render children()}
		</main>
	</div>
{/if}
