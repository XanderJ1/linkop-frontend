<script lang="ts">
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { Logout01Icon, UserCircleIcon } from '@hugeicons/core-free-icons';
	import { logout } from '$stores/auth.store.svelte';
	import { resetSession } from '$stores/session.store.svelte';

	interface Props {
		onclose: () => void;
	}

	let { onclose }: Props = $props();
</script>

<!-- Backdrop — clicking outside closes the menu -->
<div
	class="fixed inset-0 z-50"
	onclick={onclose}
	onkeydown={(e) => e.key === 'Escape' && onclose()}
	role="button"
	tabindex="-1"
	aria-label="Close menu"
></div>

<div
	class="absolute bottom-full left-3 right-3 z-50 mb-1 overflow-hidden rounded-2xl border
		border-lo-mute-200 bg-lo-white shadow-xl"
>
	<a
		href="/settings"
		onclick={onclose}
		class="flex items-center gap-3 px-4 py-3 text-sm text-lo-mute-700 transition-colors
			hover:bg-lo-mute-50 hover:text-lo-ink"
	>
		<HugeiconsIcon icon={UserCircleIcon} size={18} color="currentColor" strokeWidth={1.8} />
		<span>My profile</span>
	</a>

	<div class="mx-3 border-t border-lo-mute-100"></div>

	<button
		onclick={() => {
			onclose();
			resetSession();
			logout();
		}}
		class="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-sm text-lo-coral
			transition-colors hover:bg-lo-coral/6"
	>
		<HugeiconsIcon icon={Logout01Icon} size={18} color="currentColor" strokeWidth={1.8} />
		<span>Log out</span>
	</button>
</div>
