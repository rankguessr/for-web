import { client, type User } from '$lib/client';
import type { LayoutLoad } from './$types';

export const ssr = false;

export const load: LayoutLoad = async ({ fetch }) => {
	try {
		const user = await client.getMe(fetch);
		return { user };
	} catch (e) {
		return { user: null };
	}
};
