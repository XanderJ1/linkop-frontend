<script lang="ts">
	import { untrack } from 'svelte';
	import Button from '$components/general/Button.svelte';
	import CoverPicker from '$features/events/components/create/CoverPicker.svelte';
	import EventCover from '$features/events/components/EventCover.svelte';
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

<form
	class="grid gap-x-8 gap-y-6 md:grid-cols-[300px_minmax(0,1fr)]"
	onsubmit={handleSubmit}
	novalidate
>
	<div class="space-y-4">
		<EventCover
			pictureUrl={values.imageUrl}
			seed={values.name}
			class="aspect-square w-full rounded-2xl shadow-card-hover"
		/>
		<CoverPicker bind:value={values.imageUrl} error={errors.imageUrl} />
	</div>

	<div class="min-w-0 space-y-4">
		{#if mode === 'create'}
			<div class="flex flex-wrap gap-1.5">
				{#each EVENT_TEMPLATES as t (t.id)}
					<button
						type="button"
						onclick={() => applyTemplate(t.id)}
						class="flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-medium
							transition-colors duration-150
							{activeTemplate === t.id
							? 'bg-lo-ink text-lo-white'
							: 'bg-lo-ink/6 text-lo-mute-600 hover:bg-lo-ink/10 hover:text-lo-ink'}"
					>
						<span aria-hidden="true">{t.emoji}</span>
						{t.label}
					</button>
				{/each}
			</div>
		{/if}

		<div>
			<label for="ev-name" class="sr-only">Event name</label>
			<input
				id="ev-name"
				class="w-full border-0 bg-transparent p-0 text-[2.5rem] leading-tight font-semibold tracking-tight
					text-lo-ink placeholder:text-lo-mute-300 focus:ring-0 focus:outline-none"
				placeholder="Event Name"
				bind:value={values.name}
				aria-invalid={!!errors.name}
			/>
			{#if errors.name}<p class="mt-1 text-xs font-medium text-lo-coral">{errors.name}</p>{/if}
		</div>

		<section class="lo-card space-y-4 p-4">
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
				<label for="ev-desc" class="lo-label">Description</label>
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

		<section class="lo-card space-y-4 p-4">
			<LocationPin
				bind:latitude={values.latitude}
				bind:longitude={values.longitude}
				error={errors.latitude ?? errors.longitude}
				disabled={pinLocked}
			/>
			<PrivacyPicker bind:value={values.privacy} />
		</section>

		<Button size="lg" type="submit" fullWidth loading={submitting}>{submitLabel}</Button>
		{#if oncancel}
			<Button variant="ghost" fullWidth onclick={oncancel}>Cancel</Button>
		{/if}
	</div>
</form>
