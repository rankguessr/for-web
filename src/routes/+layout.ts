import { newApiClient } from '$lib/client';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ fetch }) => {
	const client = newApiClient(fetch);

	try {
		const { user } = await client.getMe();
		return { user, error: null };
	} catch (e: unknown) {
		return { user: null, error: e instanceof Error ? e.message : 'An unknown error occurred' };
	}
};
