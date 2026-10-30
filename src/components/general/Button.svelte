<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'primary' | 'vibe' | 'secondary' | 'ghost' | 'soft' | 'danger' | 'softdanger';
		size?: 'sm' | 'md' | 'lg';
		disabled?: boolean;
		loading?: boolean;
		type?: 'button' | 'submit' | 'reset';
		fullWidth?: boolean;
		title?: string;
		/** Renders an anchor instead of a button */
		href?: string;
		onclick?: (e: MouseEvent) => void;
		children?: Snippet;
	}

	let {
		variant = 'primary',
		size = 'md',
		disabled = false,
		loading = false,
		type = 'button',
		fullWidth = false,
		title = '',
		href,
		onclick,
		children
	}: Props = $props();

	const sizeClasses = {
		sm: 'h-8 px-3 text-xs gap-1.5',
		md: 'h-10 px-4 text-sm gap-2',
		lg: 'h-12 px-6 text-[15px] gap-2.5'
	};

	const variantClasses = {
		primary:
			'bg-lo-ink text-lo-white hover:bg-lo-violet-deep shadow-[0_6px_18px_-8px_rgba(23,17,43,0.6)]',
		vibe: 'btn-vibe text-lo-white shadow-[0_10px_24px_-10px_rgba(108,60,245,0.8)]',
		secondary:
			'bg-lo-white text-lo-ink border border-lo-mute-200 hover:border-lo-mute-300 hover:bg-lo-mute-50',
		ghost: 'bg-transparent text-lo-mute-600 hover:bg-lo-mute-100 hover:text-lo-ink',
		soft: 'bg-lo-violet/8 text-lo-violet hover:bg-lo-violet/14',
		danger: 'bg-lo-coral text-lo-white hover:brightness-95',
		softdanger: 'bg-lo-white text-lo-coral border border-lo-mute-200 hover:bg-lo-coral/6'
	};

	const isDisabled = $derived(disabled || loading);
	const classes = $derived(
		`inline-flex shrink-0 items-center justify-center rounded-full font-semibold whitespace-nowrap
		transition-all duration-200 active:scale-[0.97]
		${variantClasses[variant]} ${sizeClasses[size]}
		${fullWidth ? 'w-full' : ''}
		${isDisabled ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`
	);
</script>

{#if href && !isDisabled}
	<a {href} {title} class={classes}>
		{@render children?.()}
	</a>
{:else}
	<button {type} {title} disabled={isDisabled} {onclick} class={classes}>
		{#if loading}
			<span
				class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-r-transparent"
			></span>
		{/if}
		{@render children?.()}
	</button>
{/if}
