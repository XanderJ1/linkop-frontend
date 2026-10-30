/**
 * Built-in event covers. The backend stores the cover as a plain string
 * (`pictureUrl`), so a preset is saved as `linkop:cover/<id>` and rendered
 * as CSS art — no image hosting needed. Real URLs are rendered as images.
 */
export const COVER_PREFIX = 'linkop:cover/';

export interface CoverPreset {
	id: string;
	name: string;
	/** Base gradient */
	base: string;
	/** Three floating blob colors */
	blobs: [string, string, string];
	/** Text color that reads on top of the cover */
	ink: 'light' | 'dark';
}

export const COVER_PRESETS: CoverPreset[] = [
	{
		id: 'sunset',
		name: 'Sunset',
		base: 'linear-gradient(135deg, #ff6a55 0%, #ff4fa3 55%, #6c3cf5 100%)',
		blobs: ['#ffb21f', '#ff4fa3', '#ffd6a8'],
		ink: 'light'
	},
	{
		id: 'grape',
		name: 'Grape soda',
		base: 'linear-gradient(140deg, #6c3cf5 0%, #9b5cff 50%, #ff4fa3 100%)',
		blobs: ['#c9f24c', '#3a7bff', '#ff8fd0'],
		ink: 'light'
	},
	{
		id: 'citrus',
		name: 'Citrus',
		base: 'linear-gradient(135deg, #c9f24c 0%, #ffe066 50%, #ffb21f 100%)',
		blobs: ['#1fc29a', '#ff6a55', '#fff6c2'],
		ink: 'dark'
	},
	{
		id: 'lagoon',
		name: 'Lagoon',
		base: 'linear-gradient(135deg, #1fc29a 0%, #3a7bff 60%, #6c3cf5 100%)',
		blobs: ['#c9f24c', '#7fe7ff', '#3a7bff'],
		ink: 'light'
	},
	{
		id: 'midnight',
		name: 'Boardroom',
		base: 'linear-gradient(150deg, #17112b 0%, #2a2160 55%, #3a7bff 100%)',
		blobs: ['#6c3cf5', '#3a7bff', '#9fb8ff'],
		ink: 'light'
	},
	{
		id: 'peach',
		name: 'Peach fuzz',
		base: 'linear-gradient(135deg, #ffd6c2 0%, #ffb3a7 50%, #ff8fd0 100%)',
		blobs: ['#ffb21f', '#ffffff', '#ff6a55'],
		ink: 'dark'
	}
];

export function presetUrl(id: string) {
	return `${COVER_PREFIX}${id}`;
}

export function resolveCover(
	pictureUrl: string | null | undefined,
	seed = ''
): {
	preset: CoverPreset | null;
	imageUrl: string | null;
} {
	if (pictureUrl?.startsWith(COVER_PREFIX)) {
		const id = pictureUrl.slice(COVER_PREFIX.length);
		return {
			preset: COVER_PRESETS.find((p) => p.id === id) ?? fallbackPreset(seed),
			imageUrl: null
		};
	}
	if (pictureUrl && /^https?:\/\//.test(pictureUrl)) {
		return { preset: fallbackPreset(seed), imageUrl: pictureUrl };
	}
	return { preset: fallbackPreset(seed), imageUrl: null };
}

/** Deterministic preset per event so covers without art still look distinct */
export function fallbackPreset(seed: string): CoverPreset {
	const hash = seed.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
	return COVER_PRESETS[hash % COVER_PRESETS.length];
}
