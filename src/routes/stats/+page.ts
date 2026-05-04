import { newApiClient } from '$lib/client';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const client = newApiClient(fetch);

	try {
		const stats = await client.getPublicStats();
		return { stats: stats };
	} catch (e) {
		console.log(e);
		return {
			stats: null
		};
	}
};
