<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { CreateNotificationStore } from '$houdini';
	import Modal from '$components/custom/Modal.svelte';
	import Button from '$components/general/Button.svelte';
	import { runMutation } from '$lib/helpers/mutation';

	interface Props {
		open: boolean;
		eventId: string;
		eventName: string;
		onclose: () => void;
	}

	let { open, eventId, eventName, onclose }: Props = $props();

	const createStore = new CreateNotificationStore();
	let title = $state('');
	let message = $state('');
	let errors = $state<{ title?: string; message?: string }>({});
	let sending = $state(false);

	const QUICK = [
		{ title: 'Quick update', message: 'Heads up — we have a small change to share.' },
		{
			title: 'See you soon!',
			message: "Can't wait to see everyone. Don't forget to bring your energy."
		},
		{
			title: 'Location change',
			message: "We've moved to a new spot. Check the event page for the details."
		}
	];

	$effect(() => {
		if (open) {
			title = '';
			message = '';
			errors = {};
		}
	});

	async function send() {
		errors = {
			...(title.trim() ? {} : { title: 'Add a title' }),
			...(message.trim() ? {} : { message: 'Write a message' })
		};
		if (errors.title || errors.message) return;

		sending = true;
		const outcome = await runMutation(
			() =>
				createStore.mutate({
					input: { eventId, title: title.trim(), message: message.trim() }
				}),
			(d) => d.createNotification,
			"Couldn't send the announcement"
		);
		sending = false;
		if (!outcome.ok) {
			toast.error(outcome.message);
			return;
		}
		toast.success('Announcement sent to your guests');
		onclose();
	}
</script>

<Modal
	{open}
	{onclose}
	title="Make an announcement"
	description="Send an update to everyone invited to {eventName}."
>
	<div class="space-y-4">
		<div class="flex flex-wrap gap-2">
			{#each QUICK as q (q.title)}
				<button
					type="button"
					onclick={() => ((title = q.title), (message = q.message))}
					class="cursor-pointer rounded-full border border-lo-mute-200 px-3 py-1.5 text-xs font-semibold
						text-lo-mute-700 transition-colors hover:border-lo-violet hover:text-lo-violet"
				>
					{q.title}
				</button>
			{/each}
		</div>
		<div>
			<label for="an-title" class="lo-label">Title</label>
			<input id="an-title" class="lo-input" bind:value={title} placeholder="Doors open at 7" />
			{#if errors.title}<p class="mt-1 text-xs font-medium text-lo-coral">{errors.title}</p>{/if}
		</div>
		<div>
			<label for="an-msg" class="lo-label">Message</label>
			<textarea id="an-msg" rows="4" class="lo-input" bind:value={message}></textarea>
			{#if errors.message}<p class="mt-1 text-xs font-medium text-lo-coral">
					{errors.message}
				</p>{/if}
		</div>
	</div>

	{#snippet footer()}
		<Button variant="secondary" onclick={onclose}>Cancel</Button>
		<Button variant="vibe" loading={sending} onclick={send}>Send it</Button>
	{/snippet}
</Modal>
