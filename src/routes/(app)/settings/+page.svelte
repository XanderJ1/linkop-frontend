<script lang="ts">
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { ArrowUpRight01Icon, Logout01Icon } from '@hugeicons/core-free-icons';
	import PageHeader from '$components/general/PageHeader.svelte';
	import Button from '$components/general/Button.svelte';
	import ProfileCard from '$features/settings/components/ProfileCard.svelte';
	import { logout, openAccountConsole } from '$stores/auth.store.svelte';
	import { resetSession } from '$stores/session.store.svelte';
</script>

<svelte:head><title>Settings · LinkOp</title></svelte:head>

<div class="max-w-3xl space-y-6 pb-8">
	<PageHeader eyebrow="You" title="Settings" description="How you show up on LinkOp." />

	<ProfileCard />

	<section class="lo-card flex flex-wrap items-center justify-between gap-4 p-6">
		<div>
			<h2 class="text-lg font-bold">Password & security</h2>
			<p class="mt-0.5 text-sm text-lo-mute-500">
				Your sign-in is managed by your LinkOp account. Change your password or phone number there.
			</p>
		</div>
		<Button variant="secondary" onclick={() => openAccountConsole()}>
			Manage account
			<HugeiconsIcon icon={ArrowUpRight01Icon} size={15} color="currentColor" strokeWidth={2} />
		</Button>
	</section>

	<section class="lo-card flex flex-wrap items-center justify-between gap-4 p-6">
		<div>
			<h2 class="text-lg font-bold">Sign out</h2>
			<p class="mt-0.5 text-sm text-lo-mute-500">See you at the next one.</p>
		</div>
		<Button
			variant="softdanger"
			onclick={() => {
				resetSession();
				logout();
			}}
		>
			<HugeiconsIcon icon={Logout01Icon} size={15} color="currentColor" strokeWidth={2} />
			Log out
		</Button>
	</section>
</div>
