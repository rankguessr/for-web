import { newApiClient } from '$lib/client';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ fetch }) => {
	const client = newApiClient(fetch);

	try {
		const { user } = await client.getMe();
		return { user };
	} catch (e) {
		return { user: null };
	}
};
