<script lang="ts">
	import Badge from '$components/general/Badge.svelte';
	import UserAvatar from '$features/users/components/UserAvatar.svelte';
	import { formatDate } from '$lib/helpers/datetime';

	interface User {
		id: string;
		firstname: string;
		lastname: string;
		email: string;
		role: string;
		phoneNumber: string | null;
		profilePictureUrl: string | null;
		created_at: string;
	}

	interface Props {
		users: User[];
	}

	let { users }: Props = $props();
</script>

<div class="lo-card overflow-hidden">
	<div class="overflow-x-auto">
		<table class="w-full text-left text-sm">
			<thead class="border-b border-lo-mute-100 bg-lo-mute-50 text-xs text-lo-mute-500">
				<tr>
					<th class="px-5 py-3 font-semibold">Person</th>
					<th class="px-5 py-3 font-semibold">Role</th>
					<th class="hidden px-5 py-3 font-semibold md:table-cell">Phone</th>
					<th class="hidden px-5 py-3 font-semibold sm:table-cell">Joined</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-lo-mute-100">
				{#each users as user (user.id)}
					<tr class="transition-colors hover:bg-lo-mute-50/60">
						<td class="px-5 py-3">
							<div class="flex items-center gap-3">
								<UserAvatar
									firstName={user.firstname}
									lastName={user.lastname}
									id={user.id}
									photoUrl={user.profilePictureUrl}
									size="sm"
								/>
								<div class="min-w-0">
									<p class="truncate font-semibold">{user.firstname} {user.lastname}</p>
									<p class="truncate text-xs text-lo-mute-400">{user.email}</p>
								</div>
							</div>
						</td>
						<td class="px-5 py-3">
							<Badge variant={user.role === 'ADMIN' ? 'violet' : 'default'} size="xs">
								{user.role === 'ADMIN' ? 'Admin' : 'Member'}
							</Badge>
						</td>
						<td class="hidden px-5 py-3 text-lo-mute-600 md:table-cell"
							>{user.phoneNumber ?? '—'}</td
						>
						<td class="hidden px-5 py-3 text-lo-mute-600 sm:table-cell"
							>{formatDate(user.created_at)}</td
						>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
