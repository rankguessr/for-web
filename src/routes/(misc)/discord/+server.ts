import { env } from '$env/dynamic/public';
import { redirect, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = () => {
	return redirect(302, env.PUBLIC_DISCORD_URL);
};
