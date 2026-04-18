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
		console.error(`API error ${status}: ${message}`);
		super(message);
	}
}

export type User = {
	elo: number;
	osu_id: number;
	username: string;
	country_code: string;
	avatar_url: string;
};

export type Player = {
	id: number;
	username: string;
	country_code: string;
	avatar_url: string;
	is_online: boolean;
	statistics: {
		pp: number;
		global_rank: number;
	};
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
	beatmapset_id: number;
	difficulty_rating: number;
};

export type RoomInfo = {
	score: Score;
	guess: Guess | null;
};

export type Room = {
	id: string;
	score: Score;
};

export type Score = {
	pp: number;
	mods: string[];
	accuracy: number;
	beatmap: Beatmap;
	statistics: {
		count_300: number;
		count_100: number;
		count_50: number;
		count_miss: number;
		count_geki: number;
		count_katu: number;
	};
	beatmapset: BeatmapSet;
	user: Player;
};

export type PublicStats = {
	count_24h: number;
	count_global: number;
	best: GuessExtended[];
	top_users: User[];
};

export type Guess = {
	id: string;
	elo: number;
	guess: number;
	score_id: number;
	beatmap_id: number;
	beatmapset_id: number;
	actual_rank: number;
	created_at: string;
};

export type GuessExtended = Guess & {
	user: User;
};

export type GuessRequest = {
	guess: number;
	token: string;
};

export type Fetch = typeof fetch;

export const client = {
	async _makeAndHandleUnexpected(
		path: string,
		options?: RequestInit,
		customFetch?: Fetch
	): Promise<Response> {
		try {
			return await (customFetch || fetch)(`${PUBLIC_API_URL}${path}`, options);
		} catch (err) {
			throw new ClientError(err instanceof Error ? err.message : String(err));
		}
	},

	async _makeRequest<T>(path: string, options?: RequestInit, customFetch?: Fetch): Promise<T> {
		const resp = await this._makeAndHandleUnexpected(path, options, customFetch);
		if (!resp.ok) {
			const data = await resp.json();
			throw new ServerError(data.message, resp.status);
		}

		return resp.json();
	},

	getPublicStats(customFetch?: Fetch): Promise<PublicStats> {
		return this._makeRequest(
			'/stats',
			{
				credentials: 'include'
			},
			customFetch
		);
	},

	getRoomNextScore(roomId: string, customFetch?: Fetch): Promise<RoomInfo> {
		return this._makeRequest(
			`/room/${roomId}/next`,
			{
				method: 'POST',
				credentials: 'include'
			},
			customFetch
		);
	},

	createRoom(customFetch?: Fetch): Promise<{ room_id: string }> {
		return this._makeRequest(
			'/room/start',
			{
				method: 'POST',
				credentials: 'include'
			},
			customFetch
		);
	},

	getRoom(roomId: string, customFetch?: Fetch): Promise<RoomInfo> {
		return this._makeRequest(
			`/room/${roomId}/score`,
			{
				credentials: 'include'
			},
			customFetch
		);
	},

	submitGuess(
		roomId: string,
		req: GuessRequest,
		customFetch?: Fetch
	): Promise<{ guess: Guess; player: Player; new_elo: number }> {
		return this._makeRequest(
			`/room/${roomId}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(req),
				credentials: 'include'
			},
			customFetch
		);
	},

	getMe(customFetch?: Fetch): Promise<User> {
		return this._makeRequest(
			'/user/me',
			{
				credentials: 'include'
			},
			customFetch
		);
	},

	getRoomAndLatest(customFetch?: Fetch): Promise<{ room: Room | null; latest: Guess[] }> {
		return this._makeRequest(
			'/user/rooms',
			{
				credentials: 'include'
			},
			customFetch
		);
	}
};
