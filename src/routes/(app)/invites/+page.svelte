<script lang="ts">
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { Ticket01Icon } from '@hugeicons/core-free-icons';
	import { FetchInvitedEventsStore } from '$houdini';
	import PageHeader from '$components/general/PageHeader.svelte';
	import EmptyState from '$components/general/EmptyState.svelte';
	import Button from '$components/general/Button.svelte';
	import EventList from '$features/events/components/EventList.svelte';
	import type { EventSummary } from '$features/events/services/types';

	const invitedStore = new FetchInvitedEventsStore();
	let loading = $state(true);

	const events = $derived(($invitedStore.data?.invitedEvents?.nodes ?? []) as EventSummary[]);

	onMount(async () => {
		try {
			await invitedStore.fetch({ policy: 'NetworkOnly' });
		} catch {
			toast.error("Couldn't load your invites");
		} finally {
			loading = false;
		}
	});
</script>

<svelte:head><title>Invites · LinkOp</title></svelte:head>

<div class="space-y-6">
	<PageHeader
		eyebrow="You're on the list"
		title="Invites"
		description="Events other people want you at."
	/>

	<EventList {events} {loading} showHost>
		{#snippet empty()}
			<EmptyState
				title="No invites yet"
				description="When someone adds you to their guest list, it'll show up here."
			>
				{#snippet icon()}
					<HugeiconsIcon icon={Ticket01Icon} size={26} color="currentColor" strokeWidth={1.8} />
				{/snippet}
				{#snippet actions()}
					<Button variant="secondary" href="/events/create">Or host your own</Button>
				{/snippet}
			</EmptyState>
		{/snippet}
	</EventList>
</div>
