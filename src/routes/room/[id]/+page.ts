import { client } from '$lib/client';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
	try {
		const room = await client.getRoom(params.id, fetch);

		console.log(room);

		return {
			room,
			error: null
		};
	} catch (err) {
		console.error('Error loading room:', err);
		return {
			room: null,
			error: 'Failed to load room. Please try again later.'
		};
	}
};
