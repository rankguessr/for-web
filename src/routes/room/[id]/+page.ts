import { newApiClient } from '$lib/client';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
	const client = newApiClient(fetch);

	try {
		const room = await client.getRoom(params.id);

		return {
			room,
			error: null
		};
	} catch (err: unknown) {
		return {
			room: null,
			error: err instanceof Error ? err.message : 'An unknown error occurred'
		};
	}
};
