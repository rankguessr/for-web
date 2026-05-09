import { env } from '$env/dynamic/public';

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

export type Paged<T> = {
	items: T[];
	pages_total: number;
};

export type RoomKind = 'v2' | 'v2sub';

export type User = {
	elo: number;
	osu_id: number;
	username: string;
	refilled_at: Date;
	avatar_url: string;
	country_code: string;
	is_admin: boolean;
	available_guesses: number;
};

export type UserExtended = User & {
	rank: number;
	total_guesses: number;
};

export type RefillResult = {
	refilled_at: Date;
	available_guesses: number;
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
	kind: RoomKind;
	comment: string | null;
	closes_at: Date;
};

export type RoomNextResp = {
	score: Score;
	refill: RefillResult;
	closes_at: Date;
	comment: string | null;
};

export type PrepareReplayResp = {
	url: string;
};

export type Room = {
	id: string;
	score: Score;
	closes_at: Date;
};

export type Score = {
	pp: number;
	mods: string[];
	accuracy: number;
	beatmap: Beatmap;
	statistics: {
		great: number;
		ok?: number;
		meh?: number;
		miss?: number;
	};
	beatmapset: BeatmapSet;
	user: Player;
};

export type PublicStats = {
	count_24h: number;
	count_global: number;
	best: GuessExtended[];
	top_users: Paged<UserExtended>;
};

export type Guess = {
	id: string;
	elo: number;
	kind: string;
	guess: number;
	score_id: number;
	beatmap_id: number;
	beatmapset_id: number;
	actual_rank: number;
	created_at: Date;
};

export type Submission = {
	id: string;
	user_id: number;
	comment: string;
	is_accepted: boolean;
	player_id: number;
	score_id: number;
	beatmap_id: number;
	beatmapset_id: number;
	created_at: Date;
	updated_at: string;
};

export type SubmissionExtended = Submission & {
	user: User;
};

export type GuessExtended = Guess & {
	user: User;
};

export type GuessRequest = {
	guess: number;
	token: string;
};

type SubMeta = {
	comment: string;
	is_anonymous: boolean;
};

export type SubmitScoreReq = (SubMeta & { score_url: string }) | (SubMeta & { score_file: File });

export type Fetch = typeof fetch;

export class ApiClient {
	constructor(
		private readonly baseUrl: string,
		private readonly fetchFn: Fetch
	) {}

	private async _makeAndHandleUnexpected(path: string, options?: RequestInit): Promise<Response> {
		try {
			return await this.fetchFn(`${this.baseUrl}${path}`, options);
		} catch (err) {
			throw new ClientError(err instanceof Error ? err.message : String(err));
		}
	}

	private async _makeRequest<T>(path: string, options?: RequestInit): Promise<T> {
		const resp = await this._makeAndHandleUnexpected(path, options);
		if (!resp.ok) {
			const data = await resp.json();
			throw new ServerError(data.message, resp.status);
		}

		return resp.json();
	}

	private async _get<T>(path: string): Promise<T> {
		return this._makeRequest(path, { credentials: 'include' });
	}

	private async _post<T>(path: string, body: any): Promise<T> {
		return this._makeRequest(path, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body),
			credentials: 'include'
		});
	}

	private async _postForm<T>(path: string, formData: FormData): Promise<T> {
		return this._makeRequest(path, {
			method: 'POST',
			body: formData,
			credentials: 'include'
		});
	}

	private async _delete<T>(path: string): Promise<T> {
		return this._makeRequest(path, {
			method: 'DELETE',
			credentials: 'include'
		});
	}

	adminGetSubmissions({
		accepted = false,
		page = 1,
		limit = 10
	}: {
		accepted?: boolean;
		page?: number;
		limit?: number;
	}): Promise<SubmissionExtended[]> {
		const params = new URLSearchParams();
		params.set('accepted', accepted.toString());
		params.set('page', page.toString());
		params.set('limit', limit.toString());

		return this._get('/submissions?' + params.toString());
	}

	adminAcceptSubmission(submissionId: string): Promise<void> {
		return this._post(`/submissions/${submissionId}/accept`, {});
	}

	adminDeleteSubmission(submissionId: string): Promise<void> {
		return this._delete(`/submissions/${submissionId}`);
	}

	prepareReplay(roomId: string): Promise<PrepareReplayResp> {
		return this._post(`/room/${roomId}/prepare`, {});
	}

	async submitScore(data: SubmitScoreReq): Promise<Submission> {
		const formData = new FormData();
		formData.append('comment', data.comment);
		formData.append('is_anonymous', data.is_anonymous.toString());

		if ('score_url' in data) {
			console.log('setting score_url');
			formData.append('score_url', data.score_url);
		} else {
			console.log('setting score_file');
			formData.append('score_file', data.score_file);
		}

		return this._postForm('/submissions', formData);
	}

	getPublicStats(): Promise<PublicStats> {
		return this._get('/stats');
	}

	getPublicTopUsers({
		page = 1,
		limit = 10
	}: {
		page?: number;
		limit?: number;
	}): Promise<Paged<UserExtended>> {
		const params = new URLSearchParams();
		params.set('page', page.toString());
		params.set('limit', limit.toString());

		return this._get('/stats/top-users?' + params.toString());
	}

	getCurrentRoom(): Promise<{ room: Room | null }> {
		return this._get('/user/room');
	}

	getRoomNextScore(roomId: string): Promise<RoomNextResp> {
		return this._post(`/room/${roomId}/next`, {});
	}

	createRoom({ kind }: { kind: RoomKind }): Promise<{ room_id: string; refill: RefillResult }> {
		return this._post('/room/start', { kind });
	}

	getRoom(roomId: string): Promise<RoomInfo> {
		return this._get(`/room/${roomId}/score`);
	}

	submitGuess(
		roomId: string,
		data: GuessRequest
	): Promise<{ guess: Guess; player: Player; new_elo: number }> {
		return this._post(`/room/${roomId}`, data);
	}

	getMe(): Promise<{ user: User }> {
		return this._get('/user/me');
	}

	getGuesses(page: number = 1): Promise<Paged<Guess>> {
		const params = new URLSearchParams();
		params.set('page', page.toString());
		params.set('limit', '6');

		return this._get('/user/guesses?' + params.toString());
	}
}

export const newApiClient = (fetchFn: Fetch) => new ApiClient(env.PUBLIC_API_URL, fetchFn);
export const client = newApiClient(fetch);
