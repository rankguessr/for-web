import { client, type User } from '$lib/client';
import type { LayoutLoad } from './$types';

export const ssr = false;

export const load: LayoutLoad = async (): Promise<{ user: User | null }> => {
	try {
		const user = await client.getMe();
		return { user };
	} catch (e) {
		return { user: null };
	}
};
