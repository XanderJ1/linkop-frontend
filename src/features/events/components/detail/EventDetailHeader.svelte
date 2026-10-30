<script lang="ts">
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { Calendar03Icon, Location01Icon, SquareLock02Icon } from '@hugeicons/core-free-icons';
	import EventCover from '$features/events/components/EventCover.svelte';
	import CategoryBadge from '$features/events/components/CategoryBadge.svelte';
	import Countdown from '$features/events/components/Countdown.svelte';
	import { formatDateTime } from '$lib/helpers/datetime';
	import {
		isUpcoming,
		mapsUrl,
		relativeWhen,
		type EventSummary
	} from '$features/events/services/types';

	interface Props {
		event: EventSummary;
		isHost: boolean;
	}

	let { event, isHost }: Props = $props();

	const upcoming = $derived(isUpcoming(event));
</script>

<EventCover pictureUrl={event.pictureUrl} seed={event.id} animated class="min-h-80 rounded-[32px]">
	<div
		class="flex h-full min-h-80 flex-col justify-between gap-6 bg-gradient-to-t from-lo-ink/60 via-lo-ink/10 to-transparent p-6 sm:p-8"
	>
		<div class="flex flex-wrap items-center gap-2">
			<CategoryBadge category={event.category} glass />
			<span
				class="rounded-full px-3 py-1 text-xs font-bold
					{isHost ? 'bg-lo-lime text-lo-ink' : 'bg-lo-white/85 text-lo-ink backdrop-blur'}"
			>
				{isHost ? "You're hosting" : "You're invited"}
			</span>
			{#if event.privacy === 'PRIVATE'}
				<span
					class="flex items-center gap-1 rounded-full bg-lo-ink/70 px-3 py-1 text-xs font-bold text-lo-white backdrop-blur"
				>
					<HugeiconsIcon icon={SquareLock02Icon} size={12} color="currentColor" strokeWidth={2.2} />
					Private
				</span>
			{/if}
		</div>

		<div class="flex flex-wrap items-end justify-between gap-6">
			<div class="max-w-2xl">
				<h1 class="text-4xl leading-[1.05] font-extrabold text-white drop-shadow-md sm:text-5xl">
					{event.eventName}
				</h1>
				<div class="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-white/90">
					<span class="flex items-center gap-1.5">
						<HugeiconsIcon icon={Calendar03Icon} size={16} color="currentColor" strokeWidth={2} />
						{formatDateTime(event.eventDate)}
					</span>
					{#if event.eventLocation}
						<a
							href={mapsUrl(event.eventLocation)}
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center gap-1.5 underline-offset-4 hover:underline"
						>
							<HugeiconsIcon icon={Location01Icon} size={16} color="currentColor" strokeWidth={2} />
							{event.locationName}
						</a>
					{:else}
						<span class="flex items-center gap-1.5">
							<HugeiconsIcon icon={Location01Icon} size={16} color="currentColor" strokeWidth={2} />
							{event.locationName}
						</span>
					{/if}
				</div>
			</div>

			{#if upcoming}
				<Countdown to={event.eventDate} tone="light" />
			{:else}
				<span
					class="rounded-full bg-lo-white/85 px-4 py-2 text-sm font-bold text-lo-ink backdrop-blur"
				>
					Wrapped {relativeWhen(event.eventDate)}
				</span>
			{/if}
		</div>
	</div>
</EventCover>
