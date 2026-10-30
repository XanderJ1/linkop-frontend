<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		label: string;
		value: number | string;
		description?: string;
		/** Tailwind classes for the icon tile */
		accent?: string;
		icon?: Snippet;
	}

	let {
		label,
		value,
		description,
		accent = 'bg-lo-violet/10 text-lo-violet',
		icon
	}: Props = $props();
</script>

<div class="lo-card flex items-start justify-between gap-3 p-5">
	<div>
		<p class="text-[13px] font-semibold text-lo-mute-500">{label}</p>
		<p class="mt-1 font-display text-4xl font-bold text-lo-ink tabular-nums">
			{typeof value === 'number' ? value.toLocaleString() : value}
		</p>
		{#if description}
			<p class="mt-1 text-xs text-lo-mute-400">{description}</p>
		{/if}
	</div>
	{#if icon}
		<div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl {accent}">
			{@render icon()}
		</div>
	{/if}
</div>
