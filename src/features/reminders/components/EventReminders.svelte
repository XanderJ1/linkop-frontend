<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { Add01Icon, AlarmClockIcon, Delete02Icon } from '@hugeicons/core-free-icons';
	import { FetchEventRemindersStore, DeleteReminderStore } from '$houdini';
	import Badge from '$components/general/Badge.svelte';
	import Skeleton from '$components/custom/Skeleton.svelte';
	import ConfirmModal from '$components/custom/ConfirmModal.svelte';
	import CreateReminderModal from '$features/reminders/components/CreateReminderModal.svelte';
	import { runMutation } from '$lib/helpers/mutation';
	import { formatDateTime } from '$lib/helpers/datetime';

	interface Props {
		eventId: string;
		eventDate: string;
		isHost: boolean;
		upcoming: boolean;
		/** Opens the schedule modal; bound so the page's action bar can open it too */
		adding?: boolean;
	}

	let { eventId, eventDate, isHost, upcoming, adding = $bindable(false) }: Props = $props();

	const remindersStore = new FetchEventRemindersStore();
	const deleteStore = new DeleteReminderStore();

	let loading = $state(true);
	let deletingId = $state<string | null>(null);
	let deleting = $state(false);

	// The API can repeat a time within a reminder, so dedupe before rendering keyed lists
	const reminders = $derived(
		($remindersStore.data?.reminders?.nodes ?? []).map((r) => ({
			...r,
			alerts: [...new Set(r.alertTime)].sort()
		}))
	);
	const nextSend = $derived(
		reminders
			.flatMap((r) => r.alerts)
			.sort()
			.find((t) => new Date(t).getTime() > Date.now())
	);

	async function load() {
		try {
			await remindersStore.fetch({ variables: { eventId }, policy: 'NetworkOnly' });
		} catch {
			if (isHost) toast.error("Couldn't load reminders for this event");
		} finally {
			loading = false;
		}
	}

	$effect(() => {
		loading = true;
		load();
	});

	function isSent(t: string) {
		return new Date(t).getTime() <= Date.now();
	}

	async function confirmDelete() {
		if (!deletingId) return;
		deleting = true;
		const outcome = await runMutation(
			() => deleteStore.mutate({ input: { reminderId: deletingId! } }),
			(d) => d.deleteReminder,
			"Couldn't delete that reminder"
		);
		deleting = false;
		if (!outcome.ok) {
			toast.error(outcome.message);
			return;
		}
		toast.success('Reminder cancelled');
		deletingId = null;
		await load();
	}
</script>

<!-- Guests only see this when the host has scheduled something -->
{#if isHost || reminders.length > 0}
	<section class="lo-card p-5">
		<div class="flex items-center justify-between">
			<h2 class="text-lg font-bold">Reminders</h2>
			{#if isHost && upcoming}
				<button
					onclick={() => (adding = true)}
					class="flex cursor-pointer items-center gap-1.5 rounded-full bg-lo-violet/8 px-3 py-1.5 text-xs
						font-bold text-lo-violet transition-colors hover:bg-lo-violet/14"
				>
					<HugeiconsIcon icon={Add01Icon} size={14} color="currentColor" strokeWidth={2.4} />
					Schedule
				</button>
			{/if}
		</div>
		<p class="mt-1 text-sm text-lo-mute-500">
			{isHost ? 'Your guests get a nudge at each of these times.' : 'The host will nudge you at:'}
		</p>

		{#if loading}
			<div class="mt-4 space-y-2">
				<Skeleton variant="block" height="56px" rounded="16px" />
				<Skeleton variant="block" height="56px" rounded="16px" />
			</div>
		{:else if reminders.length === 0}
			<p class="mt-4 rounded-2xl bg-lo-mute-50 px-4 py-6 text-center text-sm text-lo-mute-500">
				{upcoming
					? 'No reminders yet. Schedule one so nobody forgets.'
					: 'This event has passed.'}
			</p>
		{:else}
			{#if nextSend}
				<div class="mt-4">
					<Badge variant="lime" size="xs">Next nudge {formatDateTime(nextSend)}</Badge>
				</div>
			{/if}
			<ul class="mt-3 space-y-2">
				{#each reminders as reminder (reminder.id)}
					<li class="flex items-start gap-3 rounded-2xl bg-lo-mute-50 p-3">
						<span class="mt-0.5 shrink-0 rounded-full bg-lo-sun/18 p-1.5 text-[#b5760a]">
							<HugeiconsIcon icon={AlarmClockIcon} size={15} color="currentColor" strokeWidth={2} />
						</span>
						<div class="flex min-w-0 flex-1 flex-wrap gap-1.5">
							{#each reminder.alerts as t (t)}
								<Badge size="xs" variant={isSent(t) ? 'success' : 'default'}>
									{isSent(t) ? 'Sent · ' : ''}{formatDateTime(t)}
								</Badge>
							{/each}
						</div>
						{#if isHost}
							<button
								onclick={() => (deletingId = reminder.id)}
								aria-label="Cancel reminder"
								class="shrink-0 cursor-pointer rounded-full p-1.5 text-lo-mute-400 transition-colors
									hover:bg-lo-coral/10 hover:text-lo-coral"
							>
								<HugeiconsIcon icon={Delete02Icon} size={15} color="currentColor" strokeWidth={2} />
							</button>
						{/if}
					</li>
				{/each}
			</ul>
		{/if}
	</section>
{/if}

{#if isHost}
	<CreateReminderModal
		open={adding}
		{eventId}
		{eventDate}
		onclose={() => (adding = false)}
		onsaved={load}
	/>
	<ConfirmModal
		open={!!deletingId}
		title="Cancel this reminder?"
		description="Guests won't get the nudges that haven't gone out yet."
		loading={deleting}
		onconfirm={confirmDelete}
		onclose={() => (deletingId = null)}
	/>
{/if}
