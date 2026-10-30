<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title?: string;
		description?: string;
		icon?: Snippet;
		actions?: Snippet;
	}

	let {
		title = 'Nothing here yet',
		description = 'Try adjusting your search or filters',
		icon,
		actions
	}: Props = $props();
</script>

<div
	class="flex flex-col items-center justify-center rounded-3xl border border-dashed border-lo-mute-300
		bg-lo-white/60 px-6 py-14 text-center"
>
	{#if icon}
		<div
			class="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-lo-lime text-lo-ink
				-rotate-6"
		>
			{@render icon()}
		</div>
	{/if}
	<p class="font-display text-lg font-bold text-lo-ink">{title}</p>
	<p class="mt-1 max-w-sm text-sm text-lo-mute-500">{description}</p>
	{#if actions}
		<div class="mt-5">
			{@render actions()}
		</div>
	{/if}
</div>
