import { z } from 'zod';

export const eventSchema = z.object({
	name: z.string().trim().min(3, 'Give it a name with at least 3 characters').max(120),
	description: z.string().trim().min(10, 'Tell people a little more (10+ characters)').max(2000),
	date: z
		.string()
		.min(1, 'Pick a date and time')
		.refine((v) => !isNaN(new Date(v).getTime()), 'That date looks off'),
	location: z.string().trim().min(2, 'Where is it happening?').max(200),
	imageUrl: z.string().min(1, 'Pick a cover'),
	privacy: z.enum(['PUBLIC', 'PRIVATE']),
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
	values: { latitude: number | null; longitude: number | null },
	{ requireFuture = true, requirePin = true } = {}
): EventFormErrors {
	const result = eventSchema.safeParse(values);
	const errors: EventFormErrors = {};
	if (!result.success) {
		for (const issue of result.error.issues) {
			const key = issue.path[0] as keyof EventFormErrors;
			errors[key] ??= issue.message;
		}
	} else if (requireFuture && new Date(result.data.date).getTime() < Date.now()) {
		errors.date = 'Pick a time in the future';
	}
	// The backend needs coordinates to create an event (they power "near me")
	if (requirePin && !errors.latitude && !errors.longitude) {
		if (values.latitude === null || values.longitude === null) {
			errors.latitude = 'Drop a pin so guests can find it';
		}
	}
	return errors;
}
