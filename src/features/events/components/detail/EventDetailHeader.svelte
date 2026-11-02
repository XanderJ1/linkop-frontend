<script lang="ts">
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { Location01Icon, SquareLock02Icon } from '@hugeicons/core-free-icons';
	import Badge from '$components/general/Badge.svelte';
	import CategoryBadge from '$features/events/components/CategoryBadge.svelte';
	import { formatTime } from '$lib/helpers/datetime';
	import { mapsUrl, relativeWhen, type EventSummary } from '$features/events/services/types';

	interface Props {
		event: EventSummary;
	}

	let { event }: Props = $props();

	const date = $derived(new Date(event.eventDate));
	const month = $derived(date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase());
	const longDate = $derived(
		date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
	);
</script>

<header>
	<div class="flex flex-wrap items-center gap-1.5">
		<CategoryBadge category={event.category} size="xs" />
		{#if event.privacy === 'PRIVATE'}
			<Badge size="xs">
				{#snippet icon()}
					<HugeiconsIcon icon={SquareLock02Icon} size={11} color="currentColor" strokeWidth={2} />
				{/snippet}
				Private
			</Badge>
		{/if}
	</div>

	<h1 class="mt-3 text-[2.5rem] leading-[1.1] font-semibold tracking-tight text-lo-ink">
		{event.eventName}
	</h1>

	<div class="mt-5 space-y-3">
		<div class="flex items-center gap-3">
			<div
				class="flex size-11 shrink-0 flex-col overflow-hidden rounded-lg border border-lo-ink/10 text-center"
				aria-hidden="true"
			>
				<span class="bg-lo-ink/5 py-px text-[9px] font-medium text-lo-mute-500">{month}</span>
				<span class="flex flex-1 items-center justify-center text-base leading-none font-medium">
					{date.getDate()}
				</span>
			</div>
			<div class="min-w-0">
				<p class="font-medium text-lo-ink">{longDate}</p>
				<p class="text-sm text-lo-mute-500">
					{formatTime(event.eventDate)} · {relativeWhen(event.eventDate)}
				</p>
			</div>
		</div>

		<div class="flex items-center gap-3">
			<div
				class="grid size-11 shrink-0 place-items-center rounded-lg border border-lo-ink/10 text-lo-mute-500"
				aria-hidden="true"
			>
				<HugeiconsIcon icon={Location01Icon} size={18} color="currentColor" strokeWidth={1.8} />
			</div>
			<div class="min-w-0">
				<p class="truncate font-medium text-lo-ink">{event.locationName}</p>
				{#if event.eventLocation}
					<a
						href={mapsUrl(event.eventLocation)}
						target="_blank"
						rel="noopener noreferrer"
						class="text-sm text-lo-mute-500 transition-colors hover:text-lo-ink"
					>
						View on map
					</a>
				{/if}
			</div>
		</div>
	</div>
</header>
