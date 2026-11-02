<script lang="ts">
	import { onMount } from 'svelte';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { Tick02Icon } from '@hugeicons/core-free-icons';
	import { FetchUsersStore } from '$houdini';
	import SearchInput from '$components/general/SearchInput.svelte';
	import Skeleton from '$components/custom/Skeleton.svelte';
	import UserAvatar from '$features/users/components/UserAvatar.svelte';

	interface Props {
		selected: string[];
		/** User ids that can't be picked (e.g. the host) */
		exclude?: string[];
	}

	let { selected = $bindable(), exclude = [] }: Props = $props();

	const usersStore = new FetchUsersStore();
	let loading = $state(true);
	let failed = $state(false);
	let search = $state('');

	onMount(async () => {
		try {
			await usersStore.fetch({ policy: 'NetworkOnly' });
		} catch {
			failed = true;
		} finally {
			loading = false;
		}
	});

	const users = $derived(
		($usersStore.data?.fetchUsers?.nodes ?? []).filter((u) => !exclude.includes(u.id))
	);
	const filtered = $derived.by(() => {
		const q = search.trim().toLowerCase();
		if (!q) return users;
		return users.filter((u) => `${u.firstname} ${u.lastname} ${u.email}`.toLowerCase().includes(q));
	});

	function toggle(id: string) {
		selected = selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id];
	}
</script>

<div class="space-y-3">
	<div class="flex items-center justify-between gap-3">
		<SearchInput bind:value={search} placeholder="Search people" />
		<span class="shrink-0 rounded-full bg-lo-ink/6 px-3 py-1 text-xs font-medium text-lo-mute-700">
			{selected.length} selected
		</span>
	</div>

	<div class="max-h-80 space-y-1 overflow-y-auto pr-1">
		{#if loading}
			{#each Array(4) as _, i (i)}
				<div class="flex items-center gap-3 p-2">
					<Skeleton variant="circle" width="32px" height="32px" />
					<Skeleton width="50%" />
				</div>
			{/each}
		{:else if failed}
			<p class="py-6 text-center text-sm text-lo-coral">Couldn't load people. Try again later.</p>
		{:else if filtered.length === 0}
			<p class="py-6 text-center text-sm text-lo-mute-500">No one matches "{search}".</p>
		{:else}
			{#each filtered as user (user.id)}
				{@const isOn = selected.includes(user.id)}
				<button
					type="button"
					onclick={() => toggle(user.id)}
					aria-pressed={isOn}
					class="flex w-full cursor-pointer items-center gap-3 rounded-2xl p-2 text-left
						transition-colors {isOn ? 'bg-lo-violet/8' : 'hover:bg-lo-mute-50'}"
				>
					<UserAvatar
						firstName={user.firstname}
						lastName={user.lastname}
						id={user.id}
						photoUrl={user.profilePictureUrl}
						size="sm"
					/>
					<span class="min-w-0 flex-1">
						<span class="block truncate text-sm font-semibold">
							{user.firstname}
							{user.lastname}
						</span>
						<span class="block truncate text-xs text-lo-mute-400">{user.email}</span>
					</span>
					<span
						class="flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all
							{isOn ? 'border-lo-violet bg-lo-violet text-lo-white' : 'border-lo-mute-300'}"
					>
						{#if isOn}
							<HugeiconsIcon icon={Tick02Icon} size={13} color="currentColor" strokeWidth={3} />
						{/if}
					</span>
				</button>
			{/each}
		{/if}
	</div>
</div>
