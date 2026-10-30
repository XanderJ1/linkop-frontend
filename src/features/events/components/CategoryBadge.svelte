<script lang="ts">
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import Badge from '$components/general/Badge.svelte';
	import { vibeFor } from '$features/events/services/categories';

	interface Props {
		category: string | null | undefined;
		size?: 'xs' | 'sm';
		/** Frosted look for use on top of covers */
		glass?: boolean;
	}

	let { category, size = 'sm', glass = false }: Props = $props();

	const vibe = $derived(vibeFor(category));
</script>

<Badge
	{size}
	class={glass ? 'bg-lo-white/85 text-lo-ink border-lo-white/60 backdrop-blur' : vibe.pill}
>
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
