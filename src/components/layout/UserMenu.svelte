<script lang="ts">
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { Logout01Icon, Settings01Icon } from '@hugeicons/core-free-icons';
	import { logout } from '$stores/auth.store.svelte';
	import { resetSession, session } from '$stores/session.store.svelte';

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
	class="absolute top-full right-0 z-50 mt-2 w-60 overflow-hidden rounded-xl border border-lo-ink/6
		bg-lo-white p-1 shadow-card-hover"
>
	<div class="px-3 py-2">
		<p class="truncate text-sm font-medium text-lo-ink">
			{session.user?.firstname}
			{session.user?.lastname}
		</p>
		<p class="truncate text-xs text-lo-mute-500">{session.user?.email}</p>
	</div>

	<div class="my-1 border-t border-lo-ink/6"></div>

	<a
		href="/settings"
		onclick={onclose}
		class="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-lo-mute-700 transition-colors
			hover:bg-lo-ink/5 hover:text-lo-ink"
	>
		<HugeiconsIcon icon={Settings01Icon} size={16} color="currentColor" strokeWidth={2} />
		<span>Settings</span>
	</a>

	<button
		onclick={() => {
			onclose();
			resetSession();
			logout();
		}}
		class="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-lo-mute-700
			transition-colors hover:bg-lo-ink/5 hover:text-lo-ink"
	>
		<HugeiconsIcon icon={Logout01Icon} size={16} color="currentColor" strokeWidth={2} />
		<span>Log out</span>
	</button>
</div>
