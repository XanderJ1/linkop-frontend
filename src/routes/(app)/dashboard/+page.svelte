<script lang="ts">
	import { onMount } from 'svelte';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		Calendar03Icon,
		Ticket01Icon,
		UserGroupIcon,
		Mail01Icon
	} from '@hugeicons/core-free-icons';
	import { FetchMyEventsStore, FetchInvitedEventsStore } from '$houdini';
	import StatsCard from '$components/general/StatsCard.svelte';
	import DashboardHero from '$features/dashboard/components/DashboardHero.svelte';
	import QuickStart from '$features/dashboard/components/QuickStart.svelte';
	import EventListSkeleton from '$features/events/components/EventListSkeleton.svelte';
	import EventTimeline from '$features/events/components/EventTimeline.svelte';
	import { goingCount, isUpcoming, type EventSummary } from '$features/events/services/types';
	import { session } from '$stores/session.store.svelte';

	const myEventsStore = new FetchMyEventsStore();
	const invitedStore = new FetchInvitedEventsStore();

	let loading = $state(true);

	onMount(async () => {
		// Each list loads independently — one failing backend query shouldn't blank the page
		await Promise.allSettled([
			myEventsStore.fetch({ policy: 'NetworkOnly' }),
			invitedStore.fetch({ policy: 'NetworkOnly' })
		]);
		loading = false;
	});

	const hosting = $derived(($myEventsStore.data?.myEvents?.nodes ?? []) as EventSummary[]);
	const invited = $derived(($invitedStore.data?.invitedEvents?.nodes ?? []) as EventSummary[]);

	const timeline = $derived(
		[
			...hosting.map((e) => ({ ...e, role: 'hosting' as const })),
			...invited.map((e) => ({ ...e, role: 'invited' as const }))
		]
			.filter(isUpcoming)
			.sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
	);

	const stats = $derived({
		hosting: hosting.filter(isUpcoming).length,
		invites: invited.filter(isUpcoming).length,
		going: hosting.reduce((sum, e) => sum + goingCount(e), 0),
		awaiting: hosting
			.filter(isUpcoming)
			.reduce((sum, e) => sum + e.guests.filter((g) => g.status === 'PENDING').length, 0)
	});
</script>

<svelte:head><title>Home · LinkOp</title></svelte:head>

<div class="space-y-8">
	<DashboardHero firstName={session.user?.firstname ?? ''} />

	<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
		<StatsCard label="Hosting" value={loading ? '–' : stats.hosting}>
			{#snippet icon()}
				<HugeiconsIcon icon={Calendar03Icon} size={22} color="currentColor" strokeWidth={1.6} />
			{/snippet}
		</StatsCard>
		<StatsCard label="Invites" value={loading ? '–' : stats.invites} accent="text-lo-sky">
			{#snippet icon()}
				<HugeiconsIcon icon={Ticket01Icon} size={22} color="currentColor" strokeWidth={1.6} />
			{/snippet}
		</StatsCard>
		<StatsCard label="Guests going" value={loading ? '–' : stats.going} accent="text-lo-pink">
			{#snippet icon()}
				<HugeiconsIcon icon={UserGroupIcon} size={22} color="currentColor" strokeWidth={1.6} />
			{/snippet}
		</StatsCard>
		<StatsCard label="Awaiting RSVP" value={loading ? '–' : stats.awaiting} accent="text-lo-sun">
			{#snippet icon()}
				<HugeiconsIcon icon={Mail01Icon} size={22} color="currentColor" strokeWidth={1.6} />
			{/snippet}
		</StatsCard>
	</div>

	<section>
		<div class="mb-3 flex items-center justify-between">
			<h2 class="text-xl font-semibold text-lo-ink">Up next</h2>
			<a href="/events" class="text-sm text-lo-mute-500 transition-colors hover:text-lo-ink">
				See all
			</a>
		</div>
		{#if loading}
			<EventListSkeleton count={2} />
		{:else if timeline.length === 0}
			<p class="py-10 text-center text-sm text-lo-mute-500">
				Nothing scheduled yet. Your calendar is wide open.
			</p>
		{:else}
			<EventTimeline events={timeline.slice(0, 6)} showHost />
		{/if}
	</section>

	<div class="border-t border-lo-ink/8"></div>

	<QuickStart />
</div>
