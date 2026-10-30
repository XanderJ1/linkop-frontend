<script lang="ts">
	interface Props {
		variant?: 'line' | 'block' | 'circle';
		width?: string;
		height?: string;
		rounded?: string;
		class?: string;
	}

	let { variant = 'line', width, height, rounded, class: extraClass = '' }: Props = $props();

	const variantDefaults = {
		line: 'h-4 rounded-lg',
		block: 'h-10 rounded-2xl',
		circle: 'rounded-full'
	};
</script>

<div
	class="skeleton {variantDefaults[variant]} {extraClass}"
	style="{width ? `width: ${width};` : ''} {height ? `height: ${height};` : ''} {rounded
		? `border-radius: ${rounded};`
		: ''}"
></div>

<style>
	@keyframes shimmer {
		0% {
			background-position: -600px 0;
		}
		100% {
			background-position: 600px 0;
		}
	}

	.skeleton {
		background: linear-gradient(90deg, #ebe5de 25%, #f5f1ec 50%, #ebe5de 75%);
		background-size: 600px 100%;
		animation: shimmer 1.6s ease-in-out infinite;
	}
</style>
