<script lang="ts">
	interface Props {
		firstName?: string | null;
		lastName?: string | null;
		id?: string | null;
		photoUrl?: string | null;
		size?: 'xs' | 'sm' | 'md' | 'lg';
		ring?: boolean;
	}

	let { firstName, lastName, id, photoUrl, size = 'md', ring = false }: Props = $props();

	const PALETTE = [
		'bg-lo-violet text-lo-white',
		'bg-lo-coral text-lo-white',
		'bg-lo-lime text-lo-ink',
		'bg-lo-sun text-lo-ink',
		'bg-lo-sky text-lo-white',
		'bg-lo-mint text-lo-ink',
		'bg-lo-pink text-lo-white'
	];

	const sizeClasses = {
		xs: 'h-6 w-6 text-[10px]',
		sm: 'h-8 w-8 text-xs',
		md: 'h-10 w-10 text-sm',
		lg: 'h-16 w-16 text-xl'
	};

	let imageFailed = $state(false);

	const initials = $derived(
		[firstName?.[0], lastName?.[0]].filter(Boolean).join('').toUpperCase() || '?'
	);
	const colorClass = $derived.by(() => {
		const seed = id || `${firstName}${lastName}`;
		const hash = seed.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
		return PALETTE[hash % PALETTE.length];
	});
</script>

<span
	class="relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full
		font-display font-bold {sizeClasses[size]} {colorClass}
		{ring ? 'ring-[3px] ring-lo-white' : ''}"
	title={[firstName, lastName].filter(Boolean).join(' ')}
>
	{#if photoUrl && !imageFailed}
		<img
			src={photoUrl}
			alt=""
			class="h-full w-full object-cover"
			onerror={() => (imageFailed = true)}
		/>
	{:else}
		{initials}
	{/if}
</span>
