<script lang="ts">
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { DeleteEventStore } from '$houdini';
	import ConfirmModal from '$components/custom/ConfirmModal.svelte';
	import { runMutation } from '$lib/helpers/mutation';

	interface Props {
		open: boolean;
		eventId: string;
		eventName: string;
		onclose: () => void;
	}

	let { open, eventId, eventName, onclose }: Props = $props();
	const deleteStore = new DeleteEventStore();
	let deleting = $state(false);

	function close() {
		if (!deleting) onclose();
	}

	async function confirmDelete() {
		if (!open || deleting) return;
		deleting = true;
		const outcome = await runMutation(
			async () => {
				const result = await deleteStore.mutate({ input: { eventId } });
				if (!result.errors?.length && !result.data?.deleteEvent) {
					throw new Error("We couldn't confirm the deletion. Please try again.");
				}
				return result;
			},
			(data) => data.deleteEvent,
			"Couldn't delete this event"
		);
		if (!outcome.ok) {
			deleting = false;
			toast.error(outcome.message);
			return;
		}
		toast.success('Event deleted');
		onclose();
		await goto('/events', { invalidateAll: true, replaceState: true });
	}
</script>

<ConfirmModal
	{open}
	title="Delete event?"
	description={`“${eventName}” will be permanently deleted. This cannot be undone.`}
	confirmLabel="Delete event"
	loading={deleting}
	onconfirm={confirmDelete}
	onclose={close}
/>
