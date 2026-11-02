<script lang="ts">
	import UserAvatar from '$features/users/components/UserAvatar.svelte';
	import GuestStatusBadge from '$features/events/components/detail/GuestStatusBadge.svelte';
	import type { GuestSummary } from '$features/events/services/types';

	interface Props {
		guests: GuestSummary[];
		isHost: boolean;
		onmanage?: () => void;
	}

	let { guests, isHost, onmanage }: Props = $props();

	const counts = $derived({
		going: guests.filter((g) => g.status === 'ACCEPTED').length,
		pending: guests.filter((g) => g.status === 'PENDING').length,
		declined: guests.filter((g) => g.status === 'DECLINED' || g.status === 'CANCELLED').length
	});
</script>

<section>
	<div class="lo-section-title">
		<h2>{counts.going} Going</h2>
		{#if isHost && onmanage}
			<button onclick={onmanage} class="cursor-pointer text-lo-ink hover:text-lo-mute-600">
				Invite
			</button>
		{/if}
	</div>

	<p class="mt-3 text-sm text-lo-mute-500">
		{counts.pending} invited · {counts.declined} not going
	</p>

	{#if guests.length === 0}
		<p class="mt-3 text-sm text-lo-mute-500">
			{isHost ? 'No one invited yet. A party of one is still a party, but…' : 'No guests yet.'}
		</p>
	{:else}
		<ul class="mt-2">
			{#each guests as guest (guest.id)}
				<li class="flex items-center gap-2.5 py-1.5">
					<UserAvatar
						firstName={guest.user?.firstname}
						lastName={guest.user?.lastname}
						id={guest.user?.id ?? guest.userid}
						photoUrl={guest.user?.profilePictureUrl}
						size="xs"
					/>
					<p class="min-w-0 flex-1 truncate text-sm font-medium text-lo-ink">
						{guest.user ? `${guest.user.firstname} ${guest.user.lastname}` : 'Guest'}
					</p>
					<GuestStatusBadge status={guest.status} />
				</li>
			{/each}
		</ul>
	{/if}
</section>
