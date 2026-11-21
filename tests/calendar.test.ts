import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
	acceptInvitation,
	googleCalendarUrl,
	safeCalendarUrl
} from '../src/features/events/services/calendar.ts';
import { validateEvent } from '../src/features/events/services/eventSchema.ts';
import type { EventFormValues } from '../src/features/events/services/types.ts';

const event = {
	eventName: 'Calendar test & lunch ☕',
	eventDescription: 'Bring notes\nDiscuss A+B & C',
	locationName: 'Test meeting room',
	eventDate: '2026-11-28T10:00:00+02:00',
	eventEndDate: '2026-11-28T11:30:00+02:00'
};

test('calendar draft preserves text, location and UTC start/end times', () => {
	const url = new URL(googleCalendarUrl(event)!);
	assert.equal(url.origin, 'https://calendar.google.com');
	assert.equal(url.searchParams.get('text'), event.eventName);
	assert.equal(url.searchParams.get('details'), event.eventDescription);
	assert.equal(url.searchParams.get('location'), event.locationName);
	assert.equal(url.searchParams.get('dates'), '20261128T080000Z/20261128T093000Z');
});

test('calendar drafts handle overnight events and refuse invalid time ranges', () => {
	assert.match(
		googleCalendarUrl({
			...event,
			eventDate: '2026-11-28T23:00:00Z',
			eventEndDate: '2026-11-29T01:00:00Z'
		})!,
		/20261128T230000Z%2F20261129T010000Z/
	);
	for (const end of [event.eventDate, '2026-11-27T10:00:00Z', '', 'invalid']) {
		assert.equal(googleCalendarUrl({ ...event, eventEndDate: end }), null);
	}
});

test('only Google calendar editor URLs can be opened', () => {
	assert.ok(safeCalendarUrl(googleCalendarUrl(event)));
	for (const unsafe of [
		null,
		'',
		'javascript:alert(1)',
		'https://calendar.google.com.evil.example/calendar/r/eventedit?action=TEMPLATE',
		'http://calendar.google.com/calendar/r/eventedit?action=TEMPLATE',
		'https://calendar.google.com/calendar/r/eventedit',
		'https://calendar.google.com/other?action=TEMPLATE',
		'https://user:password@calendar.google.com/calendar/r/eventedit?action=TEMPLATE'
	]) {
		assert.equal(safeCalendarUrl(unsafe), null);
	}
});

test('acceptance returns the backend calendar link only after success', async () => {
	const url = googleCalendarUrl(event)!;
	assert.equal(
		await acceptInvitation(async () => ({
			data: { acceptEvent: { success: true, message: 'Accepted', result: url } }
		})),
		url
	);
});

test('acceptance rejects missing responses, business errors, GraphQL errors and unsafe links', async () => {
	await assert.rejects(
		acceptInvitation(async () => ({ data: null })),
		/Couldn't accept/
	);
	await assert.rejects(
		acceptInvitation(async () => ({
			data: { acceptEvent: { success: false, message: 'Invitation not found.', result: null } }
		})),
		/Invitation not found/
	);
	await assert.rejects(
		acceptInvitation(async () => ({ data: null, errors: [{ message: 'Not authenticated' }] })),
		/Not authenticated/
	);
	await assert.rejects(
		acceptInvitation(async () => ({
			data: { acceptEvent: { success: true, message: 'Accepted', result: 'javascript:alert(1)' } }
		})),
		/calendar link is unavailable/
	);
	await assert.rejects(
		acceptInvitation(async () => {
			throw new Error('Network unavailable');
		}),
		/Network unavailable/
	);
});

test('event validation requires an end after the start', () => {
	const values: EventFormValues = {
		name: 'Calendar test',
		description: 'An event for a calendar test.',
		date: '2099-01-01T10:00',
		endDate: '2099-01-01T11:30',
		location: 'Test room',
		imageUrl: 'linkop:cover/sunset',
		privacy: 'PRIVATE',
		latitude: 0,
		longitude: 0
	};
	assert.deepEqual(validateEvent(values), {});
	assert.ok(validateEvent({ ...values, endDate: '' }).endDate);
	assert.ok(validateEvent({ ...values, endDate: values.date }).endDate);
	assert.ok(validateEvent({ ...values, endDate: '2099-01-01T09:00' }).endDate);
	assert.deepEqual(validateEvent({ ...values, endDate: '' }, { validateEnd: false }), {});
});
