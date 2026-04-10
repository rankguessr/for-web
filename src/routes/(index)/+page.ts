import { client } from '$lib/client';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, fetch }) => {
	const { user } = await parent();
	if (user) {
		try {
			const [latest, currentRoom] = await Promise.all([
				client.getLatest(fetch),
				client.getCurrentRoom(fetch)
			]);

			return {
				room: currentRoom?.room,
				latest
			};
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
