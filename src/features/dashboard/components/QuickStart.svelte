<script lang="ts">
	import EventCover from '$features/events/components/EventCover.svelte';
	import { EVENT_TEMPLATES } from '$features/events/components/create/templates';
</script>

<section>
	<div class="mb-3 flex items-end justify-between">
		<div>
			<h2 class="text-xl font-bold">Pick a vibe</h2>
			<p class="text-sm text-lo-mute-500">Start from a template and make it yours.</p>
		</div>
	</div>
	<div class="grid grid-cols-2 gap-3 md:grid-cols-4">
		{#each EVENT_TEMPLATES as t, i (t.id)}
			<a
				href="/events/create?template={t.id}"
				class="group animate-rise overflow-hidden rounded-3xl transition-transform duration-300
					hover:-translate-y-1 hover:rotate-[-1deg]"
				style="animation-delay: {i * 60}ms"
			>
				<EventCover pictureUrl={t.cover} class="h-32">
					<div class="flex h-full flex-col justify-between p-4">
						<span
							class="text-3xl transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12"
							aria-hidden="true">{t.emoji}</span
						>
						<span
							class="font-display text-lg leading-tight font-bold
								{t.id === 'happy-hour' ? 'text-lo-ink' : 'text-white drop-shadow'}"
						>
							{t.label}
						</span>
					</div>
				</EventCover>
			</a>
		{/each}
	</div>
</section>
