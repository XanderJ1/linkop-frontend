<script lang="ts">
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { Gps01Icon, Radar01Icon } from '@hugeicons/core-free-icons';
	import { FetchEventsNearMeStore } from '$houdini';
	import PageHeader from '$components/general/PageHeader.svelte';
	import EmptyState from '$components/general/EmptyState.svelte';
	import Button from '$components/general/Button.svelte';
	import EventList from '$features/events/components/EventList.svelte';
	import type { EventSummary } from '$features/events/services/types';

	const nearbyStore = new FetchEventsNearMeStore();

	let status = $state<'idle' | 'locating' | 'loading' | 'done'>('idle');
	let error = $state<string | null>(null);

	const events = $derived(($nearbyStore.data?.eventsNearMe?.nodes ?? []) as EventSummary[]);

	function search() {
		if (!('geolocation' in navigator)) {
			error = "Your browser can't share its location";
			return;
		}
		error = null;
		status = 'locating';
		navigator.geolocation.getCurrentPosition(
			async (pos) => {
				status = 'loading';
				try {
					const result = await nearbyStore.fetch({
						variables: {
							location: {
								// The input requires an id even though only the coordinates are used
								location: {
									id: crypto.randomUUID(),
									latitude: pos.coords.latitude,
									longitude: pos.coords.longitude
								}
							}
						},
						policy: 'NetworkOnly'
					});
					if (result.errors?.length) error = "Couldn't load events near you";
				} catch {
					error = "Couldn't load events near you";
				} finally {
					status = 'done';
				}
			},
			(err) => {
				error =
					err.code === err.PERMISSION_DENIED
						? 'Location access is blocked. Allow it in your browser to see events nearby.'
						: "Couldn't find your location. Try again in a moment.";
				status = 'idle';
			},
			{ enableHighAccuracy: true, timeout: 10_000 }
		);
	}
</script>

<svelte:head><title>Nearby · LinkOp</title></svelte:head>

<div class="space-y-6">
	<PageHeader
		eyebrow="Around you"
		title="Nearby"
		description="See what's happening close to where you are right now."
	>
		{#snippet actions()}
			{#if status === 'done'}
				<Button variant="secondary" onclick={search}>
					<HugeiconsIcon icon={Gps01Icon} size={15} color="currentColor" strokeWidth={2} />
					Refresh
				</Button>
			{/if}
		{/snippet}
	</PageHeader>

	{#if status === 'done' || status === 'loading'}
		{#if error}
			<EmptyState title="Something went sideways" description={error}>
				{#snippet actions()}
					<Button variant="secondary" onclick={search}>Try again</Button>
				{/snippet}
			</EmptyState>
		{:else}
			<EventList {events} loading={status === 'loading'} showHost>
				{#snippet empty()}
					<EmptyState
						title="Nothing nearby yet"
						description="No events with a map pin close to you. Host one and put this spot on the map."
					>
						{#snippet icon()}
							<HugeiconsIcon icon={Radar01Icon} size={26} color="currentColor" strokeWidth={1.8} />
						{/snippet}
						{#snippet actions()}
							<Button variant="vibe" href="/events/create">Host something here</Button>
						{/snippet}
					</EmptyState>
				{/snippet}
			</EventList>
		{/if}
	{:else}
		<EmptyState
			title="Find what's around you"
			description={error ??
				'Share your location once and we’ll show events close by. It isn’t saved.'}
		>
			{#snippet icon()}
				<HugeiconsIcon icon={Radar01Icon} size={26} color="currentColor" strokeWidth={1.8} />
			{/snippet}
			{#snippet actions()}
				<Button variant="vibe" loading={status === 'locating'} onclick={search}>
					<HugeiconsIcon icon={Gps01Icon} size={15} color="currentColor" strokeWidth={2} />
					Use my location
				</Button>
			{/snippet}
		</EmptyState>
	{/if}
</div>
