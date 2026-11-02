<script lang="ts">
	import Skeleton from '$components/custom/Skeleton.svelte';
</script>

<div class="grid gap-8 md:grid-cols-[300px_minmax(0,1fr)]">
	<Skeleton variant="block" height="300px" rounded="16px" />
	<div class="space-y-4">
		<Skeleton width="20%" height="20px" />
		<Skeleton width="80%" height="40px" />
		<Skeleton width="50%" height="44px" />
		<Skeleton width="50%" height="44px" />
		<Skeleton variant="block" height="120px" rounded="12px" />
	</div>
</div>
