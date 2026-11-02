<script lang="ts">
	import type { Snippet } from 'svelte';
	import Tabs from '$components/custom/Tabs.svelte';
	import SearchInput from '$components/general/SearchInput.svelte';
	import EventListSkeleton from '$features/events/components/EventListSkeleton.svelte';
	import EventTimeline from '$features/events/components/EventTimeline.svelte';
	import { isUpcoming, type EventSummary } from '$features/events/services/types';

	interface Props {
		events: EventSummary[];
		loading: boolean;
		showHost?: boolean;
		/** Rendered when there are no events at all */
		empty: Snippet;
	}

	let { events, loading, showHost = false, empty }: Props = $props();

	let activeTab = $state('upcoming');
	let search = $state('');

	const upcoming = $derived(events.filter(isUpcoming));
	// Most recent first for past events
	const past = $derived(events.filter((e) => !isUpcoming(e)).reverse());

	const visible = $derived.by(() => {
		const list = activeTab === 'upcoming' ? upcoming : past;
		const q = search.trim().toLowerCase();
		if (!q) return list;
		return list.filter((e) =>
			`${e.eventName} ${e.locationName} ${e.eventDescription}`.toLowerCase().includes(q)
		);
	});
</script>

{#if loading}
	<EventListSkeleton />
{:else if events.length === 0}
	{@render empty()}
{:else}
	<div class="mb-5 flex flex-wrap items-center justify-between gap-3">
		<Tabs
			tabs={[
				{ id: 'upcoming', label: 'Upcoming' },
				{ id: 'past', label: 'Past' }
			]}
			bind:activeTab
			counts={{ upcoming: upcoming.length, past: past.length }}
		/>
		<SearchInput bind:value={search} placeholder="Search events" />
	</div>

	{#if visible.length === 0}
		<p class="py-14 text-center text-sm text-lo-mute-500">
			{search
				? `Nothing matches "${search}".`
				: activeTab === 'upcoming'
					? 'Nothing coming up. Time to plan something?'
					: 'No past events yet.'}
		</p>
	{:else}
		<EventTimeline events={visible} {showHost} />
	{/if}
{/if}
