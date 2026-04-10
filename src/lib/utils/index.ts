import type { Guess } from '$lib/client';

export const getGuessCoverURL = (guess: Guess): string => {
	return `https://assets.ppy.sh/beatmaps/${guess.beatmapset_id}/covers/slimcover.jpg?${guess.beatmap_id}`;
};
