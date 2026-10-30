<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { UpdateGuestListStore } from '$houdini';
	import Modal from '$components/custom/Modal.svelte';
	import Button from '$components/general/Button.svelte';
	import UserPicker from '$features/users/components/UserPicker.svelte';
	import { runMutation } from '$lib/helpers/mutation';

	interface Props {
		open: boolean;
		eventId: string;
		hostId: string;
		currentGuestIds: string[];
		onclose: () => void;
		onsaved: () => void;
	}

	let { open, eventId, hostId, currentGuestIds, onclose, onsaved }: Props = $props();

	const updateStore = new UpdateGuestListStore();
	let selected = $state<string[]>([]);
	let saving = $state(false);

	$effect(() => {
		if (open) selected = [...currentGuestIds];
	});

	async function save() {
		saving = true;
		const outcome = await runMutation(
			() => updateStore.mutate({ input: { eventId, guestListIds: selected } }),
			(d) => d.updateGuestList,
			"Couldn't update the guest list"
		);
		saving = false;
		if (!outcome.ok) {
			toast.error(outcome.message);
			return;
		}
		toast.success('Guest list updated — invites are out');
		onsaved();
		onclose();
	}
</script>

<Modal {open} {onclose} title="Who's coming?" description="Pick the people you want to invite.">
	{#if open}
		<UserPicker bind:selected exclude={[hostId]} />
	{/if}

	{#snippet footer()}
		<Button variant="secondary" onclick={onclose}>Cancel</Button>
		<Button variant="vibe" loading={saving} onclick={save}>Save guest list</Button>
	{/snippet}
</Modal>
