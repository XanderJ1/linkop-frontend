<script lang="ts">
	interface Props {
		/** Show the "LinkOp" wordmark next to the mark */
		wordmark?: boolean;
		size?: number;
		tone?: 'light' | 'dark';
	}

	let { wordmark = true, size = 34, tone = 'dark' }: Props = $props();
</script>

<span class="inline-flex items-center gap-2">
	<svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
		<rect width="40" height="40" rx="12" fill={tone === 'light' ? '#ffffff' : '#131517'} />
		<circle cx="16" cy="20" r="7.5" stroke="#6c3cf5" stroke-width="4" />
		<circle cx="24" cy="20" r="7.5" stroke="#ff6a55" stroke-width="4" />
		<path d="M16 12.5a7.5 7.5 0 0 1 0 15" stroke="#6c3cf5" stroke-width="4" />
		<circle cx="31" cy="9" r="3" fill="#c9f24c" />
	</svg>
	{#if wordmark}
		<span
			class="text-lg leading-none font-semibold tracking-tight
				{tone === 'light' ? 'text-lo-white' : 'text-lo-ink'}"
		>
			LinkOp
		</span>
	{/if}
</span>
