<script lang="ts">
	import {
		CATEGORY_VIBES,
		type EventCategory,
		type CategoryVibe
	} from '$features/events/services/categories';

	interface Props {
		value: EventCategory;
		error?: string;
	}

	let { value = $bindable(), error }: Props = $props();
	const options = Object.entries(CATEGORY_VIBES) as [EventCategory, CategoryVibe][];
</script>

<fieldset aria-describedby={error ? 'ev-category-error' : undefined}>
	<legend class="lo-label">Category</legend>
	<div class="grid gap-2.5 sm:grid-cols-2">
		{#each options as [id, option] (id)}
			<label
				class="flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors
					{value === id ? 'border-lo-ink bg-lo-ink/3' : 'border-lo-mute-200 hover:border-lo-mute-300'}"
			>
				<input
					type="radio"
					name="event-category"
					value={id}
					bind:group={value}
					required
					class="size-4 shrink-0 accent-lo-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lo-ink"
				/>
				<span class="min-w-0">
					<span class="block text-sm font-medium text-lo-ink">{option.label}</span>
					<span class="block text-xs text-lo-mute-500">{option.tagline}</span>
				</span>
			</label>
		{/each}
	</div>
	{#if error}
		<p id="ev-category-error" role="alert" class="mt-1 text-xs font-medium text-lo-coral">
			{error}
		</p>
	{/if}
</fieldset>
