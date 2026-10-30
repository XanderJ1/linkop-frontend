<script lang="ts">
	import { untrack } from 'svelte';
	import Button from '$components/general/Button.svelte';
	import CoverPicker from '$features/events/components/create/CoverPicker.svelte';
	import EventPreview from '$features/events/components/create/EventPreview.svelte';
	import LocationPin from '$features/events/components/create/LocationPin.svelte';
	import PrivacyPicker from '$features/events/components/create/PrivacyPicker.svelte';
	import { EVENT_TEMPLATES } from '$features/events/components/create/templates';
	import { validateEvent, type EventFormErrors } from '$features/events/services/eventSchema';
	import { presetUrl } from '$features/events/services/covers';
	import { toDatetimeLocalValue } from '$lib/helpers/datetime';
	import type { EventFormValues } from '$features/events/services/types';

	interface Props {
		initial?: Partial<EventFormValues>;
		submitLabel: string;
		/** Edit mode hides templates and allows past dates on existing events */
		mode?: 'create' | 'edit';
		/** Template id to pre-apply, e.g. from `?template=party` */
		templateId?: string | null;
		/** Locks the map pin (the backend can't add one to an event saved without it) */
		pinLocked?: boolean;
		onsubmit: (values: EventFormValues) => Promise<void>;
		oncancel?: () => void;
	}

	let {
		initial = {},
		submitLabel,
		mode = 'create',
		templateId = null,
		pinLocked = false,
		onsubmit,
		oncancel
	}: Props = $props();

	// The form owns its values after mount — `initial` only seeds them
	let values = $state<EventFormValues>(
		untrack(() => ({
			name: initial.name ?? '',
			description: initial.description ?? '',
			date: initial.date ?? '',
			location: initial.location ?? '',
			imageUrl: initial.imageUrl ?? presetUrl('sunset'),
			privacy: initial.privacy ?? 'PUBLIC',
			latitude: initial.latitude ?? null,
			longitude: initial.longitude ?? null
		}))
	);

	let errors = $state<EventFormErrors>({});
	let submitting = $state(false);
	let activeTemplate = $state<string | null>(null);

	function applyTemplate(id: string) {
		const t = EVENT_TEMPLATES.find((t) => t.id === id);
		if (!t) return;
		activeTemplate = id;
		values.imageUrl = t.cover;
		values.name = t.name;
		values.description = t.description;
	}

	untrack(() => templateId && applyTemplate(templateId));

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		errors = validateEvent(values, {
			requireFuture: mode === 'create',
			requirePin: mode === 'create'
		});
		if (Object.keys(errors).length) return;
		submitting = true;
		try {
			await onsubmit($state.snapshot(values));
		} finally {
			submitting = false;
		}
	}

	const minDate = toDatetimeLocalValue(Date.now());
</script>

<form class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]" onsubmit={handleSubmit} novalidate>
	<div class="space-y-5">
		{#if mode === 'create'}
			<section class="lo-card p-5 sm:p-6">
				<h2 class="text-lg font-bold">Start with a vibe</h2>
				<p class="mt-0.5 text-sm text-lo-mute-500">
					Pick a starting point, or skip it and write your own.
				</p>
				<div class="mt-4 flex flex-wrap gap-2">
					{#each EVENT_TEMPLATES as t (t.id)}
						<button
							type="button"
							onclick={() => applyTemplate(t.id)}
							class="flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm
								font-semibold transition-all duration-200
								{activeTemplate === t.id
								? 'border-lo-ink bg-lo-ink text-lo-white'
								: 'border-lo-mute-200 bg-lo-white text-lo-mute-700 hover:-translate-y-0.5 hover:border-lo-mute-300'}"
						>
							<span aria-hidden="true">{t.emoji}</span>
							{t.label}
						</button>
					{/each}
				</div>
			</section>
		{/if}

		<section class="lo-card p-5 sm:p-6">
			<h2 class="text-lg font-bold">Cover</h2>
			<p class="mt-0.5 mb-4 text-sm text-lo-mute-500">This is the first thing your guests see.</p>
			<CoverPicker bind:value={values.imageUrl} error={errors.imageUrl} />
		</section>

		<section class="lo-card space-y-4 p-5 sm:p-6">
			<h2 class="text-lg font-bold">The details</h2>

			<div>
				<label for="ev-name" class="lo-label">Event name</label>
				<input
					id="ev-name"
					class="lo-input text-base! font-semibold"
					placeholder="Sunday brunch club"
					bind:value={values.name}
					aria-invalid={!!errors.name}
				/>
				{#if errors.name}<p class="mt-1 text-xs font-medium text-lo-coral">{errors.name}</p>{/if}
			</div>

			<div class="grid gap-4 sm:grid-cols-2">
				<div>
					<label for="ev-date" class="lo-label">Date & time</label>
					<input
						id="ev-date"
						type="datetime-local"
						class="lo-input"
						min={mode === 'create' ? minDate : undefined}
						bind:value={values.date}
						aria-invalid={!!errors.date}
					/>
					{#if errors.date}<p class="mt-1 text-xs font-medium text-lo-coral">{errors.date}</p>{/if}
				</div>
				<div>
					<label for="ev-location" class="lo-label">Location</label>
					<input
						id="ev-location"
						class="lo-input"
						placeholder="The rooftop at 12 Marina St"
						bind:value={values.location}
						aria-invalid={!!errors.location}
					/>
					{#if errors.location}
						<p class="mt-1 text-xs font-medium text-lo-coral">{errors.location}</p>
					{/if}
				</div>
			</div>

			<div>
				<label for="ev-desc" class="lo-label">What should people know?</label>
				<textarea
					id="ev-desc"
					rows="5"
					class="lo-input resize-y"
					placeholder="Dress code, agenda, what to bring…"
					bind:value={values.description}
					aria-invalid={!!errors.description}
				></textarea>
				{#if errors.description}
					<p class="mt-1 text-xs font-medium text-lo-coral">{errors.description}</p>
				{/if}
			</div>
		</section>

		<section class="lo-card space-y-5 p-5 sm:p-6">
			<div>
				<h2 class="text-lg font-bold">Where & who</h2>
				<p class="mt-0.5 text-sm text-lo-mute-500">Pin the spot and choose who can find it.</p>
			</div>
			<LocationPin
				bind:latitude={values.latitude}
				bind:longitude={values.longitude}
				error={errors.latitude ?? errors.longitude}
				disabled={pinLocked}
			/>
			<PrivacyPicker bind:value={values.privacy} />
		</section>

		<div class="flex items-center justify-end gap-2.5 pb-6">
			{#if oncancel}
				<Button variant="ghost" onclick={oncancel}>Cancel</Button>
			{/if}
			<Button variant="vibe" size="lg" type="submit" loading={submitting}>{submitLabel}</Button>
		</div>
	</div>

	<aside class="hidden lg:block">
		<div class="sticky top-0 space-y-3">
			<p class="text-xs font-bold tracking-[0.14em] text-lo-mute-400 uppercase">Live preview</p>
			<EventPreview {values} />
		</div>
	</aside>
</form>
