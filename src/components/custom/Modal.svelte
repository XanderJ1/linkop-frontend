<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { Cancel01Icon } from '@hugeicons/core-free-icons';
	import { portal } from '$lib/actions/portal';

	interface Props {
		open: boolean;
		onclose: () => void;
		title?: string;
		description?: string;
		size?: 'sm' | 'md' | 'lg';
		children: Snippet;
		footer?: Snippet;
	}

	let { open, onclose, title, description, size = 'md', children, footer }: Props = $props();

	const sizeClass = {
		sm: 'max-w-sm',
		md: 'max-w-lg',
		lg: 'max-w-2xl'
	};

	function handleKeydown(e: KeyboardEvent) {
		if (open && e.key === 'Escape') onclose();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		use:portal
		transition:fade={{ duration: 150 }}
		class="fixed inset-0 z-999 flex items-end justify-center bg-lo-ink/30 p-4 backdrop-blur-[2px] sm:items-center"
		onclick={onclose}
	>
		<div
			transition:fly={{ y: 24, duration: 220 }}
			class="flex max-h-[90vh] w-full flex-col {sizeClass[
				size
			]} rounded-2xl bg-lo-white shadow-card-hover"
			onclick={(e) => e.stopPropagation()}
			role="dialog"
			tabindex="-1"
			aria-modal="true"
			aria-label={title}
		>
			{#if title}
				<div class="flex items-start justify-between gap-4 px-6 pt-6">
					<div>
						<h2 class="text-lg font-semibold text-lo-ink">{title}</h2>
						{#if description}
							<p class="mt-1 text-sm text-lo-mute-500">{description}</p>
						{/if}
					</div>
					<button
						onclick={onclose}
						aria-label="Close"
						class="cursor-pointer rounded-full p-2 text-lo-mute-400 transition-colors
							hover:bg-lo-mute-100 hover:text-lo-ink"
					>
						<HugeiconsIcon icon={Cancel01Icon} size={16} color="currentColor" strokeWidth={2} />
					</button>
				</div>
			{/if}

			<div class="overflow-y-auto px-6 py-5">
				{@render children()}
			</div>

			{#if footer}
				<div class="flex justify-end gap-2.5 border-t border-lo-ink/6 px-6 py-4">
					{@render footer()}
				</div>
			{/if}
		</div>
	</div>
{/if}
