<script lang="ts">
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { ArrowRight01Icon } from '@hugeicons/core-free-icons';
	import Button from '$components/general/Button.svelte';

	interface Props {
		firstName: string;
	}

	let { firstName }: Props = $props();

	const greeting = $derived.by(() => {
		const h = new Date().getHours();
		if (h < 12) return 'Good morning';
		if (h < 18) return 'Good afternoon';
		return 'Good evening';
	});
</script>

<section class="flex flex-wrap items-center justify-between gap-4">
	<p class="text-base text-lo-mute-500">{greeting}{firstName ? `, ${firstName}` : ''}</p>
	<div class="flex flex-wrap items-center gap-4">
		<Button href="/events/create">Create Event</Button>
		<a
			href="/invites"
			class="flex items-center gap-1 text-sm text-lo-mute-500 transition-colors hover:text-lo-ink"
		>
			See my invites
			<HugeiconsIcon icon={ArrowRight01Icon} size={15} color="currentColor" strokeWidth={2} />
		</a>
	</div>
</section>
