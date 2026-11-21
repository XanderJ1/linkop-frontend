<script lang="ts">
	import { AcceptEventStore } from '$houdini';
	import Button from '$components/general/Button.svelte';
	import GuestStatusBadge from './GuestStatusBadge.svelte';
	import { acceptInvitation, googleCalendarUrl } from '$features/events/services/calendar';
	import type { EventSummary } from '$features/events/services/types';

	let {
		event,
		status,
		onaccepted
	}: {
		event: EventSummary;
		status: string;
		onaccepted: () => Promise<void>;
	} = $props();
	const store = new AcceptEventStore();
	let accepting = $state(false);
	let acceptedUrl = $state<string | null>(null);
	let error = $state<string | null>(null);
	const accepted = $derived(status === 'ACCEPTED' || !!acceptedUrl);
	const calendarUrl = $derived(accepted ? (acceptedUrl ?? googleCalendarUrl(event)) : null);

	async function accept() {
		if (accepting) return;
		accepting = true;
		error = null;
		try {
			acceptedUrl = await acceptInvitation(() => store.mutate({ input: { eventId: event.id } }));
			await onaccepted();
		} catch (err) {
			error =
				err instanceof Error ? err.message : "Couldn't accept this invitation. Please try again.";
		} finally {
			accepting = false;
		}
	}
</script>

<div class="space-y-3" aria-busy={accepting}>
	<div class="flex items-center justify-between gap-3 text-sm text-lo-mute-500">
		Your RSVP
		<GuestStatusBadge status={accepted ? 'ACCEPTED' : status} />
	</div>
	{#if status !== 'CANCELLED'}
		{#if !accepted}
			<Button loading={accepting} onclick={accept}>Accept invitation</Button>
		{:else if calendarUrl}
			<a
				href={calendarUrl}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex min-h-11 items-center justify-center rounded-full bg-lo-ink px-4 text-sm font-medium text-lo-white transition-colors hover:bg-lo-mute-700 focus-visible:outline-2 focus-visible:outline-offset-2"
				>Add to Google Calendar</a
			>
			<p class="text-xs text-lo-mute-500">
				Opens a calendar draft. Choose Save in Google Calendar to add it.
			</p>
		{:else}
			<p class="text-sm text-lo-mute-500">
				Calendar export is unavailable because this event has no valid end time.
			</p>
		{/if}
	{/if}
	{#if error}<p role="alert" class="text-sm text-lo-coral">{error}</p>{/if}
</div>
