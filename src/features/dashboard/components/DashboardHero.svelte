<script lang="ts">
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { Location01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
	import Countdown from '$features/events/components/Countdown.svelte';
	import EventCover from '$features/events/components/EventCover.svelte';
	import { formatDateTime } from '$lib/helpers/datetime';
	import type { EventSummary } from '$features/events/services/types';

	interface Props {
		firstName: string;
		next: (EventSummary & { role: 'hosting' | 'invited' }) | null;
	}

	let { firstName, next }: Props = $props();
</script>

<section class="relative isolate overflow-hidden rounded-[32px] bg-lo-ink p-6 text-lo-white sm:p-8">
	<div
		class="absolute -top-24 -left-16 -z-10 h-72 w-72 animate-float rounded-full bg-lo-violet/60 blur-3xl"
	></div>
	<div
		class="absolute -right-10 -bottom-28 -z-10 h-72 w-72 animate-float-slow rounded-full bg-lo-coral/45 blur-3xl"
	></div>
	<div
		class="absolute top-10 right-1/3 -z-10 h-24 w-24 animate-float rounded-full bg-lo-lime/30 blur-2xl"
	></div>

	<div class="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
		<div>
			<p class="text-sm font-semibold text-lo-lime">Hey {firstName || 'there'} 👋</p>
			<h1 class="mt-2 text-4xl leading-[1.05] font-extrabold sm:text-5xl">
				What are we<br />getting into?
			</h1>
			<p class="mt-3 max-w-md text-[15px] text-lo-white/65">
				Throw a party, gather the crew or book the boardroom. LinkOp keeps your people and plans in
				one place.
			</p>
			<div class="mt-6 flex flex-wrap gap-3">
				<a
					href="/events/create"
					class="btn-vibe inline-flex h-12 items-center gap-2 rounded-full px-6 text-[15px] font-bold"
				>
					Host an event
				</a>
				<a
					href="/invites"
					class="inline-flex h-12 items-center gap-2 rounded-full border border-lo-white/20 px-6
						text-[15px] font-semibold text-lo-white transition-colors hover:bg-lo-white/10"
				>
					See my invites
				</a>
			</div>
		</div>

		{#if next}
			<a
				href="/events/{next.id}"
				class="group block overflow-hidden rounded-[26px] bg-lo-white/8 ring-1 ring-lo-white/15
					backdrop-blur transition-transform duration-300 hover:-translate-y-1"
			>
				<EventCover pictureUrl={next.pictureUrl} seed={next.id} class="h-28">
					<div class="flex h-full items-start justify-between p-3">
						<span class="rounded-full bg-lo-white/90 px-2.5 py-1 text-[11px] font-bold text-lo-ink">
							Up next · {next.role === 'hosting' ? 'Hosting' : 'Invited'}
						</span>
					</div>
				</EventCover>
				<div class="space-y-3 p-4">
					<div>
						<p class="truncate font-display text-xl font-bold">{next.eventName}</p>
						<p class="mt-0.5 flex items-center gap-1.5 text-xs text-lo-white/60">
							{formatDateTime(next.eventDate)}
						</p>
						<p class="mt-0.5 flex items-center gap-1.5 truncate text-xs text-lo-white/60">
							<HugeiconsIcon icon={Location01Icon} size={12} color="currentColor" strokeWidth={2} />
							{next.locationName}
						</p>
					</div>
					<div class="flex items-end justify-between gap-2">
						<Countdown to={next.eventDate} tone="light" />
						<span
							class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lo-lime text-lo-ink
								transition-transform group-hover:translate-x-1"
						>
							<HugeiconsIcon
								icon={ArrowRight01Icon}
								size={16}
								color="currentColor"
								strokeWidth={2.4}
							/>
						</span>
					</div>
				</div>
			</a>
		{:else}
			<div class="rounded-[26px] border border-dashed border-lo-white/25 p-6 text-center">
				<p class="font-display text-xl font-bold">Your calendar is wide open</p>
				<p class="mt-1 text-sm text-lo-white/60">
					Nothing coming up yet. That's a sign to plan something.
				</p>
			</div>
		{/if}
	</div>
</section>
