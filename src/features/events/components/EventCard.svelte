<script lang="ts">
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { Location01Icon } from '@hugeicons/core-free-icons';
	import Badge from '$components/general/Badge.svelte';
	import EventCover from '$features/events/components/EventCover.svelte';
	import CategoryBadge from '$features/events/components/CategoryBadge.svelte';
	import UserAvatar from '$features/users/components/UserAvatar.svelte';
	import { formatTime } from '$lib/helpers/datetime';
	import { goingCount, isUpcoming, type EventSummary } from '$features/events/services/types';

	interface Props {
		event: EventSummary;
		/** Shows "By …" instead of the guest count */
		showHost?: boolean;
		role?: 'hosting' | 'invited';
		index?: number;
	}

	let { event, showHost = false, role, index = 0 }: Props = $props();

	const past = $derived(!isUpcoming(event));
	const going = $derived(goingCount(event));
</script>

<a
	href="/events/{event.id}"
	class="lo-card flex animate-rise gap-4 p-3.5 transition-shadow duration-200 hover:shadow-card-hover
		sm:p-4"
	style="animation-delay: {Math.min(index, 8) * 40}ms"
>
	<div class="min-w-0 flex-1">
		<p class="text-sm text-lo-mute-500">
			{formatTime(event.eventDate)}
			{#if past}<span> · Ended</span>{/if}
		</p>
		<h3 class="mt-0.5 line-clamp-2 text-lg leading-snug font-medium text-lo-ink">
			{event.eventName}
		</h3>

		{#if showHost && event.creator}
			<p class="mt-1.5 flex items-center gap-1.5 truncate text-sm text-lo-mute-500">
				<UserAvatar
					firstName={event.creator.firstname}
					lastName={event.creator.lastname}
					id={event.creator.id}
					photoUrl={event.creator.profilePictureUrl}
					size="xs"
				/>
				<span class="truncate">By {event.creator.firstname} {event.creator.lastname}</span>
			</p>
		{/if}

		<p class="mt-1 flex items-center gap-1.5 text-sm text-lo-mute-500">
			<HugeiconsIcon icon={Location01Icon} size={14} color="currentColor" strokeWidth={2} />
			<span class="truncate">{event.locationName}</span>
		</p>

		<div class="mt-2.5 flex flex-wrap items-center gap-1.5">
			{#if role}
				<Badge size="xs" variant={role === 'hosting' ? 'strong' : 'violet'}>
					{role === 'hosting' ? 'Hosting' : 'Invited'}
				</Badge>
			{/if}
			<CategoryBadge category={event.category} size="xs" />
			{#if !showHost}
				<span class="text-xs text-lo-mute-500">{event.guests.length} invited · {going} going</span>
			{/if}
		</div>
	</div>

	<EventCover
		pictureUrl={event.pictureUrl}
		seed={event.id}
		class="size-22 shrink-0 rounded-lg sm:size-28"
	/>
</a>
