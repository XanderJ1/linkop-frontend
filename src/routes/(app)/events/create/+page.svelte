<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { toast } from 'svelte-sonner';
	import { CreateEventStore } from '$houdini';
	import EventForm from '$features/events/components/create/EventForm.svelte';
	import { runMutation } from '$lib/helpers/mutation';
	import type { EventFormValues } from '$features/events/services/types';

	const createStore = new CreateEventStore();
	const templateId = page.url.searchParams.get('template');

	async function handleCreate(values: EventFormValues) {
		const outcome = await runMutation(
			() =>
				createStore.mutate({
					input: {
						name: values.name.trim(),
						description: values.description.trim(),
						date: new Date(values.date).toISOString(),
						location: values.location.trim(),
						imageUrl: values.imageUrl,
						privacy: values.privacy,
						// The backend ignores this id and creates its own, but the input requires one
						eventLocation: {
							id: crypto.randomUUID(),
							latitude: values.latitude!,
							longitude: values.longitude!
						}
					}
				}),
			(d) => d.createEvent,
			"Couldn't create your event"
		);
		if (!outcome.ok) {
			toast.error(outcome.message);
			return;
		}
		toast.success(`${values.name.trim()} is on the calendar 🎉`);
		// createEvent returns only a message, not the new id, so land on the list
		goto('/events');
	}
</script>

<svelte:head><title>New event · LinkOp</title></svelte:head>

<h1 class="sr-only">Create an event</h1>

<EventForm
	submitLabel="Create Event"
	{templateId}
	onsubmit={handleCreate}
	oncancel={() => history.back()}
/>
