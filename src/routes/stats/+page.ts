import { client } from '$lib/client';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	try {
		const stats = await client.getPublicStats(fetch);
		return { stats: stats };
	} catch (e) {
		console.log(e);
		return {
			stats: null
		};
	}
};
