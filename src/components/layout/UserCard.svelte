<script lang="ts">
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { MoreVerticalIcon, ArrowLeft01Icon } from '@hugeicons/core-free-icons';
	import UserMenu from '$components/layout/UserMenu.svelte';
	import UserAvatar from '$features/users/components/UserAvatar.svelte';
	import { auth } from '$stores/auth.store.svelte';
	import { session } from '$stores/session.store.svelte';

	interface Props {
		collapsed: boolean;
	}

	let { collapsed }: Props = $props();

	let menuOpen = $state(false);

	const firstName = $derived(session.user?.firstname || auth.currentUserFirstName || '');
	const lastName = $derived(session.user?.lastname || auth.currentUserLastName || '');
	const displayName = $derived(
		[firstName, lastName].filter(Boolean).join(' ') || auth.currentUser || '…'
	);
	const displayEmail = $derived(session.user?.email || auth.currentUserEmail || '');
</script>

<div class="relative p-3">
	{#if !collapsed}
		<div
			class="relative flex items-center gap-2.5 rounded-2xl border border-lo-white/10
				bg-lo-white/6 px-3 py-3"
		>
			<UserAvatar
				{firstName}
				{lastName}
				id={session.user?.id}
				photoUrl={session.user?.profilePictureUrl}
				size="sm"
			/>
			<div class="min-w-0 flex-1 pr-5">
				<p class="truncate text-[13px] font-semibold text-lo-white">{displayName}</p>
				<p class="truncate text-[11px] text-lo-white/50">{displayEmail}</p>
			</div>
			<button
				onclick={() => (menuOpen = !menuOpen)}
				aria-label="Account menu"
				class="absolute top-1/2 right-2 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center
					justify-center rounded-lg text-lo-white/60 transition-colors hover:bg-lo-white/10
					hover:text-lo-white"
			>
				<HugeiconsIcon
					icon={menuOpen ? ArrowLeft01Icon : MoreVerticalIcon}
					size={15}
					color="currentColor"
					strokeWidth={1.8}
				/>
			</button>
		</div>
	{:else}
		<button
			onclick={() => (menuOpen = !menuOpen)}
			aria-label="Account menu"
			class="flex w-full cursor-pointer justify-center"
		>
			<UserAvatar {firstName} {lastName} id={session.user?.id} size="sm" />
		</button>
	{/if}

	{#if menuOpen}
		<UserMenu onclose={() => (menuOpen = false)} />
	{/if}
</div>
