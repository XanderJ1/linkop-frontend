<script lang="ts">
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { Location01Icon, Calendar03Icon } from '@hugeicons/core-free-icons';
	import EventCover from '$features/events/components/EventCover.svelte';
	import UserAvatar from '$features/users/components/UserAvatar.svelte';
	import { formatDateTime } from '$lib/helpers/datetime';
	import { session } from '$stores/session.store.svelte';
	import type { EventFormValues } from '$features/events/services/types';

	interface Props {
		values: EventFormValues;
	}

	let { values }: Props = $props();

	const when = $derived.by(() => {
		if (!values.date) return 'Pick a date';
		try {
			return formatDateTime(values.date);
		} catch {
			return 'Pick a date';
		}
	});
</script>

<div
	class="overflow-hidden rounded-[28px] border border-lo-mute-200/70 bg-lo-white shadow-[0_30px_60px_-35px_rgba(23,17,43,0.5)]"
>
	<EventCover pictureUrl={values.imageUrl} seed={values.name} class="h-52" animated>
		<div class="flex h-full flex-col justify-end p-5">
			<p class="text-[11px] font-bold tracking-[0.16em] text-white/80 uppercase drop-shadow">
				You're invited
			</p>
			<h3 class="mt-1 line-clamp-2 text-2xl leading-tight font-extrabold text-white drop-shadow-md">
				{values.name || 'Your event name'}
			</h3>
		</div>
	</EventCover>

	<div class="space-y-3 p-5">
		<p class="flex items-center gap-2 text-sm font-semibold text-lo-ink">
			<span
				class="flex h-8 w-8 items-center justify-center rounded-xl bg-lo-violet/10 text-lo-violet"
			>
				<HugeiconsIcon icon={Calendar03Icon} size={16} color="currentColor" strokeWidth={2} />
			</span>
			{when}
		</p>
		<p class="flex items-center gap-2 text-sm font-semibold text-lo-ink">
			<span
				class="flex h-8 w-8 items-center justify-center rounded-xl bg-lo-coral/10 text-lo-coral"
			>
				<HugeiconsIcon icon={Location01Icon} size={16} color="currentColor" strokeWidth={2} />
			</span>
			<span class="truncate">{values.location || 'Somewhere fun'}</span>
		</p>
		<p class="line-clamp-4 text-sm leading-relaxed whitespace-pre-line text-lo-mute-600">
			{values.description || 'Add a description so people know what to expect.'}
		</p>
		<div class="flex items-center gap-2 border-t border-lo-mute-100 pt-3 text-xs text-lo-mute-500">
			<UserAvatar
				firstName={session.user?.firstname}
				lastName={session.user?.lastname}
				id={session.user?.id}
				size="xs"
			/>
			Hosted by {session.user?.firstname ?? 'you'}
		</div>
	</div>
</div>
