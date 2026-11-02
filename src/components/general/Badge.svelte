<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'default' | 'success' | 'danger' | 'warning' | 'info' | 'violet' | 'strong';
		size?: 'xs' | 'sm';
		/** Overrides variant colors entirely (used for category pills) */
		class?: string;
		icon?: Snippet;
		children: Snippet;
	}

	let { variant = 'default', size = 'sm', class: custom = '', icon, children }: Props = $props();

	const variantClasses = {
		default: 'bg-lo-ink/6 text-lo-mute-600 border-transparent',
		success: 'bg-lo-mint/12 text-[#128a6c] border-transparent',
		danger: 'bg-lo-coral/10 text-lo-coral border-transparent',
		warning: 'bg-lo-sun/15 text-[#b5760a] border-transparent',
		info: 'bg-lo-sky/10 text-lo-sky border-transparent',
		violet: 'bg-lo-violet/10 text-lo-violet border-transparent',
		strong: 'bg-lo-ink text-lo-white border-lo-ink'
	};

	const sizeClasses = {
		xs: 'gap-1 px-2 py-0.5 text-[11px]',
		sm: 'gap-1.5 px-2.5 py-1 text-xs'
	};
</script>

<span
	class="inline-flex items-center rounded-full border font-medium whitespace-nowrap
		{custom || variantClasses[variant]} {sizeClasses[size]}"
>
	{#if icon}
		<span class="flex shrink-0 items-center">{@render icon()}</span>
	{/if}
	{@render children()}
</span>
