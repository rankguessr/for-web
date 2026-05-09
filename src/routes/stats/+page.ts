import { newApiClient } from '$lib/client';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const client = newApiClient(fetch);

	try {
		const stats = await client.getPublicStats();
		return { stats: stats, error: null };
	} catch (err: unknown) {
		return {
			stats: null,
			error: err instanceof Error ? err.message : 'An unknown error occurred'
		};
	}
};
