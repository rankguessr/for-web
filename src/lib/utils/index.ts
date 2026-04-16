import type { Guess } from '$lib/client';

const numFormat = new Intl.NumberFormat();

export const getGuessCoverURL = (guess: Guess): string => {
	return `https://assets.ppy.sh/beatmaps/${guess.beatmapset_id}/covers/slimcover.jpg?${guess.beatmap_id}`;
};

export const formatNumber = (num: number): string => {
	return numFormat.format(num);
};
