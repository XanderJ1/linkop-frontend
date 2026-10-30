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
	import UpNextList from '$features/dashboard/components/UpNextList.svelte';
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

<div class="space-y-6 pb-8">
	<DashboardHero firstName={session.user?.firstname ?? ''} next={timeline[0] ?? null} />

	<div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
		<StatsCard label="Hosting" value={loading ? '–' : stats.hosting} description="upcoming events">
			{#snippet icon()}
				<HugeiconsIcon icon={Calendar03Icon} size={20} color="currentColor" strokeWidth={2} />
			{/snippet}
		</StatsCard>
		<StatsCard
			label="Invites"
			value={loading ? '–' : stats.invites}
			description="waiting for you"
			accent="bg-lo-lime text-lo-ink"
		>
			{#snippet icon()}
				<HugeiconsIcon icon={Ticket01Icon} size={20} color="currentColor" strokeWidth={2} />
			{/snippet}
		</StatsCard>
		<StatsCard
			label="Guests going"
			value={loading ? '–' : stats.going}
			description="across your events"
			accent="bg-lo-coral/12 text-lo-coral"
		>
			{#snippet icon()}
				<HugeiconsIcon icon={UserGroupIcon} size={20} color="currentColor" strokeWidth={2} />
			{/snippet}
		</StatsCard>
		<StatsCard
			label="Awaiting RSVP"
			value={loading ? '–' : stats.awaiting}
			description="guests yet to reply"
			accent="bg-lo-sun/18 text-[#b5760a]"
		>
			{#snippet icon()}
				<HugeiconsIcon icon={Mail01Icon} size={20} color="currentColor" strokeWidth={2} />
			{/snippet}
		</StatsCard>
	</div>

	<QuickStart />

	<UpNextList events={timeline.slice(0, 6)} {loading} />
</div>
