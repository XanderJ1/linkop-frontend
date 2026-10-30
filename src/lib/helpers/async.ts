export function wait(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Keeps a loading stage visible for at least `ms`, even when the real work finishes sooner. */
export async function withMinDuration<T>(promise: Promise<T>, ms: number): Promise<T> {
	const [result] = await Promise.all([promise, wait(ms)]);
	return result;
}
