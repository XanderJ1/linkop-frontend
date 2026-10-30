<script lang="ts">
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { Gps01Icon, MapsLocation01Icon } from '@hugeicons/core-free-icons';
	import Button from '$components/general/Button.svelte';
	import { mapsUrl } from '$features/events/services/types';

	interface Props {
		latitude: number | null;
		longitude: number | null;
		error?: string;
		/** Coordinates can't be changed when the event has no saved location yet */
		disabled?: boolean;
	}

	let {
		latitude = $bindable(),
		longitude = $bindable(),
		error,
		disabled = false
	}: Props = $props();

	let locating = $state(false);
	let geoError = $state<string | null>(null);

	const hasPin = $derived(latitude !== null && longitude !== null);

	function useMyLocation() {
		if (!('geolocation' in navigator)) {
			geoError = "Your browser can't share its location";
			return;
		}
		locating = true;
		geoError = null;
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				latitude = Number(pos.coords.latitude.toFixed(6));
				longitude = Number(pos.coords.longitude.toFixed(6));
				locating = false;
			},
			(err) => {
				geoError =
					err.code === err.PERMISSION_DENIED
						? 'Location access was blocked. Enter the coordinates instead.'
						: "Couldn't find your location. Enter the coordinates instead.";
				locating = false;
			},
			{ enableHighAccuracy: true, timeout: 10_000 }
		);
	}

	function parse(value: string): number | null {
		const n = Number.parseFloat(value);
		return Number.isFinite(n) ? n : null;
	}
</script>

<div class="space-y-3">
	<div class="flex flex-wrap items-center justify-between gap-2">
		<div>
			<p class="lo-label mb-0!">Map pin</p>
			<p class="text-xs text-lo-mute-500">Used to show the event to people nearby.</p>
		</div>
		<Button variant="soft" size="sm" loading={locating} {disabled} onclick={useMyLocation}>
			<HugeiconsIcon icon={Gps01Icon} size={14} color="currentColor" strokeWidth={2} />
			Use my location
		</Button>
	</div>

	<div class="grid grid-cols-2 gap-3">
		<input
			class="lo-input"
			type="number"
			step="any"
			inputmode="decimal"
			placeholder="Latitude"
			aria-label="Latitude"
			{disabled}
			value={latitude ?? ''}
			oninput={(e) => (latitude = parse(e.currentTarget.value))}
			aria-invalid={!!error}
		/>
		<input
			class="lo-input"
			type="number"
			step="any"
			inputmode="decimal"
			placeholder="Longitude"
			aria-label="Longitude"
			{disabled}
			value={longitude ?? ''}
			oninput={(e) => (longitude = parse(e.currentTarget.value))}
			aria-invalid={!!error}
		/>
	</div>

	{#if error || geoError}
		<p class="text-xs font-medium text-lo-coral">{error ?? geoError}</p>
	{:else if disabled}
		<p class="text-xs text-lo-mute-500">
			This event was saved without a pin, so it can't get one yet.
		</p>
	{:else if hasPin}
		<a
			href={mapsUrl({ latitude: latitude!, longitude: longitude! })}
			target="_blank"
			rel="noopener noreferrer"
			class="inline-flex items-center gap-1.5 text-xs font-semibold text-lo-violet hover:underline"
		>
			<HugeiconsIcon icon={MapsLocation01Icon} size={14} color="currentColor" strokeWidth={2} />
			Check the pin on the map
		</a>
	{/if}
</div>
