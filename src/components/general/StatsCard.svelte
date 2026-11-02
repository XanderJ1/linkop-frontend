<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		label: string;
		value: number | string;
		/** Tailwind text color for the icon */
		accent?: string;
		icon?: Snippet;
	}

	let { label, value, accent = 'text-lo-violet', icon }: Props = $props();
</script>

<div class="lo-card flex items-center gap-3 p-3.5">
	{#if icon}
		<div class="shrink-0 {accent}">
			{@render icon()}
		</div>
	{/if}
	<div class="min-w-0">
		<p class="text-base leading-tight font-medium text-lo-ink tabular-nums">
			{typeof value === 'number' ? value.toLocaleString() : value}
		</p>
		<p class="truncate text-[13px] text-lo-mute-500">{label}</p>
	</div>
</div>
