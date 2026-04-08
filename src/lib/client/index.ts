import { PUBLIC_API_URL } from '$env/static/public';

export class ClientError extends Error {
	readonly name = 'ClientError';

	constructor(message: string) {
		super(message);
	}
}

export class ServerError extends Error {
	readonly name = 'ServerError';

	constructor(message: string, status: number) {
		super(`API error ${status}: ${message}`);
	}
}

export type User = {
	osu_id: number;
	username: string;
	country_code: string;
	avatar_url: string;
};

export type BeatmapSet = {
	artist: string;
	title: string;
	preview_url: string;
	covers: {
		slimcover: string;
	};
};

export type Beatmap = {
	difficulty_rating: number;
};

export type RoomInfo = {
	score: Score;
	is_closed: boolean;
};

export type Score = {
	pp: number;
	mods: string[];
	accuracy: number;
	beatmap: Beatmap;
	beatmapset: BeatmapSet;
};

export type Guess = {
	id: string;
	elo: number;
	guess: number;
	actual_rank: number;
	created_at: string;
};

export const client = {
	async _makeRequest<T>(path: string, options?: RequestInit): Promise<T> {
		try {
			const resp = await fetch(`${PUBLIC_API_URL}${path}`, options);
			if (!resp.ok) {
				const data = await resp.json();
				throw new ServerError(data.message, resp.status);
			}

			return resp.json();
		} catch (err) {
			throw new ClientError('An unexpected error occurred while making the API request: ' + err);
		}
	},

	createRoom(): Promise<{ session_id: string }> {
		return this._makeRequest('/room/start', {
			method: 'POST',
			credentials: 'include'
		});
	},

	getRoom(roomId: string): Promise<RoomInfo> {
		return this._makeRequest(`/room/${roomId}/score`, {
			credentials: 'include'
		});
	},

	submitGuess(roomId: string, guess: number): Promise<Guess> {
		return this._makeRequest(`/room/${roomId}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ guess }),
			credentials: 'include'
		});
	},

	getMe(): Promise<User> {
		return this._makeRequest('/user/me', {
			credentials: 'include'
		});
	},

	getLatest(): Promise<Guess[]> {
		return this._makeRequest('/user/latest', {
			credentials: 'include'
		});
	},

	getPublicStats(): Promise<{
		best: Guess[];
		latest: Guess[];
		count_24h: number;
		count_global: number;
	}> {
		return this._makeRequest('/stats/public', {
			credentials: 'include'
		});
	}
};
