<script lang="ts">
	interface Props {
		label?: string;
	}

	let { label = 'Getting the room ready…' }: Props = $props();
</script>

<div class="flex min-h-75 flex-1 flex-col items-center justify-center gap-5">
	<div class="relative h-16 w-24" aria-hidden="true">
		<span class="ring ring-a"></span>
		<span class="ring ring-b"></span>
		<span class="spark"></span>
	</div>
	<p class="text-sm font-medium text-lo-mute-500">{label}</p>
</div>

<style>
	.ring {
		position: absolute;
		top: 50%;
		width: 52px;
		height: 52px;
		margin-top: -26px;
		border-radius: 9999px;
		border: 6px solid;
	}

	.ring-a {
		left: 10px;
		border-color: #6c3cf5;
		animation: link-a 1.6s cubic-bezier(0.6, 0, 0.4, 1) infinite;
	}

	.ring-b {
		right: 10px;
		border-color: #ff6a55;
		mix-blend-mode: multiply;
		animation: link-b 1.6s cubic-bezier(0.6, 0, 0.4, 1) infinite;
	}

	.spark {
		position: absolute;
		top: 2px;
		right: 0;
		width: 12px;
		height: 12px;
		border-radius: 9999px;
		background: #c9f24c;
		animation: pop 1.6s ease-in-out infinite;
	}

	@keyframes link-a {
		0%,
		100% {
			transform: translateX(-10px);
		}
		50% {
			transform: translateX(4px);
		}
	}

	@keyframes link-b {
		0%,
		100% {
			transform: translateX(10px);
		}
		50% {
			transform: translateX(-4px);
		}
	}

	@keyframes pop {
		0%,
		40%,
		100% {
			transform: scale(0.4);
			opacity: 0;
		}
		55% {
			transform: scale(1.2);
			opacity: 1;
		}
		75% {
			transform: scale(1);
			opacity: 1;
		}
	}
</style>
