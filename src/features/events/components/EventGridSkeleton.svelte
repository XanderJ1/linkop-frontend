<script lang="ts">
	import Skeleton from '$components/custom/Skeleton.svelte';

	interface Props {
		count?: number;
	}

	let { count = 6 }: Props = $props();
</script>

<div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
	{#each Array(count) as _, i (i)}
		<div class="overflow-hidden rounded-[26px] border border-lo-mute-200/70 bg-lo-white">
			<Skeleton variant="block" height="160px" rounded="0" />
			<div class="space-y-3 p-4">
				<Skeleton width="40%" height="12px" />
				<Skeleton width="80%" height="18px" />
				<Skeleton width="60%" height="12px" />
			</div>
		</div>
	{/each}
</div>
