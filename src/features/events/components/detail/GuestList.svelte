<script lang="ts">
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { UserAdd01Icon } from '@hugeicons/core-free-icons';
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

<section class="lo-card p-5">
	<div class="flex items-center justify-between">
		<h2 class="text-lg font-bold">Guest list</h2>
		{#if isHost && onmanage}
			<button
				onclick={onmanage}
				class="flex cursor-pointer items-center gap-1.5 rounded-full bg-lo-violet/8 px-3 py-1.5 text-xs
					font-bold text-lo-violet transition-colors hover:bg-lo-violet/14"
			>
				<HugeiconsIcon icon={UserAdd01Icon} size={14} color="currentColor" strokeWidth={2} />
				Invite
			</button>
		{/if}
	</div>

	<div class="mt-4 grid grid-cols-3 gap-2 text-center">
		<div class="rounded-2xl bg-lo-mint/10 py-2.5">
			<p class="font-display text-2xl font-extrabold text-[#128a6c]">{counts.going}</p>
			<p class="text-[11px] font-semibold text-lo-mute-500">Going</p>
		</div>
		<div class="rounded-2xl bg-lo-sun/12 py-2.5">
			<p class="font-display text-2xl font-extrabold text-[#b5760a]">{counts.pending}</p>
			<p class="text-[11px] font-semibold text-lo-mute-500">Invited</p>
		</div>
		<div class="rounded-2xl bg-lo-mute-100 py-2.5">
			<p class="font-display text-2xl font-extrabold text-lo-mute-600">{counts.declined}</p>
			<p class="text-[11px] font-semibold text-lo-mute-500">Not going</p>
		</div>
	</div>

	{#if guests.length === 0}
		<p class="mt-5 rounded-2xl bg-lo-mute-50 px-4 py-6 text-center text-sm text-lo-mute-500">
			{isHost ? 'No one invited yet. A party of one is still a party, but…' : 'No guests yet.'}
		</p>
	{:else}
		<ul class="mt-4 divide-y divide-lo-mute-100">
			{#each guests as guest (guest.id)}
				<li class="flex items-center gap-3 py-2.5">
					<UserAvatar
						firstName={guest.user?.firstname}
						lastName={guest.user?.lastname}
						id={guest.user?.id ?? guest.userid}
						photoUrl={guest.user?.profilePictureUrl}
						size="sm"
					/>
					<div class="min-w-0 flex-1">
						<p class="truncate text-sm font-semibold">
							{guest.user ? `${guest.user.firstname} ${guest.user.lastname}` : 'Guest'}
						</p>
						{#if guest.user?.email}
							<p class="truncate text-xs text-lo-mute-400">{guest.user.email}</p>
						{/if}
					</div>
					<GuestStatusBadge status={guest.status} />
				</li>
			{/each}
		</ul>
	{/if}
</section>
