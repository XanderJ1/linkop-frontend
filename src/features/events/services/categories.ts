import type { IconSvgElement } from '@hugeicons/svelte';
import { PartyIcon, Briefcase01Icon, DrinkIcon, UserGroupIcon } from '@hugeicons/core-free-icons';

export type EventCategory = 'ENTERTAINMENT' | 'MEETING' | 'HAPPY_HOUR' | 'OTHER';

export interface CategoryVibe {
	label: string;
	tagline: string;
	icon: IconSvgElement;
	/** Classes for the small pill shown on cards */
	pill: string;
	/** Solid accent used for dots and highlights */
	dot: string;
}

export const CATEGORY_VIBES: Record<EventCategory, CategoryVibe> = {
	ENTERTAINMENT: {
		label: 'Party',
		tagline: 'Music, games, good energy',
		icon: PartyIcon,
		pill: 'bg-lo-pink/10 text-lo-pink border-lo-pink/25',
		dot: 'bg-lo-pink'
	},
	HAPPY_HOUR: {
		label: 'Happy hour',
		tagline: 'Drinks and easy conversation',
		icon: DrinkIcon,
		pill: 'bg-lo-sun/15 text-[#b5760a] border-lo-sun/30',
		dot: 'bg-lo-sun'
	},
	MEETING: {
		label: 'Meeting',
		tagline: 'Focused, formal, on the clock',
		icon: Briefcase01Icon,
		pill: 'bg-lo-sky/10 text-lo-sky border-lo-sky/25',
		dot: 'bg-lo-sky'
	},
	OTHER: {
		label: 'Meetup',
		tagline: 'People, ideas, a place to gather',
		icon: UserGroupIcon,
		pill: 'bg-lo-mint/12 text-[#128a6c] border-lo-mint/30',
		dot: 'bg-lo-mint'
	}
};

export function vibeFor(category: string | null | undefined): CategoryVibe {
	return CATEGORY_VIBES[(category as EventCategory) ?? 'OTHER'] ?? CATEGORY_VIBES.OTHER;
}
