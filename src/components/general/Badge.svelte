<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'default' | 'success' | 'danger' | 'warning' | 'info' | 'violet' | 'lime';
		size?: 'xs' | 'sm';
		/** Overrides variant colors entirely (used for category pills) */
		class?: string;
		icon?: Snippet;
		children: Snippet;
	}

	let { variant = 'default', size = 'sm', class: custom = '', icon, children }: Props = $props();

	const variantClasses = {
		default: 'bg-lo-mute-100 text-lo-mute-700 border-lo-mute-200',
		success: 'bg-lo-mint/12 text-[#128a6c] border-lo-mint/30',
		danger: 'bg-lo-coral/10 text-lo-coral border-lo-coral/25',
		warning: 'bg-lo-sun/15 text-[#b5760a] border-lo-sun/30',
		info: 'bg-lo-sky/10 text-lo-sky border-lo-sky/25',
		violet: 'bg-lo-violet/10 text-lo-violet border-lo-violet/25',
		lime: 'bg-lo-lime text-lo-ink border-lo-lime'
	};

	const sizeClasses = {
		xs: 'gap-1 px-2 py-0.5 text-[11px]',
		sm: 'gap-1.5 px-2.5 py-1 text-xs'
	};
</script>

<span
	class="inline-flex items-center rounded-full border font-semibold whitespace-nowrap
		{custom || variantClasses[variant]} {sizeClasses[size]}"
>
	{#if icon}
		<span class="flex shrink-0 items-center">{@render icon()}</span>
	{/if}
	{@render children()}
</span>
