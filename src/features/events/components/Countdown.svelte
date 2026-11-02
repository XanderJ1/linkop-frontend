<script lang="ts">
	import { onDestroy } from 'svelte';

	interface Props {
		to: string;
	}

	let { to }: Props = $props();

	let now = $state(Date.now());
	const timer = setInterval(() => (now = Date.now()), 1000);
	onDestroy(() => clearInterval(timer));

	const parts = $derived.by(() => {
		const diff = Math.max(0, new Date(to).getTime() - now);
		return [
			{ label: 'days', value: Math.floor(diff / 86_400_000) },
			{ label: 'hrs', value: Math.floor((diff / 3_600_000) % 24) },
			{ label: 'min', value: Math.floor((diff / 60_000) % 60) },
			{ label: 'sec', value: Math.floor((diff / 1000) % 60) }
		];
	});
</script>

<div class="flex gap-1.5" aria-label="Time until the event">
	{#each parts as part (part.label)}
		<div class="flex min-w-12 flex-col items-center rounded-lg bg-lo-ink/5 px-2 py-1.5">
			<span class="text-base leading-none font-medium text-lo-ink tabular-nums">
				{String(part.value).padStart(2, '0')}
			</span>
			<span class="mt-1 text-[11px] text-lo-mute-500">{part.label}</span>
		</div>
	{/each}
</div>
