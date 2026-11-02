import { FetchEventStore } from '$houdini';
import type { EventSummary } from '$features/events/services/types';

/**
 * Loads one event by id. The backend has no single-event query, so this
 * checks the "hosting" and "invited" lists — which also tells us the
 * viewer's relationship to the event.
 */
export function createEventDetail() {
	const store = new FetchEventStore();

	let event = $state<EventSummary | null>(null);
	let isHost = $state(false);
	let loading = $state(true);
	let error = $state<string | null>(null);

	async function load(id: string) {
		loading = true;
		error = null;
		try {
			const result = await store.fetch({ variables: { id }, policy: 'NetworkOnly' });
			const hosted = result.data?.hosting?.nodes?.[0] as EventSummary | undefined;
			const invited = result.data?.invited?.nodes?.[0] as EventSummary | undefined;
			event = hosted ?? invited ?? null;
			isHost = !!hosted;
		} catch (err) {
			console.error('[EventDetail] load failed', err);
			error = "We couldn't load this event.";
		} finally {
			loading = false;
		}
	}

	return {
		get event() {
			return event;
		},
		get isHost() {
			return isHost;
		},
		get loading() {
			return loading;
		},
		get error() {
			return error;
		},
		load
	};
}
