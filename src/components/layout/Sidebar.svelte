<script lang="ts">
	import { page } from '$app/state';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import type { IconSvgElement } from '@hugeicons/svelte';
	import {
		Home01Icon,
		Calendar03Icon,
		Ticket01Icon,
		Radar01Icon,
		UserMultiple02Icon,
		Settings01Icon,
		Add01Icon
	} from '@hugeicons/core-free-icons';
	import Logo from '$components/custom/Logo.svelte';
	import UserCard from '$components/layout/UserCard.svelte';
	import { auth } from '$stores/auth.store.svelte';

	interface Props {
		collapsed: boolean;
	}

	let { collapsed }: Props = $props();

	interface NavItem {
		label: string;
		href: string;
		icon: IconSvgElement;
	}

	const baseNav: NavItem[] = [
		{ label: 'Home', href: '/dashboard', icon: Home01Icon },
		{ label: 'My events', href: '/events', icon: Calendar03Icon },
		{ label: 'Invites', href: '/invites', icon: Ticket01Icon },
		{ label: 'Nearby', href: '/nearby', icon: Radar01Icon }
	];

	const adminNav: NavItem[] = [{ label: 'People', href: '/people', icon: UserMultiple02Icon }];

	const settingsItem: NavItem = { label: 'Settings', href: '/settings', icon: Settings01Icon };

	const navItems = $derived(auth.userRole === 'ADMIN' ? [...baseNav, ...adminNav] : baseNav);
	const currentPath = $derived(page.url.pathname);

	function isActive(href: string): boolean {
		if (href === '/events')
			return currentPath === '/events' || /^\/events\/(?!create)/.test(currentPath);
		return currentPath.startsWith(href);
	}
</script>

{#snippet navLink(item: NavItem)}
	{@const active = isActive(item.href)}
	<a
		href={item.href}
		title={collapsed ? item.label : ''}
		aria-current={active ? 'page' : undefined}
		class="group flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-[14px] font-medium
			transition-all duration-200
			{active
			? 'bg-lo-lime text-lo-ink font-semibold'
			: 'text-lo-white/65 hover:bg-lo-white/8 hover:text-lo-white'}"
	>
		<span class="flex h-5 w-5 shrink-0 items-center justify-center">
			<HugeiconsIcon icon={item.icon} size={19} color="currentColor" strokeWidth={1.8} />
		</span>
		<span
			class="overflow-hidden truncate whitespace-nowrap transition-all duration-300
				{collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}"
		>
			{item.label}
		</span>
	</a>
{/snippet}

<aside
	class="fixed top-(--layout-gap) bottom-(--layout-gap) left-(--layout-gap) z-30 flex flex-col
		overflow-hidden rounded-(--layout-radius) bg-lo-ink transition-all duration-300 ease-in-out"
	style="width: {collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)'}"
>
	<!-- Ambient glow -->
	<div
		class="pointer-events-none absolute -top-16 -left-10 h-48 w-48 animate-float-slow rounded-full
			bg-lo-violet/45 blur-3xl"
	></div>
	<div
		class="pointer-events-none absolute -bottom-10 -right-16 h-44 w-44 animate-float rounded-full
			bg-lo-coral/25 blur-3xl"
	></div>

	<div class="relative flex min-h-16 items-center px-5 pt-5 pb-3">
		<a href="/dashboard" aria-label="LinkOp home">
			<Logo wordmark={!collapsed} tone="light" size={34} />
		</a>
	</div>

	<div class="relative px-3 pt-2 pb-4">
		<a
			href="/events/create"
			title={collapsed ? 'New event' : ''}
			class="btn-vibe flex h-11 items-center justify-center gap-2 rounded-2xl text-sm font-bold
				text-lo-white"
		>
			<HugeiconsIcon icon={Add01Icon} size={18} color="currentColor" strokeWidth={2.4} />
			{#if !collapsed}<span>New event</span>{/if}
		</a>
	</div>

	<nav class="relative flex flex-col gap-1 overflow-y-auto px-3" aria-label="Main">
		{#each navItems as item (item.href)}
			{@render navLink(item)}
		{/each}

		<div class="my-2 px-2">
			<div class="border-t border-dashed border-lo-white/15"></div>
		</div>

		{@render navLink(settingsItem)}
	</nav>

	<div class="flex-1"></div>
	<UserCard {collapsed} />
</aside>
