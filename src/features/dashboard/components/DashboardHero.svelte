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

<section class="pt-6 pb-2">
	<p class="text-base text-lo-mute-500">{greeting}{firstName ? `, ${firstName}` : ''}</p>
	<h1 class="mt-2 text-5xl leading-[1.05] font-medium tracking-tight text-lo-ink sm:text-6xl">
		What are we<br />
		<span class="lo-gradient-text inline-block pb-1.5">getting into?</span>
	</h1>
	<p class="mt-4 max-w-md text-lg leading-relaxed text-lo-mute-500">
		Throw a party, gather the crew or book the boardroom. Your people and plans, in one place.
	</p>
	<div class="mt-6 flex flex-wrap items-center gap-5">
		<Button size="lg" href="/events/create">Create Event</Button>
		<a
			href="/invites"
			class="flex items-center gap-1 text-[15px] text-lo-mute-500 transition-colors hover:text-lo-ink"
		>
			See my invites
			<HugeiconsIcon icon={ArrowRight01Icon} size={15} color="currentColor" strokeWidth={2} />
		</a>
	</div>
</section>
