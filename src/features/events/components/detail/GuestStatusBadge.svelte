<script lang="ts">
	import Badge from '$components/general/Badge.svelte';

	interface Props {
		status: string;
	}

	let { status }: Props = $props();

	const map: Record<
		string,
		{ label: string; variant: 'success' | 'danger' | 'warning' | 'default' }
	> = {
		ACCEPTED: { label: 'Going', variant: 'success' },
		DECLINED: { label: "Can't make it", variant: 'danger' },
		CANCELLED: { label: 'Cancelled', variant: 'default' },
		PENDING: { label: 'Invited', variant: 'warning' }
	};

	const s = $derived(map[status] ?? map.PENDING);
</script>

<Badge variant={s.variant} size="xs">{s.label}</Badge>
