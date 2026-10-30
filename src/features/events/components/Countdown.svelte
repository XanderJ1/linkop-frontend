<script lang="ts">
	import { onDestroy } from 'svelte';

	interface Props {
		to: string;
		tone?: 'light' | 'dark';
	}

	let { to, tone = 'dark' }: Props = $props();

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

<div class="flex gap-2" aria-label="Time until the event">
	{#each parts as part (part.label)}
		<div
			class="flex min-w-14 flex-col items-center rounded-2xl px-2.5 py-2
				{tone === 'light' ? 'bg-lo-white/15 text-lo-white backdrop-blur' : 'bg-lo-mute-100 text-lo-ink'}"
		>
			<span class="font-display text-2xl leading-none font-extrabold tabular-nums">
				{String(part.value).padStart(2, '0')}
			</span>
			<span class="mt-1 text-[10px] font-semibold tracking-wider uppercase opacity-70">
				{part.label}
			</span>
		</div>
	{/each}
</div>
