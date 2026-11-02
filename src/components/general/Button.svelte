<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'primary' | 'secondary' | 'ghost' | 'soft' | 'danger' | 'softdanger';
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
		sm: 'h-8 px-3 text-[13px] gap-1.5',
		md: 'h-9.5 px-4 text-sm gap-2',
		lg: 'h-11 px-5 text-base gap-2'
	};

	const variantClasses = {
		primary: 'bg-lo-ink text-lo-white hover:bg-lo-mute-700',
		secondary: 'bg-lo-ink/6 text-lo-mute-800 hover:bg-lo-ink/10 hover:text-lo-ink',
		ghost: 'bg-transparent text-lo-mute-600 hover:bg-lo-ink/6 hover:text-lo-ink',
		soft: 'bg-lo-ink/6 text-lo-mute-800 hover:bg-lo-ink/10 hover:text-lo-ink',
		danger: 'bg-lo-coral text-lo-white hover:brightness-95',
		softdanger: 'bg-lo-coral/10 text-lo-coral hover:bg-lo-coral/15'
	};

	const isDisabled = $derived(disabled || loading);
	const classes = $derived(
		`inline-flex shrink-0 items-center justify-center rounded-full font-medium whitespace-nowrap
		transition-colors duration-150 active:scale-[0.98]
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
