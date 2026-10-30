<script lang="ts">
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { Search01Icon } from '@hugeicons/core-free-icons';

	interface Props {
		value: string;
		placeholder?: string;
	}

	let { value = $bindable(), placeholder = 'Search' }: Props = $props();
</script>

<label class="relative block w-full max-w-xs">
	<span class="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-lo-mute-400">
		<HugeiconsIcon icon={Search01Icon} size={16} color="currentColor" strokeWidth={2} />
	</span>
	<input
		type="search"
		bind:value
		{placeholder}
		class="lo-input rounded-full! pl-10"
		aria-label={placeholder}
	/>
</label>
