import { newApiClient } from '$lib/client';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, fetch, depends }) => {
	depends('app:index');
	const { user } = await parent();
	const client = newApiClient(fetch);

	if (user) {
		try {
			const [latest, { room }] = await Promise.all([client.getGuesses(1), client.getCurrentRoom()]);

			return { room, latest };
		} catch (e) {
			return {
				room: null,
				latest: null
			};
		}
	}

	return {
		room: null,
		latest: null
	};
};
