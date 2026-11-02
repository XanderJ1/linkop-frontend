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
	import Countdown from '$features/events/components/Countdown.svelte';
	import EventCover from '$features/events/components/EventCover.svelte';
	import EventDetailHeader from '$features/events/components/detail/EventDetailHeader.svelte';
	import EventDetailSkeleton from '$features/events/components/detail/EventDetailSkeleton.svelte';
	import GuestList from '$features/events/components/detail/GuestList.svelte';
	import GuestStatusBadge from '$features/events/components/detail/GuestStatusBadge.svelte';
	import ManageGuestsModal from '$features/events/components/detail/ManageGuestsModal.svelte';
	import AnnounceModal from '$features/notifications/components/AnnounceModal.svelte';
	import EventReminders from '$features/reminders/components/EventReminders.svelte';
	import UserAvatar from '$features/users/components/UserAvatar.svelte';
	import { createEventDetail } from '$features/events/services/eventDetail.svelte';
	import { isUpcoming, relativeWhen } from '$features/events/services/types';
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
	<div class="grid gap-x-8 gap-y-6 md:grid-cols-[300px_minmax(0,1fr)] md:grid-rows-[auto_1fr]">
		<EventCover
			pictureUrl={event.pictureUrl}
			seed={event.id}
			class="aspect-square w-full rounded-2xl shadow-card-hover"
		/>

		<div class="min-w-0 space-y-6 md:col-start-2 md:row-span-2 md:row-start-1">
			<EventDetailHeader {event} />

			<section class="lo-card overflow-hidden">
				<p
					class="border-b border-lo-ink/6 bg-lo-ink/3 px-4 py-2 text-sm font-medium text-lo-mute-600"
				>
					{#if detail.isHost}
						You're hosting this event
					{:else if myInvite}
						You're on the guest list
					{:else}
						Event status
					{/if}
				</p>
				<div class="space-y-4 p-4">
					{#if upcoming}
						<Countdown to={event.eventDate} />
					{:else}
						<p class="text-sm text-lo-mute-500">Wrapped {relativeWhen(event.eventDate)}</p>
					{/if}

					{#if detail.isHost}
						<div class="flex flex-wrap items-center gap-2">
							<Button href="/events/{event.id}/edit">
								<HugeiconsIcon icon={Edit02Icon} size={15} color="currentColor" strokeWidth={2} />
								Edit details
							</Button>
							<Button variant="secondary" onclick={() => (guestsOpen = true)}>
								<HugeiconsIcon
									icon={UserAdd01Icon}
									size={15}
									color="currentColor"
									strokeWidth={2}
								/>
								Invite
							</Button>
							<Button variant="secondary" onclick={() => (announceOpen = true)}>
								<HugeiconsIcon
									icon={Megaphone01Icon}
									size={15}
									color="currentColor"
									strokeWidth={2}
								/>
								Announce
							</Button>
							{#if upcoming}
								<Button variant="secondary" onclick={() => (reminderOpen = true)}>
									<HugeiconsIcon
										icon={AlarmClockIcon}
										size={15}
										color="currentColor"
										strokeWidth={2}
									/>
									Remind guests
								</Button>
							{/if}
						</div>
					{:else if myInvite}
						<div class="flex items-center justify-between gap-3 text-sm text-lo-mute-500">
							Your RSVP
							<GuestStatusBadge status={myInvite.status} />
						</div>
					{/if}
				</div>
			</section>

			<section>
				<h2 class="lo-section-title">About Event</h2>
				<p class="mt-3 text-base leading-relaxed whitespace-pre-line text-lo-mute-700">
					{event.eventDescription}
				</p>
			</section>

			<EventReminders
				eventId={event.id}
				eventDate={event.eventDate}
				isHost={detail.isHost}
				{upcoming}
				bind:adding={reminderOpen}
			/>
		</div>

		<aside class="min-w-0 space-y-6">
			{#if event.creator}
				<section>
					<h2 class="lo-section-title">Hosted By</h2>
					<div class="mt-3 flex items-center gap-2.5">
						<UserAvatar
							firstName={event.creator.firstname}
							lastName={event.creator.lastname}
							id={event.creator.id}
							photoUrl={event.creator.profilePictureUrl}
							size="xs"
						/>
						<div class="min-w-0">
							<p class="truncate text-sm font-medium text-lo-ink">
								{event.creator.firstname}
								{event.creator.lastname}
							</p>
							{#if event.creator.email}
								<a
									href="mailto:{event.creator.email}"
									class="block truncate text-xs text-lo-mute-500 hover:text-lo-ink"
								>
									{event.creator.email}
								</a>
							{/if}
						</div>
					</div>
				</section>
			{/if}

			<GuestList
				guests={event.guests}
				isHost={detail.isHost}
				onmanage={() => (guestsOpen = true)}
			/>
		</aside>
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
