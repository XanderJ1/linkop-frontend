<script lang="ts">
	import EventCover from '$features/events/components/EventCover.svelte';
	import CategoryBadge from '$features/events/components/CategoryBadge.svelte';
	import Skeleton from '$components/custom/Skeleton.svelte';
	import { formatTime } from '$lib/helpers/datetime';
	import { relativeWhen, type EventSummary } from '$features/events/services/types';

	interface Props {
		events: (EventSummary & { role: 'hosting' | 'invited' })[];
		loading: boolean;
	}

	let { events, loading }: Props = $props();
</script>

<section class="lo-card p-5">
	<div class="mb-2 flex items-center justify-between">
		<h2 class="text-xl font-bold">On the calendar</h2>
		<a href="/events" class="text-sm font-semibold text-lo-violet hover:underline">See all</a>
	</div>

	{#if loading}
		<div class="space-y-3 pt-2">
			{#each Array(3) as _, i (i)}
				<div class="flex items-center gap-3">
					<Skeleton variant="block" width="56px" height="56px" />
					<div class="flex-1 space-y-2">
						<Skeleton width="60%" />
						<Skeleton width="35%" height="12px" />
					</div>
				</div>
			{/each}
		</div>
	{:else if events.length === 0}
		<p class="py-10 text-center text-sm text-lo-mute-500">
			Nothing scheduled. <a href="/events/create" class="font-semibold text-lo-violet"
				>Plan something</a
			>
		</p>
	{:else}
		<ul class="divide-y divide-lo-mute-100">
			{#each events as event (event.id)}
				{@const d = new Date(event.eventDate)}
				<li>
					<a
						href="/events/{event.id}"
						class="-mx-2 flex items-center gap-4 rounded-2xl px-2 py-3 transition-colors hover:bg-lo-mute-50"
					>
						<EventCover
							pictureUrl={event.pictureUrl}
							seed={event.id}
							class="h-14 w-14 shrink-0 rounded-2xl"
						>
							<div class="flex h-full flex-col items-center justify-center text-white drop-shadow">
								<span class="text-[10px] font-bold">
									{d.toLocaleString('en-US', { month: 'short' }).toUpperCase()}
								</span>
								<span class="font-display text-xl leading-none font-extrabold">{d.getDate()}</span>
							</div>
						</EventCover>
						<div class="min-w-0 flex-1">
							<p class="truncate font-semibold">{event.eventName}</p>
							<p class="truncate text-xs text-lo-mute-500">
								{formatTime(event.eventDate)} · {event.locationName}
							</p>
						</div>
						<div class="hidden flex-col items-end gap-1 sm:flex">
							<CategoryBadge category={event.category} size="xs" />
							<span class="text-[11px] font-semibold text-lo-mute-400"
								>{relativeWhen(event.eventDate)}</span
							>
						</div>
						<span
							class="rounded-full px-2.5 py-1 text-[11px] font-bold
								{event.role === 'hosting' ? 'bg-lo-ink text-lo-white' : 'bg-lo-lime text-lo-ink'}"
						>
							{event.role === 'hosting' ? 'Hosting' : 'Invited'}
						</span>
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</section>
