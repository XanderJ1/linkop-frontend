/**
 * Error resolution utility — three-tier system:
 *
 * Tier 1 — Structured semantic code (CONFLICT, NOT_FOUND, etc.)
 *   The backend's GraphQLErrorFilter maps known exceptions to named codes
 *   and writes a user-friendly message alongside them. If we see one of
 *   these codes, the message is safe to show directly — no heuristics needed.
 *
 * Tier 2 — Regex heuristic
 *   Unhandled exceptions fall through the filter as-is, sometimes with a
 *   raw numeric code like "400". These messages may be raw SQL/stack traces.
 *   The regex check decides whether the message is safe to show.
 *
 * Tier 3 — Caller-supplied fallback
 *   Required (no default) — every call site must supply a specific,
 *   action-relevant message so the user always gets something actionable.
 *
 * Always console.error the raw error regardless of what we show — this
 * keeps the full technical detail available for debugging in DevTools.
 */

// Backend semantic codes from GraphQLErrorFilter.cs —
// when one of these is present, the message is already user-friendly.
const SEMANTIC_CODES = new Set([
	'CONFLICT',
	'NOT_FOUND',
	'FORBIDDEN',
	'UNAUTHORIZED',
	'VALIDATION_ERROR'
]);

// Patterns that indicate a raw/technical message not safe to show users.
const TECHNICAL_PATTERNS = [
	/constraint/i,
	/foreign key/i,
	/violates/i,
	/\bFK_/,
	/relation\s+"/i,
	/\bcolumn\b/i,
	/null value/i,
	/duplicate key/i,
	/syntax error/i,
	/^\d{4,5}\s*:/, // raw postgres error codes like "23503:"
	/detail:/i,
	/stack trace/i,
	/at\s+\w+\.\w+\s*\(/, // JS stack frame
	/Exception/,
	/\.cs:\d+/, // C#/.NET file:line references
	/Npgsql/i,
	/SqlException/i
];

const MAX_FRIENDLY_LENGTH = 160;

interface GraphQLErrorExtensions {
	code?: string;
	status?: number;
}

interface GraphQLError {
	message?: string;
	extensions?: GraphQLErrorExtensions;
}

function isUserFriendlyMessage(message: string | null | undefined): boolean {
	if (!message) return false;
	if (message.length > MAX_FRIENDLY_LENGTH) return false;
	return !TECHNICAL_PATTERNS.some((pattern) => pattern.test(message));
}

export function resolveErrorMessage(
	error: GraphQLError | string | null | undefined,
	fallback: string
): string {
	// Normalise — callers may pass the full error object or just the message string
	const rawMessage = typeof error === 'string' ? error : error?.message;
	const code = typeof error === 'object' && error !== null ? error?.extensions?.code : undefined;

	if (rawMessage) {
		console.error('[GraphQL error]', { code, message: rawMessage });
	}

	// Tier 1 — backend used a named semantic code, message is already user-friendly
	if (code && SEMANTIC_CODES.has(code)) {
		return rawMessage ?? fallback;
	}

	// Tier 2 — unhandled/raw error, run the heuristic
	if (isUserFriendlyMessage(rawMessage)) {
		return rawMessage as string;
	}

	// Tier 3 — fallback
	return fallback;
}
