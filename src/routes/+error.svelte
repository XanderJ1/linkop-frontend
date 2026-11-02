<script lang="ts">
	import { page } from '$app/state';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { ArrowLeft02Icon, Home01Icon } from '@hugeicons/core-free-icons';
	import Button from '$components/general/Button.svelte';
	import Logo from '$components/custom/Logo.svelte';

	const isNotFound = $derived(page.status === 404);
</script>

<div
	class="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden px-6
		text-center"
>
	<div class="lo-wash"></div>

	<div class="relative">
		<Logo />
		<p class="mt-10 text-7xl font-semibold text-lo-mute-300">{page.status}</p>
		<h1 class="mt-3 text-2xl font-bold text-lo-ink">
			{isNotFound ? 'This party moved.' : 'Something went sideways.'}
		</h1>
		<p class="mx-auto mt-2 max-w-sm text-sm text-lo-mute-500">
			{isNotFound
				? "We couldn't find that page. It may have been renamed or never existed."
				: (page.error?.message ?? 'An unexpected error occurred. Please try again.')}
		</p>

		<div class="mt-8 flex items-center justify-center gap-3">
			<Button variant="secondary" onclick={() => history.back()}>
				<HugeiconsIcon icon={ArrowLeft02Icon} size={15} color="currentColor" strokeWidth={2} />
				Go back
			</Button>
			<Button variant="primary" href="/dashboard">
				<HugeiconsIcon icon={Home01Icon} size={15} color="currentColor" strokeWidth={2} />
				Take me home
			</Button>
		</div>
	</div>
</div>
