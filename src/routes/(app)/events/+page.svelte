<script lang="ts">
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { Add01Icon, CalendarAdd01Icon } from '@hugeicons/core-free-icons';
	import { FetchMyEventsStore } from '$houdini';
	import PageHeader from '$components/general/PageHeader.svelte';
	import Button from '$components/general/Button.svelte';
	import EmptyState from '$components/general/EmptyState.svelte';
	import EventList from '$features/events/components/EventList.svelte';
	import type { EventSummary } from '$features/events/services/types';

	const myEventsStore = new FetchMyEventsStore();
	let loading = $state(true);

	const events = $derived(($myEventsStore.data?.myEvents?.nodes ?? []) as EventSummary[]);

	onMount(async () => {
		try {
			await myEventsStore.fetch({ policy: 'NetworkOnly' });
		} catch {
			toast.error("Couldn't load your events");
		} finally {
			loading = false;
		}
	});
</script>

<svelte:head><title>My events · LinkOp</title></svelte:head>

<div class="space-y-6">
	<PageHeader
		eyebrow="Hosting"
		title="My events"
		description="Everything you're putting together, from game nights to board meetings."
	>
		{#snippet actions()}
			<Button variant="vibe" href="/events/create">
				<HugeiconsIcon icon={Add01Icon} size={16} color="currentColor" strokeWidth={2.4} />
				New event
			</Button>
		{/snippet}
	</PageHeader>

	<EventList {events} {loading}>
		{#snippet empty()}
			<EmptyState
				title="You haven't hosted anything yet"
				description="Meetups, parties, happy hours, formal meetings — set one up in under a minute."
			>
				{#snippet icon()}
					<HugeiconsIcon
						icon={CalendarAdd01Icon}
						size={26}
						color="currentColor"
						strokeWidth={1.8}
					/>
				{/snippet}
				{#snippet actions()}
					<Button variant="vibe" href="/events/create">Host your first event</Button>
				{/snippet}
			</EmptyState>
		{/snippet}
	</EventList>
</div>
