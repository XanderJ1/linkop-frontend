<script lang="ts">
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { Location01Icon, UserGroupIcon } from '@hugeicons/core-free-icons';
	import EventCover from '$features/events/components/EventCover.svelte';
	import CategoryBadge from '$features/events/components/CategoryBadge.svelte';
	import UserAvatar from '$features/users/components/UserAvatar.svelte';
	import { formatTime } from '$lib/helpers/datetime';
	import { goingCount, isUpcoming, type EventSummary } from '$features/events/services/types';

	interface Props {
		event: EventSummary;
		/** Shows "Hosted by …" instead of the guest count */
		showHost?: boolean;
		index?: number;
	}

	let { event, showHost = false, index = 0 }: Props = $props();

	const date = $derived(new Date(event.eventDate));
	const month = $derived(date.toLocaleString('en-US', { month: 'short' }).toUpperCase());
	const day = $derived(date.getDate());
	const weekday = $derived(date.toLocaleString('en-US', { weekday: 'short' }));
	const past = $derived(!isUpcoming(event));
	const going = $derived(goingCount(event));
</script>

<a
	href="/events/{event.id}"
	class="group flex animate-rise flex-col overflow-hidden rounded-[26px] border border-lo-mute-200/70
		bg-lo-white transition-all duration-300 hover:-translate-y-1
		hover:shadow-[0_22px_40px_-22px_rgba(23,17,43,0.45)] {past ? 'opacity-70' : ''}"
	style="animation-delay: {Math.min(index, 8) * 50}ms"
>
	<EventCover
		pictureUrl={event.pictureUrl}
		seed={event.id}
		class="h-40 transition-transform duration-500"
	>
		<div class="flex h-full items-start justify-between p-3.5">
			<CategoryBadge category={event.category} size="xs" glass />
			<div
				class="flex w-13 flex-col items-center rounded-2xl bg-lo-white py-1.5 shadow-lg
					transition-transform duration-300 group-hover:-rotate-6"
			>
				<span class="text-[10px] font-bold tracking-wider text-lo-coral">{month}</span>
				<span class="font-display text-2xl leading-none font-extrabold text-lo-ink">{day}</span>
			</div>
		</div>
	</EventCover>

	<div class="flex flex-1 flex-col gap-2 p-4">
		<p class="text-xs font-semibold text-lo-violet">
			{weekday} · {formatTime(event.eventDate)}
			{#if past}<span class="text-lo-mute-400"> · Ended</span>{/if}
		</p>
		<h3 class="line-clamp-2 text-lg leading-snug font-bold text-lo-ink">{event.eventName}</h3>
		<p class="flex items-center gap-1.5 truncate text-[13px] text-lo-mute-500">
			<HugeiconsIcon icon={Location01Icon} size={14} color="currentColor" strokeWidth={1.8} />
			<span class="truncate">{event.locationName}</span>
		</p>

		<div class="mt-auto flex items-center justify-between pt-2">
			{#if showHost && event.creator}
				<span class="flex items-center gap-2 text-xs text-lo-mute-500">
					<UserAvatar
						firstName={event.creator.firstname}
						lastName={event.creator.lastname}
						id={event.creator.id}
						photoUrl={event.creator.profilePictureUrl}
						size="xs"
					/>
					Hosted by {event.creator.firstname}
				</span>
			{:else}
				<span class="flex items-center gap-1.5 text-xs font-medium text-lo-mute-500">
					<HugeiconsIcon icon={UserGroupIcon} size={14} color="currentColor" strokeWidth={1.8} />
					{event.guests.length} invited · {going} going
				</span>
			{/if}
			<span
				class="flex h-8 w-8 items-center justify-center rounded-full bg-lo-mute-100 text-lo-ink
					transition-all duration-300 group-hover:bg-lo-lime"
				aria-hidden="true">→</span
			>
		</div>
	</div>
</a>
