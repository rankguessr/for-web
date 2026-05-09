const numFormat = new Intl.NumberFormat();

export const getCoverURL = (beatmapset_id: number, beatmap_id: number): string => {
	return `https://assets.ppy.sh/beatmaps/${beatmapset_id}/covers/card@2x.jpg?${beatmap_id}`;
};

export const validateScoreURL = (url: string): boolean => {
	const pattern = /^https:\/\/osu\.ppy\.sh\/scores\/\d+$/;
	return pattern.test(url);
};

export const formatNumber = (num: number): string => {
	return numFormat.format(num);
};

export const pluralize = (count: number, noun: string, suffix = 's') =>
	`${noun}${count !== 1 ? suffix : ''}`;

export const formatMillis = (millis: number) => {
	const totalSeconds = Math.floor(millis / 1000);
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;

	return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const timeSince = (date: Date): string => {
	const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

	let interval = seconds / 31536000;

	const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto', style: 'long' });

	const format = (): { value: number; unit: Intl.RelativeTimeFormatUnit } | null => {
		if (interval > 1) {
			return { value: Math.floor(interval), unit: 'year' };
		}

		interval = seconds / 2592000;
		if (interval > 1) {
			return { value: Math.floor(interval), unit: 'month' };
		}

		interval = seconds / 86400;
		if (interval > 1) {
			return { value: Math.floor(interval), unit: 'day' };
		}

		interval = seconds / 3600;
		if (interval > 1) {
			return { value: Math.floor(interval), unit: 'hour' };
		}

		interval = seconds / 60;
		if (interval > 1) {
			return { value: Math.floor(interval), unit: 'minute' };
		}

		return null;
	};

	const result = format();
	if (result) {
		return rtf.format(-result.value, result.unit);
	}

	return 'just now';
};
