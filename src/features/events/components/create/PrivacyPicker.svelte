<script lang="ts">
	import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/svelte';
	import { Globe02Icon, SquareLock02Icon } from '@hugeicons/core-free-icons';
	import type { EventPrivacy } from '$features/events/services/types';

	interface Props {
		value: EventPrivacy;
	}

	let { value = $bindable() }: Props = $props();

	const OPTIONS: { id: EventPrivacy; label: string; hint: string; icon: IconSvgElement }[] = [
		{ id: 'PUBLIC', label: 'Public', hint: 'People nearby can discover it', icon: Globe02Icon },
		{
			id: 'PRIVATE',
			label: 'Private',
			hint: 'Only your guest list sees it',
			icon: SquareLock02Icon
		}
	];
</script>

<div role="radiogroup" aria-label="Who can see this event" class="grid gap-2.5 sm:grid-cols-2">
	{#each OPTIONS as option (option.id)}
		{@const active = value === option.id}
		<button
			type="button"
			role="radio"
			aria-checked={active}
			onclick={() => (value = option.id)}
			class="flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-left transition-colors duration-150
				{active
				? 'border-lo-ink bg-lo-white text-lo-ink'
				: 'border-lo-mute-200 bg-lo-white text-lo-ink hover:border-lo-mute-300'}"
		>
			<span
				class="grid size-9 shrink-0 place-items-center rounded-xl
					{active ? 'bg-lo-ink text-lo-white' : 'bg-lo-mute-100 text-lo-mute-600'}"
			>
				<HugeiconsIcon icon={option.icon} size={18} color="currentColor" strokeWidth={2} />
			</span>
			<span>
				<span class="block text-sm font-bold">{option.label}</span>
				<span class="block text-xs text-lo-mute-500">
					{option.hint}
				</span>
			</span>
		</button>
	{/each}
</div>
