import type { EventSummary } from './types';

/** Only allow the calendar editor the API is expected to return. */
export function safeCalendarUrl(value: unknown): string | null {
	if (typeof value !== 'string') return null;
	try {
		const url = new URL(value);
		return url.origin === 'https://calendar.google.com' &&
			url.pathname === '/calendar/r/eventedit' &&
			!url.username &&
			!url.password &&
			url.searchParams.get('action') === 'TEMPLATE'
			? url.href
			: null;
	} catch {
		return null;
	}
}

/** Rebuild the same draft after a page reload, without submitting another RSVP. */
export function googleCalendarUrl(
	event: Pick<
		EventSummary,
		'eventName' | 'eventDescription' | 'locationName' | 'eventDate' | 'eventEndDate'
	>
): string | null {
	const start = new Date(event.eventDate);
	const end = new Date(event.eventEndDate);
	if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end <= start)
		return null;
	const format = (date: Date) =>
		date
			.toISOString()
			.replace(/[-:]/g, '')
			.replace(/\.\d{3}Z$/, 'Z');
	const url = new URL('https://calendar.google.com/calendar/r/eventedit');
	url.search = new URLSearchParams({
		action: 'TEMPLATE',
		text: event.eventName,
		details: event.eventDescription,
		location: event.locationName,
		dates: `${format(start)}/${format(end)}`
	}).toString();
	return url.href;
}

interface AcceptanceResponse {
	data: { acceptEvent: { success: boolean; message: string | null; result: string | null } } | null;
	errors?: readonly { message: string }[] | null;
}

export async function acceptInvitation(run: () => Promise<AcceptanceResponse>): Promise<string> {
	const response = await run();
	if (response.errors?.length) throw new Error(response.errors[0].message);
	const result = response.data?.acceptEvent;
	if (!result?.success)
		throw new Error(result?.message || "Couldn't accept this invitation. Please try again.");
	const calendarUrl = safeCalendarUrl(result.result);
	if (!calendarUrl)
		throw new Error(
			'Your invitation was accepted, but the calendar link is unavailable. Refresh to try again.'
		);
	return calendarUrl;
}
