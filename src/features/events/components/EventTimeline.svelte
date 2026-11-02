<script lang="ts">
	import EventCard from '$features/events/components/EventCard.svelte';
	import type { EventSummary } from '$features/events/services/types';

	interface Props {
		events: (EventSummary & { role?: 'hosting' | 'invited' })[];
		showHost?: boolean;
	}

	let { events, showHost = false }: Props = $props();

	function dayLabel(date: Date) {
		const dayKey = date.toDateString();
		if (dayKey === new Date().toDateString()) return 'Today';
		if (dayKey === new Date(Date.now() + 86_400_000).toDateString()) return 'Tomorrow';
		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: date.getFullYear() === new Date().getFullYear() ? undefined : 'numeric'
		});
	}

	// Keeps the order of `events`, so callers decide between soonest and latest first
	const days = $derived.by(() => {
		const groups: { key: string; label: string; weekday: string; events: typeof events }[] = [];
		for (const event of events) {
			const date = new Date(event.eventDate);
			const key = date.toDateString();
			let group = groups.find((g) => g.key === key);
			if (!group) {
				group = {
					key,
					label: dayLabel(date),
					weekday: date.toLocaleDateString('en-US', { weekday: 'long' }),
					events: []
				};
				groups.push(group);
			}
			group.events.push(event);
		}
		return groups;
	});
</script>

<div class="space-y-6 sm:space-y-0">
	{#each days as day, i (day.key)}
		<section class="grid gap-x-3 sm:grid-cols-[7rem_minmax(0,1fr)]">
			<div
				class="mb-2 flex items-baseline gap-2 sm:sticky sm:top-16 sm:mb-0 sm:block sm:self-start"
			>
				<p class="font-medium text-lo-ink">{day.label}</p>
				<p class="text-sm text-lo-mute-500">{day.weekday}</p>
			</div>

			<div class="relative sm:pb-6 sm:pl-6">
				<span class="absolute top-2 left-0 hidden size-2 rounded-full bg-lo-mute-300 sm:block"
				></span>
				{#if i < days.length - 1}
					<span
						class="absolute top-5 -bottom-1.5 left-[3.5px] hidden border-l border-dashed border-lo-mute-300
							sm:block"
					></span>
				{/if}
				<div class="space-y-3">
					{#each day.events as event, j (event.id)}
						<EventCard {event} {showHost} role={event.role} index={i + j} />
					{/each}
				</div>
			</div>
		</section>
	{/each}
</div>
