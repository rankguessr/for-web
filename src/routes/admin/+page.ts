import { newApiClient } from '$lib/client';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ depends, fetch, url }) => {
	const client = newApiClient(fetch);
	const accepted = url.searchParams.get('accepted') === 'true';
	const page = parseInt(url.searchParams.get('page') || '1');

	depends('app:admin');

	try {
		const submissions = await client.adminGetSubmissions({
			accepted,
			limit: 10,
			page: page
		});

		return { submissions, page, accepted, error: null };
	} catch (err: unknown) {
		return {
			page: 1,
			submissions: null,
			accepted: false,
			error: err instanceof Error ? err.message : 'An unknown error occurred'
		};
	}
};
