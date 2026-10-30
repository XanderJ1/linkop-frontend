<script lang="ts">
	import Skeleton from '$components/custom/Skeleton.svelte';
</script>

<div class="space-y-6">
	<Skeleton variant="block" height="320px" rounded="32px" />
	<div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
		<div class="lo-card space-y-3 p-6">
			<Skeleton width="30%" />
			<Skeleton width="90%" />
			<Skeleton width="80%" />
			<Skeleton width="60%" />
		</div>
		<div class="lo-card space-y-3 p-6">
			<Skeleton width="50%" />
			<Skeleton variant="block" height="60px" />
			<Skeleton width="70%" />
		</div>
	</div>
</div>
