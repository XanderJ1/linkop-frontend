<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		description?: string;
		actions?: Snippet;
	}

	let { title, description, actions }: Props = $props();
</script>

<div class="flex flex-wrap items-center justify-between gap-4">
	<div class="min-w-0">
		<h1 class="text-[2rem] leading-tight font-semibold text-lo-ink">{title}</h1>
		{#if description}
			<p class="mt-1.5 text-base text-lo-mute-500">{description}</p>
		{/if}
	</div>
	{#if actions}
		<div class="flex items-center gap-2">
			{@render actions()}
		</div>
	{/if}
</div>
