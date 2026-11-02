<script lang="ts">
	import type { Snippet } from 'svelte';
	import { resolveCover } from '$features/events/services/covers';

	interface Props {
		pictureUrl: string | null | undefined;
		/** Used to pick a stable fallback cover */
		seed?: string;
		class?: string;
		children?: Snippet;
	}

	let { pictureUrl, seed = '', class: extra = '', children }: Props = $props();

	let imageFailed = $state(false);

	const cover = $derived(resolveCover(pictureUrl, seed));
	const showImage = $derived(!!cover.imageUrl && !imageFailed);

	$effect(() => {
		void pictureUrl;
		imageFailed = false;
	});
</script>

<div class="relative isolate overflow-hidden {extra}" style="background: {cover.preset?.base}">
	{#if showImage}
		<img
			src={cover.imageUrl}
			alt=""
			class="absolute inset-0 h-full w-full object-cover"
			onerror={() => (imageFailed = true)}
		/>
	{:else if cover.preset}
		<span
			class="blob top-[-20%] left-[-10%] h-[70%] w-[55%]"
			style="background: {cover.preset.blobs[0]}"
		></span>
		<span
			class="blob right-[-15%] bottom-[-30%] h-[80%] w-[60%]"
			style="background: {cover.preset.blobs[1]}"
		></span>
		<span
			class="blob top-[30%] left-[40%] h-[35%] w-[25%] opacity-70"
			style="background: {cover.preset.blobs[2]}"
		></span>
		<div class="dots absolute inset-0"></div>
	{/if}

	{#if children}
		<div class="relative z-10 h-full">
			{@render children()}
		</div>
	{/if}
</div>

<style>
	.blob {
		position: absolute;
		border-radius: 9999px;
		filter: blur(28px);
		opacity: 0.85;
	}

	.dots {
		background-image: radial-gradient(rgba(255, 255, 255, 0.28) 1px, transparent 1px);
		background-size: 14px 14px;
		mask-image: linear-gradient(120deg, black, transparent 70%);
	}
</style>
