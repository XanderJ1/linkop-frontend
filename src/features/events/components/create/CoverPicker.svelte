<script lang="ts">
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { Link01Icon, Upload04Icon, Tick02Icon } from '@hugeicons/core-free-icons';
	import { toast } from 'svelte-sonner';
	import EventCover from '$features/events/components/EventCover.svelte';
	import { COVER_PRESETS, COVER_PREFIX, presetUrl } from '$features/events/services/covers';
	import { uploadImage, uploadsEnabled } from '$lib/helpers/upload';

	interface Props {
		value: string;
		error?: string;
	}

	let { value = $bindable(), error }: Props = $props();

	let uploading = $state(false);
	const isCustom = $derived(!!value && !value.startsWith(COVER_PREFIX));
	let customUrl = $state(isCustomUrl(value) ? value : '');

	function isCustomUrl(v: string) {
		return !!v && !v.startsWith(COVER_PREFIX);
	}

	function applyCustomUrl() {
		const url = customUrl.trim();
		if (!/^https?:\/\/.+/.test(url)) {
			toast.error('Paste a full image link starting with http(s)://');
			return;
		}
		value = url;
	}

	async function handleFile(e: Event) {
		const file = (e.currentTarget as HTMLInputElement).files?.[0];
		if (!file) return;
		uploading = true;
		try {
			value = await uploadImage(file);
			customUrl = value;
			toast.success('Cover uploaded');
		} catch {
			toast.error('Upload failed — try a smaller image or paste a link instead');
		} finally {
			uploading = false;
		}
	}
</script>

<div>
	<div class="grid grid-cols-3 gap-2">
		{#each COVER_PRESETS as preset (preset.id)}
			{@const selected = value === presetUrl(preset.id)}
			<button
				type="button"
				onclick={() => (value = presetUrl(preset.id))}
				aria-pressed={selected}
				aria-label="{preset.name} cover"
				class="group relative cursor-pointer overflow-hidden rounded-lg transition-all duration-150
					{selected
					? 'ring-2 ring-lo-ink ring-offset-2'
					: 'hover:ring-2 hover:ring-lo-mute-300 hover:ring-offset-1'}"
			>
				<EventCover pictureUrl={presetUrl(preset.id)} class="h-16" />
				{#if selected}
					<span
						class="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full
							bg-lo-white text-lo-ink"
					>
						<HugeiconsIcon icon={Tick02Icon} size={12} color="currentColor" strokeWidth={3} />
					</span>
				{/if}
				<span
					class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/40 to-transparent px-2 pt-3
						pb-1 text-left text-[10.5px] font-semibold text-white"
				>
					{preset.name}
				</span>
			</button>
		{/each}
	</div>

	<div class="mt-3 flex flex-wrap gap-2">
		<div class="relative w-full">
			<span class="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-lo-mute-400">
				<HugeiconsIcon icon={Link01Icon} size={15} color="currentColor" strokeWidth={2} />
			</span>
			<input
				type="url"
				bind:value={customUrl}
				placeholder="…or paste an image link"
				class="lo-input pl-10 {isCustom ? 'border-lo-ink' : ''}"
				onkeydown={(e) => e.key === 'Enter' && (e.preventDefault(), applyCustomUrl())}
			/>
		</div>
		<button
			type="button"
			onclick={applyCustomUrl}
			class="h-9 flex-1 cursor-pointer rounded-full bg-lo-ink/6 px-4 text-sm font-medium
				text-lo-mute-800 transition-colors hover:bg-lo-ink/10"
		>
			Use link
		</button>
		{#if uploadsEnabled}
			<label
				class="flex h-9 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-lo-ink/6
					px-4 text-sm font-medium text-lo-mute-800 transition-colors hover:bg-lo-ink/10"
			>
				<HugeiconsIcon icon={Upload04Icon} size={15} color="currentColor" strokeWidth={2} />
				{uploading ? 'Uploading…' : 'Upload'}
				<input
					type="file"
					accept="image/*"
					class="sr-only"
					onchange={handleFile}
					disabled={uploading}
				/>
			</label>
		{/if}
	</div>

	{#if error}
		<p class="mt-1.5 text-xs font-medium text-lo-coral">{error}</p>
	{/if}
</div>
