<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { toast } from 'svelte-sonner';
	import { UpdateEventStore } from '$houdini';
	import PageHeader from '$components/general/PageHeader.svelte';
	import EmptyState from '$components/general/EmptyState.svelte';
	import Button from '$components/general/Button.svelte';
	import EventForm from '$features/events/components/create/EventForm.svelte';
	import EventDetailSkeleton from '$features/events/components/detail/EventDetailSkeleton.svelte';
	import { createEventDetail } from '$features/events/services/eventDetail.svelte';
	import { runMutation } from '$lib/helpers/mutation';
	import { toDatetimeLocalValue } from '$lib/helpers/datetime';
	import type { EventFormValues } from '$features/events/services/types';

	const detail = createEventDetail();
	const updateStore = new UpdateEventStore();
	const eventId = $derived(page.params.id!);

	$effect(() => {
		detail.load(eventId);
	});

	const savedPin = $derived(detail.event?.eventLocation ?? null);

	async function handleUpdate(values: EventFormValues) {
		// Send the pin only when it moved, reusing the saved location's id: a fresh id
		// would make the backend update a location row that doesn't exist
		const pinMoved =
			savedPin &&
			values.latitude !== null &&
			values.longitude !== null &&
			(values.latitude !== savedPin.latitude || values.longitude !== savedPin.longitude);

		const outcome = await runMutation(
			() =>
				updateStore.mutate({
					input: {
						eventId,
						name: values.name.trim(),
						description: values.description.trim(),
						date: new Date(values.date).toISOString(),
						locationName: values.location.trim(),
						imageUrl: values.imageUrl,
						privacy: values.privacy,
						eventLocation: pinMoved
							? { id: savedPin.id, latitude: values.latitude!, longitude: values.longitude! }
							: undefined
					}
				}),
			(d) => d.updateEvent,
			"Couldn't save your changes"
		);
		if (!outcome.ok) {
			toast.error(outcome.message);
			return;
		}
		toast.success('Changes saved');
		goto(`/events/${eventId}`);
	}
</script>

<svelte:head><title>Edit event · LinkOp</title></svelte:head>

{#if detail.loading}
	<EventDetailSkeleton />
{:else if !detail.event || !detail.isHost}
	<EmptyState
		title="You can't edit this event"
		description="Only the host can change an event's details."
	>
		{#snippet actions()}
			<Button variant="secondary" href="/events/{eventId}">Back to event</Button>
		{/snippet}
	</EmptyState>
{:else}
	<div class="space-y-6">
		<PageHeader eyebrow="Editing" title={detail.event.eventName} />

		<EventForm
			mode="edit"
			submitLabel="Save changes"
			initial={{
				name: detail.event.eventName,
				description: detail.event.eventDescription,
				date: toDatetimeLocalValue(detail.event.eventDate),
				location: detail.event.locationName,
				imageUrl: detail.event.pictureUrl,
				privacy: detail.event.privacy === 'PRIVATE' ? 'PRIVATE' : 'PUBLIC',
				latitude: savedPin?.latitude ?? null,
				longitude: savedPin?.longitude ?? null
			}}
			pinLocked={!savedPin}
			onsubmit={handleUpdate}
			oncancel={() => goto(`/events/${eventId}`)}
		/>
	</div>
{/if}
