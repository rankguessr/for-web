import { newApiClient } from '$lib/client';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, fetch, depends }) => {
	depends('app:index');

	const { user } = await parent();
	const client = newApiClient(fetch);

	if (user) {
		try {
			const [latest, { room }] = await Promise.all([client.getGuesses(1), client.getCurrentRoom()]);

			return { room, latest, error: null };
		} catch (e: unknown) {
			return {
				room: null,
				latest: null,
				error: e instanceof Error ? e.message : 'An unknown error occurred'
			};
		}
	}

	return {
		room: null,
		latest: null,
		error: null
	};
};
