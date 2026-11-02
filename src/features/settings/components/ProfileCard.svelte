<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { UpdateProfileStore } from '$houdini';
	import Button from '$components/general/Button.svelte';
	import UserAvatar from '$features/users/components/UserAvatar.svelte';
	import { runMutation } from '$lib/helpers/mutation';
	import { session, resetSession, syncSession } from '$stores/session.store.svelte';

	const updateStore = new UpdateProfileStore();

	let firstName = $state(session.user?.firstname ?? '');
	let lastName = $state(session.user?.lastname ?? '');
	let phoneNumber = $state(session.user?.phoneNumber ?? '');
	let saving = $state(false);

	const dirty = $derived(
		firstName !== session.user?.firstname ||
			lastName !== session.user?.lastname ||
			phoneNumber !== (session.user?.phoneNumber ?? '')
	);

	async function save(e: SubmitEvent) {
		e.preventDefault();
		if (!firstName.trim() || !lastName.trim()) {
			toast.error('Fill in your first and last name');
			return;
		}
		saving = true;
		const outcome = await runMutation(
			() =>
				updateStore.mutate({
					input: {
						firstName: firstName.trim(),
						lastName: lastName.trim(),
						phoneNumber: phoneNumber.trim() || null
					}
				}),
			(d) => d.updateProfile,
			"Couldn't update your profile"
		);
		saving = false;
		if (!outcome.ok) {
			toast.error(outcome.message);
			return;
		}
		toast.success('Profile updated');
		resetSession();
		await syncSession();
	}
</script>

<section class="lo-card">
	<div class="p-6">
		<div class="flex items-center gap-4">
			<UserAvatar
				firstName={session.user?.firstname}
				lastName={session.user?.lastname}
				id={session.user?.id}
				photoUrl={session.user?.profilePictureUrl}
				size="lg"
			/>
			<div>
				<p class="font-display text-xl font-bold">
					{session.user?.firstname}
					{session.user?.lastname}
				</p>
				<p class="text-sm text-lo-mute-500">{session.user?.email}</p>
			</div>
		</div>

		<form class="mt-6 grid gap-4 sm:grid-cols-2" onsubmit={save}>
			<div>
				<label for="pf-first" class="lo-label">First name</label>
				<input id="pf-first" class="lo-input" bind:value={firstName} />
			</div>
			<div>
				<label for="pf-last" class="lo-label">Last name</label>
				<input id="pf-last" class="lo-input" bind:value={lastName} />
			</div>
			<div class="sm:col-span-2">
				<label for="pf-phone" class="lo-label">Phone number</label>
				<input
					id="pf-phone"
					type="tel"
					autocomplete="tel"
					class="lo-input"
					placeholder="+1 555 010 2030"
					bind:value={phoneNumber}
				/>
				<p class="mt-1 text-xs text-lo-mute-500">
					Your email comes from your login and is changed in your account settings.
				</p>
			</div>
			<div class="flex justify-end sm:col-span-2">
				<Button type="submit" variant="primary" disabled={!dirty} loading={saving}
					>Save profile</Button
				>
			</div>
		</form>
	</div>
</section>
