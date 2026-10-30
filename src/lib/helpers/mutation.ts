import { resolveErrorMessage } from '$lib/utils/errorMessages';

interface CallResultLike {
	success: boolean;
	message: string | null;
}

interface MutationOutcome {
	ok: boolean;
	message: string;
}

/**
 * Runs a Houdini mutation and normalises the three ways the backend can fail:
 * a thrown network/GraphQL error, `result.errors`, or a `CallResult` with
 * `success: false`. `pick` selects the CallResult from the mutation payload.
 */
export async function runMutation<T>(
	run: () => Promise<{ data: T | null; errors?: { message: string }[] | null }>,
	pick: (data: T) => CallResultLike | string | null | undefined,
	fallback: string
): Promise<MutationOutcome> {
	try {
		const result = await run();
		if (result.errors?.length) {
			return { ok: false, message: resolveErrorMessage(result.errors[0], fallback) };
		}
		const payload = result.data ? pick(result.data) : null;
		if (payload && typeof payload === 'object' && !payload.success) {
			return { ok: false, message: resolveErrorMessage(payload.message, fallback) };
		}
		const message = typeof payload === 'string' ? payload : (payload?.message ?? '');
		return { ok: true, message };
	} catch (err) {
		const first = Array.isArray(err) ? err[0] : err;
		return {
			ok: false,
			message: resolveErrorMessage(first as { message?: string } | string, fallback)
		};
	}
}
