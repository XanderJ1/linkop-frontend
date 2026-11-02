<script lang="ts">
	import EventCover from '$features/events/components/EventCover.svelte';
	import { EVENT_TEMPLATES } from '$features/events/components/create/templates';
</script>

<section>
	<h2 class="mb-3 text-xl font-semibold text-lo-ink">Start from a template</h2>
	<div class="grid gap-3 sm:grid-cols-2">
		{#each EVENT_TEMPLATES as t (t.id)}
			<a
				href="/events/create?template={t.id}"
				class="lo-card flex items-center gap-3 p-3 transition-shadow duration-200 hover:shadow-card-hover"
			>
				<EventCover pictureUrl={t.cover} class="size-11 shrink-0 rounded-lg">
					<span class="flex h-full items-center justify-center text-lg" aria-hidden="true">
						{t.emoji}
					</span>
				</EventCover>
				<span class="min-w-0">
					<span class="block truncate font-medium text-lo-ink">{t.label}</span>
					<span class="block truncate text-sm text-lo-mute-500">{t.name}</span>
				</span>
			</a>
		{/each}
	</div>
</section>
