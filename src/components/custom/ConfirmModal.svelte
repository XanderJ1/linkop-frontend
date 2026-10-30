<script lang="ts">
	import Modal from '$components/custom/Modal.svelte';
	import Button from '$components/general/Button.svelte';

	interface Props {
		open: boolean;
		title: string;
		description: string;
		confirmLabel?: string;
		loading?: boolean;
		onconfirm: () => void;
		onclose: () => void;
	}

	let {
		open,
		title,
		description,
		confirmLabel = 'Delete',
		loading = false,
		onconfirm,
		onclose
	}: Props = $props();
</script>

<Modal {open} {onclose} {title} size="sm">
	<p class="text-sm text-lo-mute-600">{description}</p>

	{#snippet footer()}
		<Button variant="secondary" onclick={onclose}>Keep it</Button>
		<Button variant="danger" {loading} onclick={onconfirm}>{confirmLabel}</Button>
	{/snippet}
</Modal>
