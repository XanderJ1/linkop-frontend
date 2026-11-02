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

<div class="flex flex-col items-center justify-center px-6 py-16 text-center">
	{#if icon}
		<div class="mb-4 flex h-14 w-14 items-center justify-center text-lo-mute-300">
			{@render icon()}
		</div>
	{/if}
	<p class="text-xl font-semibold text-lo-mute-700">{title}</p>
	<p class="mt-1.5 max-w-sm text-sm text-lo-mute-500">{description}</p>
	{#if actions}
		<div class="mt-5">
			{@render actions()}
		</div>
	{/if}
</div>
