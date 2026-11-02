<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { FetchUsersStore } from '$houdini';
	import PageHeader from '$components/general/PageHeader.svelte';
	import SearchInput from '$components/general/SearchInput.svelte';
	import Skeleton from '$components/custom/Skeleton.svelte';
	import UsersTable from '$features/users/components/UsersTable.svelte';
	import { auth } from '$stores/auth.store.svelte';

	const usersStore = new FetchUsersStore();
	let loading = $state(true);
	let search = $state('');

	const users = $derived($usersStore.data?.fetchUsers?.nodes ?? []);
	const filtered = $derived.by(() => {
		const q = search.trim().toLowerCase();
		if (!q) return users;
		return users.filter((u) => `${u.firstname} ${u.lastname} ${u.email}`.toLowerCase().includes(q));
	});

	onMount(async () => {
		// Admin-only page
		if (auth.userRole !== 'ADMIN') {
			goto('/dashboard', { replaceState: true });
			return;
		}
		try {
			await usersStore.fetch({ policy: 'NetworkOnly' });
		} catch {
			toast.error("Couldn't load people");
		} finally {
			loading = false;
		}
	});
</script>

<svelte:head><title>People · LinkOp</title></svelte:head>

<div class="space-y-6">
	<PageHeader
		title="People"
		description="{users.length} {users.length === 1 ? 'person has' : 'people have'} joined LinkOp."
	>
		{#snippet actions()}
			<SearchInput bind:value={search} placeholder="Search people" />
		{/snippet}
	</PageHeader>

	{#if loading}
		<div class="lo-card space-y-4 p-5">
			{#each Array(6) as _, i (i)}
				<div class="flex items-center gap-3">
					<Skeleton variant="circle" width="32px" height="32px" />
					<Skeleton width="40%" />
				</div>
			{/each}
		</div>
	{:else if filtered.length === 0}
		<p class="rounded-3xl bg-lo-white/60 py-14 text-center text-sm text-lo-mute-500">
			{search ? `No one matches "${search}".` : 'No one has joined yet.'}
		</p>
	{:else}
		<UsersTable users={filtered} />
	{/if}
</div>
