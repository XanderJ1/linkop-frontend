<script lang="ts">
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { LayoutLeftIcon, SidebarLeft01Icon, Add01Icon } from '@hugeicons/core-free-icons';
	import Button from '$components/general/Button.svelte';
	import { auth } from '$stores/auth.store.svelte';

	interface Props {
		breadcrumbs?: { label: string; href?: string }[];
		sidebarCollapsed?: boolean;
		ontoggle?: () => void;
	}

	let { breadcrumbs = [], sidebarCollapsed = false, ontoggle }: Props = $props();

	const greeting = $derived.by(() => {
		const h = new Date().getHours();
		if (h < 12) return 'Good morning';
		if (h < 18) return 'Good afternoon';
		return 'Good evening';
	});
</script>

<header class="flex h-full items-center justify-between gap-4 px-5">
	<div class="flex min-w-0 items-center gap-3 text-[13.5px]">
		<button
			onclick={ontoggle}
			title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
			aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
			class="cursor-pointer rounded-xl p-2 text-lo-mute-600 transition-colors hover:bg-lo-mute-100
				hover:text-lo-ink"
		>
			<HugeiconsIcon
				icon={sidebarCollapsed ? LayoutLeftIcon : SidebarLeft01Icon}
				size={18}
				color="currentColor"
				strokeWidth={1.6}
			/>
		</button>

		<span class="h-4 w-px bg-lo-mute-200"></span>

		<nav class="flex min-w-0 items-center gap-2" aria-label="Breadcrumb">
			{#each breadcrumbs as crumb, i (crumb.href)}
				{#if i < breadcrumbs.length - 1}
					<a
						href={crumb.href}
						class="truncate text-lo-mute-400 transition-colors hover:text-lo-ink"
					>
						{crumb.label}
					</a>
					<span class="text-lo-mute-300">/</span>
				{:else}
					<span class="truncate font-semibold text-lo-ink">{crumb.label}</span>
				{/if}
			{/each}
		</nav>
	</div>

	<div class="flex items-center gap-3">
		<p class="hidden text-sm text-lo-mute-500 md:block">
			{greeting}{auth.currentUserFirstName ? `, ${auth.currentUserFirstName}` : ''}
		</p>
		<Button variant="primary" size="sm" href="/events/create">
			<HugeiconsIcon icon={Add01Icon} size={14} color="currentColor" strokeWidth={2.4} />
			Host
		</Button>
	</div>
</header>
