<script lang="ts">
	import { page } from '$app/state';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		Edit02Icon,
		Megaphone01Icon,
		AlarmClockIcon,
		ArrowLeft02Icon,
		UserAdd01Icon
	} from '@hugeicons/core-free-icons';
	import Button from '$components/general/Button.svelte';
	import EmptyState from '$components/general/EmptyState.svelte';
	import EventDetailHeader from '$features/events/components/detail/EventDetailHeader.svelte';
	import EventDetailSkeleton from '$features/events/components/detail/EventDetailSkeleton.svelte';
	import GuestList from '$features/events/components/detail/GuestList.svelte';
	import GuestStatusBadge from '$features/events/components/detail/GuestStatusBadge.svelte';
	import ManageGuestsModal from '$features/events/components/detail/ManageGuestsModal.svelte';
	import AnnounceModal from '$features/notifications/components/AnnounceModal.svelte';
	import EventReminders from '$features/reminders/components/EventReminders.svelte';
	import UserAvatar from '$features/users/components/UserAvatar.svelte';
	import { createEventDetail } from '$features/events/services/eventDetail.svelte';
	import { isUpcoming } from '$features/events/services/types';
	import { session } from '$stores/session.store.svelte';

	const detail = createEventDetail();
	const eventId = $derived(page.params.id!);

	let guestsOpen = $state(false);
	let announceOpen = $state(false);
	let reminderOpen = $state(false);

	$effect(() => {
		detail.load(eventId);
	});

	const event = $derived(detail.event);
	const myInvite = $derived(event?.guests.find((g) => g.userid === session.user?.id));
	const upcoming = $derived(event ? isUpcoming(event) : false);
</script>

<svelte:head><title>{event?.eventName ?? 'Event'} · LinkOp</title></svelte:head>

{#if detail.loading}
	<EventDetailSkeleton />
{:else if !event}
	<EmptyState
		title="We can't find this event"
		description={detail.error ?? "It may have been removed, or you're not on the guest list."}
	>
		{#snippet actions()}
			<Button variant="secondary" href="/events">
				<HugeiconsIcon icon={ArrowLeft02Icon} size={15} color="currentColor" strokeWidth={2} />
				Back to events
			</Button>
		{/snippet}
	</EmptyState>
{:else}
	<div class="space-y-6 pb-8">
		<EventDetailHeader {event} isHost={detail.isHost} />

		<!-- Action bar -->
		<div class="flex flex-wrap items-center gap-2.5">
			{#if detail.isHost}
				<Button variant="primary" href="/events/{event.id}/edit">
					<HugeiconsIcon icon={Edit02Icon} size={15} color="currentColor" strokeWidth={2} />
					Edit details
				</Button>
				<Button variant="secondary" onclick={() => (guestsOpen = true)}>
					<HugeiconsIcon icon={UserAdd01Icon} size={15} color="currentColor" strokeWidth={2} />
					Invite people
				</Button>
				<Button variant="secondary" onclick={() => (announceOpen = true)}>
					<HugeiconsIcon icon={Megaphone01Icon} size={15} color="currentColor" strokeWidth={2} />
					Announce
				</Button>
				{#if upcoming}
					<Button variant="soft" onclick={() => (reminderOpen = true)}>
						<HugeiconsIcon icon={AlarmClockIcon} size={15} color="currentColor" strokeWidth={2} />
						Remind guests
					</Button>
				{/if}
			{/if}
		</div>

		<div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
			<div class="space-y-6">
				<section class="lo-card p-6">
					<h2 class="text-lg font-bold">About this event</h2>
					<p class="mt-3 text-[15px] leading-relaxed whitespace-pre-line text-lo-mute-700">
						{event.eventDescription}
					</p>
				</section>

				{#if event.creator}
					<section class="lo-card flex items-center gap-4 p-5">
						<UserAvatar
							firstName={event.creator.firstname}
							lastName={event.creator.lastname}
							id={event.creator.id}
							photoUrl={event.creator.profilePictureUrl}
							size="lg"
						/>
						<div class="min-w-0 flex-1">
							<p class="text-xs font-bold tracking-[0.14em] text-lo-mute-400 uppercase">
								Hosted by
							</p>
							<p class="truncate font-display text-xl font-bold">
								{event.creator.firstname}
								{event.creator.lastname}
							</p>
							{#if event.creator.email}
								<a
									href="mailto:{event.creator.email}"
									class="text-sm text-lo-violet hover:underline">{event.creator.email}</a
								>
							{/if}
						</div>
					</section>
				{/if}

				{#if !detail.isHost && myInvite}
					<section
						class="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-lo-ink p-5 text-lo-white"
					>
						<div>
							<p class="font-display text-lg font-bold">You're on the guest list</p>
							<p class="text-sm text-lo-white/60">Your RSVP status for this event</p>
						</div>
						<GuestStatusBadge status={myInvite.status} />
					</section>
				{/if}
			</div>

			<div class="space-y-6">
				<GuestList
					guests={event.guests}
					isHost={detail.isHost}
					onmanage={() => (guestsOpen = true)}
				/>
				<EventReminders
					eventId={event.id}
					eventDate={event.eventDate}
					isHost={detail.isHost}
					{upcoming}
					bind:adding={reminderOpen}
				/>
			</div>
		</div>
	</div>

	{#if detail.isHost}
		<ManageGuestsModal
			open={guestsOpen}
			eventId={event.id}
			hostId={event.creatorId}
			currentGuestIds={event.guests.map((g) => g.userid).filter((id): id is string => !!id)}
			onclose={() => (guestsOpen = false)}
			onsaved={() => detail.load(eventId)}
		/>
		<AnnounceModal
			open={announceOpen}
			eventId={event.id}
			eventName={event.eventName}
			onclose={() => (announceOpen = false)}
		/>
	{/if}
{/if}
