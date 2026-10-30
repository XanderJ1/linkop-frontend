/**
 * Base internal date formatter used by all date helpers.
 */
function format(
	date: Date | string | number,
	options: Intl.DateTimeFormatOptions,
	locale: 'en-US' | 'en-GB' = 'en-US',
	compactAmPm = false
): string {
	const d = new Date(date);

	if (isNaN(d.getTime())) {
		throw new Error('Invalid date');
	}

	let result = new Intl.DateTimeFormat(locale, options).format(d);

	if (compactAmPm) {
		result = result.replace(' AM', 'am').replace(' PM', 'pm');
	}

	return result;
}

/**
 * Formats a date and time as: Thu, July 6, 2024, 3:00pm
 */
export function formatDateTime(date: Date | string | number): string {
	return format(
		date,
		{
			weekday: 'short',
			month: 'long',
			day: 'numeric',
			year: 'numeric',
			hour: 'numeric',
			minute: '2-digit',
			hour12: true
		},
		'en-US',
		true
	);
}

/**
 * Formats a date and time numerically as: 25/07/2006, 3:30pm
 */
export function formatShortNumericDateTime(date: Date | string | number): string {
	const datePart = format(
		date,
		{
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		},
		'en-GB'
	);

	const timePart = format(
		date,
		{
			hour: 'numeric',
			minute: '2-digit',
			hour12: true
		},
		'en-US',
		true
	);

	return `${datePart}, ${timePart}`;
}

/**
 * Formats a date as: Thu, July 6, 2024
 */
export function formatDate(date: Date | string | number): string {
	return format(date, {
		weekday: 'short',
		month: 'long',
		day: 'numeric',
		year: 'numeric'
	});
}

/**
 * Formats a date as: 06/07/2024
 */
export function formatDateNumeric(date: Date | string | number): string {
	return format(
		date,
		{
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		},
		'en-GB'
	);
}

/**
 * Formats a date and time numerically as: 06/07/2024 3:30pm
 */
export function formatNumericDateTime(date: Date | string | number): string {
	const datePart = formatDateNumeric(date);

	const timePart = format(
		date,
		{
			hour: 'numeric',
			minute: '2-digit',
			hour12: true
		},
		'en-US',
		true
	);

	return `${datePart} ${timePart}`;
}

/**
 * Formats time as: 3:00pm
 */
export function formatTime(date: Date | string | number): string {
	return format(
		date,
		{
			hour: 'numeric',
			minute: '2-digit',
			hour12: true
		},
		'en-US',
		true
	);
}

/**
 * Converts an ISO datetime string into the exact `YYYY-MM-DDTHH:mm` shape
 * required by `<input type="datetime-local">`.
 *
 * Example output: 2024-07-06T15:30
 */
export function toDatetimeLocalValue(date: Date | string | number | null | undefined): string {
	if (!date) return '';

	const d = new Date(date);

	if (isNaN(d.getTime())) {
		return '';
	}

	const pad = (n: number) => String(n).padStart(2, '0');

	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
		d.getHours()
	)}:${pad(d.getMinutes())}`;
}

/**
 * Formats a duration in minutes as:
 *
 * Examples:
 * 45  -> 45 min
 * 60  -> 1h
 * 90  -> 1h 30 min
 */
export function formatTimeLimit(timeLimitMins: string | number): string {
	const minutes = Number(timeLimitMins);

	if (isNaN(minutes) || minutes <= 0) {
		return '0 min';
	}

	const hours = Math.floor(minutes / 60);
	const mins = minutes % 60;

	if (hours === 0) {
		return `${mins} min`;
	}

	if (mins === 0) {
		return `${hours}h`;
	}

	return `${hours}h ${mins} min`;
}

/**
 * Formats seconds into a readable duration:
 *
 * Example:
 * 185 -> 3m 5s
 */
export function formatDuration(secs: number): string {
	const m = Math.floor(secs / 60);
	const s = secs % 60;

	return `${m}m ${s}s`;
}
