import { client } from '$lib/client';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, fetch }) => {
	const { user } = await parent();
	if (user) {
		try {
			const resp = await client.getRoomAndLatest(fetch);
			return resp;
		} catch (e) {
			console.log(e);
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
