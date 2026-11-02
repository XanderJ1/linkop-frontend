<script lang="ts">
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import Badge from '$components/general/Badge.svelte';
	import { vibeFor } from '$features/events/services/categories';

	interface Props {
		category: string | null | undefined;
		size?: 'xs' | 'sm';
	}

	let { category, size = 'sm' }: Props = $props();

	const vibe = $derived(vibeFor(category));
</script>

<Badge {size} class={vibe.pill}>
	{#snippet icon()}
		<HugeiconsIcon
			icon={vibe.icon}
			size={size === 'xs' ? 11 : 13}
			color="currentColor"
			strokeWidth={2}
		/>
	{/snippet}
	{vibe.label}
</Badge>
