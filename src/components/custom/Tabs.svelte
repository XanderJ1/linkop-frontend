<script lang="ts">
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import type { IconSvgElement } from '@hugeicons/svelte';

	interface Tab {
		id: string;
		label: string;
		icon?: IconSvgElement;
	}

	interface Props {
		tabs: Tab[];
		activeTab: string;
		counts?: Record<string, number>;
	}

	let { tabs, activeTab = $bindable(), counts = {} }: Props = $props();

	let tabRefs = $state<Record<string, HTMLButtonElement>>({});
	let pillStyle = $state('width: 0px; left: 0px;');

	function updatePill() {
		const el = tabRefs[activeTab];
		if (!el) return;
		pillStyle = `width: ${el.offsetWidth}px; left: ${el.offsetLeft}px;`;
	}

	$effect(() => {
		void activeTab;
		void tabs;
		void counts;
		// Double rAF — lets Svelte flush the DOM and the browser finish layout
		// so offsetWidth is accurate.
		requestAnimationFrame(() => requestAnimationFrame(updatePill));
	});
</script>

<div
	class="relative inline-flex items-center gap-1 rounded-full bg-lo-mute-200/70 p-1"
	role="tablist"
>
	<span
		class="absolute top-1 bottom-1 rounded-full bg-lo-ink transition-all duration-300 ease-out"
		style={pillStyle}
	></span>

	{#each tabs as tab (tab.id)}
		<button
			type="button"
			role="tab"
			aria-selected={activeTab === tab.id}
			bind:this={tabRefs[tab.id]}
			onclick={() => (activeTab = tab.id)}
			class="relative z-10 flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm
				font-semibold transition-colors duration-150
				{activeTab === tab.id ? 'text-lo-white' : 'text-lo-mute-600 hover:text-lo-ink'}"
		>
			{#if tab.icon}
				<HugeiconsIcon icon={tab.icon} size={15} color="currentColor" strokeWidth={2} />
			{/if}
			{tab.label}
			{#if counts[tab.id] !== undefined}
				<span
					class="rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums
						{activeTab === tab.id ? 'bg-lo-lime text-lo-ink' : 'bg-lo-white text-lo-mute-600'}"
				>
					{counts[tab.id]}
				</span>
			{/if}
		</button>
	{/each}
</div>
