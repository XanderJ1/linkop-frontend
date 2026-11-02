<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { Cancel01Icon, Add01Icon } from '@hugeicons/core-free-icons';
	import { CreateReminderStore } from '$houdini';
	import Modal from '$components/custom/Modal.svelte';
	import Button from '$components/general/Button.svelte';
	import { runMutation } from '$lib/helpers/mutation';
	import { formatDateTime, toDatetimeLocalValue } from '$lib/helpers/datetime';

	interface Props {
		open: boolean;
		eventId: string;
		eventDate: string;
		onclose: () => void;
		onsaved?: () => void;
	}

	let { open, eventId, eventDate, onclose, onsaved }: Props = $props();

	const createStore = new CreateReminderStore();

	let title = $state('');
	let description = $state('');
	let alertTimes = $state<string[]>([]);
	let customTime = $state('');
	let error = $state<string | null>(null);
	let saving = $state(false);

	const OFFSETS = [
		{ label: '1 week before', ms: 7 * 86_400_000 },
		{ label: '1 day before', ms: 86_400_000 },
		{ label: '1 hour before', ms: 3_600_000 },
		{ label: '15 min before', ms: 900_000 }
	];

	$effect(() => {
		if (open) {
			title = '';
			description = '';
			alertTimes = [];
			customTime = '';
			error = null;
		}
	});

	function addOffset(ms: number) {
		const at = new Date(new Date(eventDate).getTime() - ms);
		if (at.getTime() < Date.now()) {
			toast.error('That time has already passed');
			return;
		}
		addTime(at.toISOString());
	}

	function addCustom() {
		if (!customTime) return;
		const at = new Date(customTime);
		if (at.getTime() < Date.now()) {
			toast.error('Pick a time in the future');
			return;
		}
		if (at.getTime() > new Date(eventDate).getTime()) {
			toast.error('Pick a time before the event starts');
			return;
		}
		addTime(at.toISOString());
		customTime = '';
	}

	function addTime(iso: string) {
		if (!alertTimes.includes(iso)) alertTimes = [...alertTimes, iso].sort();
	}

	async function save() {
		if (!title.trim()) return (error = 'Give your reminder a title');
		if (alertTimes.length === 0) return (error = 'Add at least one time to send it');
		error = null;

		saving = true;
		const outcome = await runMutation(
			() =>
				createStore.mutate({
					input: {
						eventId,
						title: title.trim(),
						description: description.trim(),
						alertTimes
					}
				}),
			(d) => d.createReminder,
			"Couldn't schedule the reminder"
		);
		saving = false;
		if (!outcome.ok) {
			toast.error(outcome.message);
			return;
		}
		toast.success('Reminder scheduled for your guests');
		onsaved?.();
		onclose();
	}
</script>

<Modal
	{open}
	{onclose}
	title="Remind your guests"
	description="Everyone on the guest list gets a nudge at the times you pick."
>
	<div class="space-y-4">
		<div>
			<label for="rm-title" class="lo-label">Title</label>
			<input id="rm-title" class="lo-input" bind:value={title} placeholder="See you tonight!" />
		</div>

		<div>
			<label for="rm-desc" class="lo-label"
				>Message <span class="font-normal text-lo-mute-400">(optional)</span></label
			>
			<input
				id="rm-desc"
				class="lo-input"
				bind:value={description}
				placeholder="Doors open at 8. Bring your ticket."
			/>
		</div>

		<div>
			<p class="lo-label">Send it</p>
			<div class="flex flex-wrap gap-2">
				{#each OFFSETS as o (o.label)}
					<button
						type="button"
						onclick={() => addOffset(o.ms)}
						class="cursor-pointer rounded-full border border-lo-mute-200 px-3 py-1.5 text-xs font-semibold
							text-lo-mute-700 transition-colors hover:border-lo-violet hover:text-lo-violet"
					>
						{o.label}
					</button>
				{/each}
			</div>
			<div class="mt-2 flex gap-2">
				<input
					type="datetime-local"
					class="lo-input"
					bind:value={customTime}
					min={toDatetimeLocalValue(new Date())}
					max={toDatetimeLocalValue(new Date(eventDate))}
					aria-label="Custom reminder time"
				/>
				<Button variant="soft" onclick={addCustom}>
					<HugeiconsIcon icon={Add01Icon} size={14} color="currentColor" strokeWidth={2.4} />
					Add
				</Button>
			</div>

			{#if alertTimes.length}
				<div class="mt-3 flex flex-wrap gap-2">
					{#each alertTimes as t (t)}
						<span
							class="flex items-center gap-1.5 rounded-full bg-lo-ink/6 py-1 pr-1.5 pl-3 text-xs font-medium
								text-lo-ink"
						>
							{formatDateTime(t)}
							<button
								type="button"
								aria-label="Remove time"
								onclick={() => (alertTimes = alertTimes.filter((x) => x !== t))}
								class="cursor-pointer rounded-full p-0.5 hover:bg-lo-ink/10"
							>
								<HugeiconsIcon
									icon={Cancel01Icon}
									size={12}
									color="currentColor"
									strokeWidth={2.5}
								/>
							</button>
						</span>
					{/each}
				</div>
			{/if}
		</div>

		{#if error}
			<p class="text-sm font-medium text-lo-coral">{error}</p>
		{/if}
	</div>

	{#snippet footer()}
		<Button variant="secondary" onclick={onclose}>Cancel</Button>
		<Button variant="primary" loading={saving} onclick={save}>Schedule reminder</Button>
	{/snippet}
</Modal>
