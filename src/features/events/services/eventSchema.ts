import { z } from 'zod';
import type { EventFormValues } from './types';

export const eventSchema = z.object({
	name: z.string().trim().min(3, 'Give it a name with at least 3 characters').max(120),
	description: z.string().trim().min(10, 'Tell people a little more (10+ characters)').max(2000),
	date: z
		.string()
		.min(1, 'Pick a date and time')
		.refine((v) => !isNaN(new Date(v).getTime()), 'That date looks off'),
	endDate: z
		.string()
		.min(1, 'Pick an end date and time')
		.refine((v) => !isNaN(new Date(v).getTime()), 'That end date looks off'),
	location: z.string().trim().min(2, 'Where is it happening?').max(200),
	imageUrl: z.string().min(1, 'Pick a cover'),
	privacy: z.enum(['PUBLIC', 'PRIVATE']),
	category: z.enum(['ENTERTAINMENT', 'MEETING', 'HAPPY_HOUR', 'OTHER'], {
		error: 'Choose an event category'
	}),
	latitude: z
		.number()
		.min(-90, 'Latitude is between -90 and 90')
		.max(90, 'Latitude is between -90 and 90')
		.nullable(),
	longitude: z
		.number()
		.min(-180, 'Longitude is between -180 and 180')
		.max(180, 'Longitude is between -180 and 180')
		.nullable()
});

export type EventFormErrors = Partial<Record<keyof z.infer<typeof eventSchema>, string>>;

export function validateEvent(
	values: EventFormValues,
	{ requireFuture = true, requirePin = true, validateEnd = true } = {}
): EventFormErrors {
	// Older events have no usable end time, and the update API cannot set one.
	const result = (validateEnd ? eventSchema : eventSchema.omit({ endDate: true })).safeParse(
		values
	);
	const errors: EventFormErrors = {};
	if (!result.success) {
		for (const issue of result.error.issues) {
			const key = issue.path[0] as keyof EventFormErrors;
			errors[key] ??= issue.message;
		}
	} else if (requireFuture && new Date(result.data.date).getTime() < Date.now()) {
		errors.date = 'Pick a time in the future';
	}
	if (validateEnd && result.success && new Date(values.endDate) <= new Date(values.date)) {
		errors.endDate = 'The event must end after it starts';
	}
	// The backend needs coordinates to create an event (they power "near me")
	if (requirePin && !errors.latitude && !errors.longitude) {
		if (values.latitude === null || values.longitude === null) {
			errors.latitude = 'Drop a pin so guests can find it';
		}
	}
	return errors;
}
