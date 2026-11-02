<script lang="ts">
	import Skeleton from '$components/custom/Skeleton.svelte';

	interface Props {
		count?: number;
	}

	let { count = 3 }: Props = $props();
</script>

<div class="space-y-3 sm:pl-37">
	{#each Array(count) as _, i (i)}
		<div class="lo-card flex gap-4 p-4">
			<div class="flex-1 space-y-2.5">
				<Skeleton width="25%" height="12px" />
				<Skeleton width="65%" height="18px" />
				<Skeleton width="45%" height="12px" />
			</div>
			<Skeleton variant="block" width="112px" height="112px" rounded="8px" />
		</div>
	{/each}
</div>
