export type GuestStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'CANCELLED';

export interface PersonSummary {
	id: string;
	firstname: string;
	lastname: string;
	email?: string;
	profilePictureUrl?: string | null;
}

export interface GuestSummary {
	id: string;
	status: GuestStatus | string;
	userid?: string;
	invitedAt?: string;
	user?: PersonSummary;
}

export interface EventSummary {
	id: string;
	eventName: string;
	eventDescription: string;
	eventDate: string;
	locationName: string;
	privacy?: EventPrivacy | string;
	eventLocation?: GeoPoint | null;
	pictureUrl: string;
	category: string;
	creatorId: string;
	creator?: PersonSummary;
	guests: GuestSummary[];
}

export type EventPrivacy = 'PUBLIC' | 'PRIVATE';

export interface GeoPoint {
	id: string;
	latitude: number;
	longitude: number;
}

export interface EventFormValues {
	name: string;
	description: string;
	/** `YYYY-MM-DDTHH:mm` from <input type="datetime-local"> */
	date: string;
	location: string;
	imageUrl: string;
	privacy: EventPrivacy;
	latitude: number | null;
	longitude: number | null;
}

export function mapsUrl(point: Pick<GeoPoint, 'latitude' | 'longitude'>) {
	return `https://www.openstreetmap.org/?mlat=${point.latitude}&mlon=${point.longitude}#map=16/${point.latitude}/${point.longitude}`;
}

export function isUpcoming(event: Pick<EventSummary, 'eventDate'>) {
	return new Date(event.eventDate).getTime() >= Date.now();
}

export function goingCount(event: Pick<EventSummary, 'guests'>) {
	return event.guests.filter((g) => g.status === 'ACCEPTED').length;
}

/** "in 3 days", "tomorrow", "2 hours ago" */
export function relativeWhen(date: string | Date): string {
	const diffMs = new Date(date).getTime() - Date.now();
	const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
	const mins = Math.round(diffMs / 60_000);
	if (Math.abs(mins) < 60) return rtf.format(mins, 'minute');
	const hours = Math.round(mins / 60);
	if (Math.abs(hours) < 24) return rtf.format(hours, 'hour');
	const days = Math.round(hours / 24);
	if (Math.abs(days) < 30) return rtf.format(days, 'day');
	return rtf.format(Math.round(days / 30), 'month');
}
