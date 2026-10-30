<script lang="ts">
	import { page } from '$app/state';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { ArrowLeft02Icon, Home01Icon } from '@hugeicons/core-free-icons';
	import Button from '$components/general/Button.svelte';
	import Logo from '$components/custom/Logo.svelte';

	const isNotFound = $derived(page.status === 404);
</script>

<div
	class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-lo-page px-6
		text-center"
>
	<div
		class="pointer-events-none absolute top-1/4 left-1/3 h-72 w-72 animate-float rounded-full
			bg-lo-violet/20 blur-3xl"
	></div>
	<div
		class="pointer-events-none absolute right-1/4 bottom-1/4 h-64 w-64 animate-float-slow
			rounded-full bg-lo-coral/20 blur-3xl"
	></div>

	<div class="relative">
		<Logo />
		<p class="mt-10 font-display text-8xl font-extrabold text-lo-ink">{page.status}</p>
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
			<Button variant="vibe" href="/dashboard">
				<HugeiconsIcon icon={Home01Icon} size={15} color="currentColor" strokeWidth={2} />
				Take me home
			</Button>
		</div>
	</div>
</div>
