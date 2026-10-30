import { presetUrl } from '$features/events/services/covers';

export interface EventTemplate {
	id: string;
	label: string;
	emoji: string;
	cover: string;
	name: string;
	description: string;
}

/** Starting points that pre-fill the cover and copy on the event form */
export const EVENT_TEMPLATES: EventTemplate[] = [
	{
		id: 'meetup',
		label: 'Casual meetup',
		emoji: '👋',
		cover: presetUrl('lagoon'),
		name: 'Coffee & catch-up',
		description:
			"Low-key hang to meet new people and catch up with familiar faces. Come as you are — we'll save you a seat."
	},
	{
		id: 'party',
		label: 'Party',
		emoji: '🎉',
		cover: presetUrl('sunset'),
		name: 'Friday night function',
		description: 'Good music, better people. Bring your energy and maybe a friend or two.'
	},
	{
		id: 'happy-hour',
		label: 'Happy hour',
		emoji: '🍹',
		cover: presetUrl('citrus'),
		name: 'Rooftop happy hour',
		description:
			'Unwind after work with drinks, snacks and easy conversation. First round is on the host.'
	},
	{
		id: 'meeting',
		label: 'Formal meeting',
		emoji: '💼',
		cover: presetUrl('midnight'),
		name: 'Quarterly planning session',
		description:
			'Agenda:\n1. Review of last quarter\n2. Priorities for the next quarter\n3. Open questions\n\nPlease arrive 5 minutes early.'
	}
];
