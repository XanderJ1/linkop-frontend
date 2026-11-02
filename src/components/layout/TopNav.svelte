<script lang="ts">
	import { onDestroy } from 'svelte';
	import { page } from '$app/state';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import type { IconSvgElement } from '@hugeicons/svelte';
	import {
		Home01Icon,
		Calendar03Icon,
		Ticket01Icon,
		Radar01Icon,
		UserMultiple02Icon
	} from '@hugeicons/core-free-icons';
	import Logo from '$components/custom/Logo.svelte';
	import UserMenu from '$components/layout/UserMenu.svelte';
	import UserAvatar from '$features/users/components/UserAvatar.svelte';
	import { auth } from '$stores/auth.store.svelte';
	import { session } from '$stores/session.store.svelte';

	interface NavItem {
		label: string;
		href: string;
		icon: IconSvgElement;
	}

	const baseNav: NavItem[] = [
		{ label: 'Home', href: '/dashboard', icon: Home01Icon },
		{ label: 'Events', href: '/events', icon: Calendar03Icon },
		{ label: 'Invites', href: '/invites', icon: Ticket01Icon },
		{ label: 'Nearby', href: '/nearby', icon: Radar01Icon }
	];

	const adminNav: NavItem[] = [{ label: 'People', href: '/people', icon: UserMultiple02Icon }];

	const navItems = $derived(auth.userRole === 'ADMIN' ? [...baseNav, ...adminNav] : baseNav);
	const currentPath = $derived(page.url.pathname);

	let menuOpen = $state(false);

	const clockFormat = new Intl.DateTimeFormat('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		timeZoneName: 'short'
	});
	let clock = $state(clockFormat.format(new Date()));
	const timer = setInterval(() => (clock = clockFormat.format(new Date())), 30_000);
	onDestroy(() => clearInterval(timer));

	function isActive(href: string): boolean {
		if (href === '/events')
			return currentPath === '/events' || /^\/events\/(?!create)/.test(currentPath);
		return currentPath.startsWith(href);
	}
</script>

<header class="sticky top-0 z-40 bg-lo-page/60 backdrop-blur-md">
	<div class="flex h-14 items-center justify-between gap-3 px-4">
		<div class="flex min-w-0 items-center gap-3 sm:gap-6">
			<a href="/dashboard" aria-label="LinkOp home" class="shrink-0">
				<span class="sm:hidden"><Logo wordmark={false} size={26} /></span>
				<span class="hidden sm:block"><Logo size={26} /></span>
			</a>

			<nav class="flex items-center gap-0.5 sm:gap-1" aria-label="Main">
				{#each navItems as item (item.href)}
					{@const active = isActive(item.href)}
					<a
						href={item.href}
						title={item.label}
						aria-label={item.label}
						aria-current={active ? 'page' : undefined}
						class="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium transition-colors
							{active ? 'text-lo-ink' : 'text-lo-mute-500 hover:text-lo-ink'}"
					>
						<HugeiconsIcon icon={item.icon} size={16} color="currentColor" strokeWidth={2} />
						<span class="hidden md:inline">{item.label}</span>
					</a>
				{/each}
			</nav>
		</div>

		<div class="flex shrink-0 items-center gap-3 sm:gap-4">
			<span class="hidden text-sm text-lo-mute-500 tabular-nums lg:inline">{clock}</span>
			<a
				href="/events/create"
				class="text-sm font-medium whitespace-nowrap text-lo-mute-600 transition-colors hover:text-lo-ink"
			>
				<span class="sm:hidden">Create</span>
				<span class="hidden sm:inline">Create Event</span>
			</a>
			<div class="relative">
				<button
					onclick={() => (menuOpen = !menuOpen)}
					aria-label="Account menu"
					aria-expanded={menuOpen}
					class="flex cursor-pointer rounded-full"
				>
					<UserAvatar
						firstName={session.user?.firstname}
						lastName={session.user?.lastname}
						id={session.user?.id}
						photoUrl={session.user?.profilePictureUrl}
						size="xs"
					/>
				</button>
				{#if menuOpen}
					<UserMenu onclose={() => (menuOpen = false)} />
				{/if}
			</div>
		</div>
	</div>
</header>
