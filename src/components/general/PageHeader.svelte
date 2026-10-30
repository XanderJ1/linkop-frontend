<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		description?: string;
		eyebrow?: string;
		actions?: Snippet;
	}

	let { title, description, eyebrow, actions }: Props = $props();
</script>

<div class="flex flex-wrap items-end justify-between gap-4">
	<div>
		{#if eyebrow}
			<p class="mb-1 text-xs font-bold tracking-[0.14em] text-lo-violet uppercase">{eyebrow}</p>
		{/if}
		<h1 class="text-3xl font-bold text-lo-ink">{title}</h1>
		{#if description}
			<p class="mt-1 text-sm text-lo-mute-500">{description}</p>
		{/if}
	</div>
	{#if actions}
		<div class="flex items-center gap-2.5">
			{@render actions()}
		</div>
	{/if}
</div>
