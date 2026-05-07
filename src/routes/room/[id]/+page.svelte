<script lang="ts">
	import { client, type Guess, type Player } from '$lib/client';
	import type { PageProps } from './$types';
	import { goto, invalidate } from '$app/navigation';
	import ActualRank from '$lib/components/ActualRank.svelte';
	import { env } from '$env/dynamic/public';
	import ScoreCard from '$lib/components/ScoreCard.svelte';
	import { getUserContext } from '$lib/context';
	import { CircleAlert } from '@lucide/svelte';
	import { Turnstile } from 'svelte-turnstile';
	import { toast } from '$lib/toasts';
	import RoomCountdown from '$lib/components/RoomCountdown.svelte';
	import { browser } from '$app/environment';
	import Card from '$lib/components/ui/Card.svelte';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Avatar from '$lib/components/ui/Avatar.svelte';

	let { params, data }: PageProps = $props();

	const sessionId = $derived(params.id);

	const user = getUserContext();

	let turnstileToken = $state<string | null>(null);
	let guessInput = $state<number>(1);
	let result = $state<{ guess: Guess; player: Player } | null>(null);
	let room = $derived(data.room);

	let nextLoading = $state(false);
	let submitLoading = $state(false);
	let josuLoading = $state(false);

	const josuSupportedMods = ['hd', 'hr', 'dt', 'ez', 'nc', 'nf', 'cl'];
	const josuAvailable = $derived(
		env.PUBLIC_JOSU_URL !== undefined && !!room && isJosuSupportedMods(room.score.mods)
	);

	$effect(() => {
		if (!user) {
			goto('/login');
		}
	});

	function isJosuSupportedMods(mods: string[]) {
		return mods.every((mod) => josuSupportedMods.includes(mod.toLowerCase()));
	}

	async function submitGuess() {
		if (!turnstileToken) {
			toast.error('Please complete the captcha before submitting your guess.');
			return;
		}

		submitLoading = true;
		try {
			const resp = await client.submitGuess(sessionId, {
				guess: guessInput,
				token: turnstileToken
			});
			result = { guess: resp.guess, player: resp.player };
			if ($user) $user = { ...$user, elo: resp.new_elo };
			invalidate('app:index');
		} catch (e) {
			toast.error('Failed to submit guess: ' + (e instanceof Error ? e.message : 'Unknown error'));
		} finally {
			submitLoading = false;
		}
	}

	async function getNextScore() {
		nextLoading = true;
		try {
			const next = await client.getRoomNextScore(sessionId);

			room = { ...next, kind: room!.kind, guess: null };
			result = null;
			guessInput = 0;

			if ($user) $user = { ...$user, ...next.refill };
		} catch (e) {
			toast.error('Failed to submit guess: ' + (e instanceof Error ? e.message : 'Unknown error'));
		} finally {
			nextLoading = false;
		}
	}

	async function openInJosu() {
		josuLoading = true;
		try {
			const resp = await client.prepareReplay(params.id);
			if (env.PUBLIC_JOSU_URL) {
				const url = new URL(env.PUBLIC_JOSU_URL);
				url.searchParams.set('r', resp.url);
				window.open(url, '_blank')?.focus();
			}
		} catch (e) {
			toast.error('Failed to open in JoSu: ' + (e instanceof Error ? e.message : 'Unknown error'));
		} finally {
			josuLoading = false;
		}
	}
</script>

<svelte:head>
	<title>rankguessr - in room {params.id}</title>
</svelte:head>

<section class="flex min-w-full flex-1 flex-col items-center justify-center gap-6 py-4">
	{#if !room}
		<Card class="flex w-full flex-col justify-between gap-4 p-4 md:min-h-36 md:min-w-xl md:p-6">
			<h1 class="flex items-center gap-2 text-lg font-semibold">
				<CircleAlert size={23} />Room not found
			</h1>
			<p class="text-md">
				The room you are looking for does not exist. If error persists, please contact me on
				discord: <span class="font-semibold">@harvywtf</span>
			</p>
		</Card>
	{:else if nextLoading}
		<Spinner size="lg" />
	{:else}
		<div class="flex w-full flex-col items-center gap-3 md:w-3xl">
			<div class="flex w-full justify-between">
				<div class="flex items-center gap-1">
					<Badge color="warning" soft>{room.kind === 'v2' ? 'Ranked' : 'Unranked'}</Badge>
				</div>

				<RoomCountdown
					color="primary"
					closesAt={room.closes_at}
					onClose={async () => {
						if (browser) {
							await goto('/');
						}
					}}
				/>
			</div>

			<div class="w-full">
				<ScoreCard score={room.score} shouldPlayPreview={false} />
			</div>

			{#if room.kind === 'v2sub' && !!room.comment}
				<Card class="min-w-full p-4 py-6">
					<p>
						<span class="font-semibold">Player's comment: </span>
						{room.comment}
					</p>
				</Card>
			{/if}

			{#if !result && !room.guess}
				<Card class="min-w-full p-4 py-6">
					<h2 class="mb-3 text-xl font-semibold">Download replay</h2>
					<p class="mb-4 text-gray-400">
						Download anonymized replay then estimate player's global rank
					</p>

					<div class="grid grid-cols-3 grid-rows-1 gap-2">
						{#if josuAvailable}
							<Button
								target="_blank"
								color="accent"
								disabled={josuLoading}
								class="col-span-2 row-end-1"
								onclick={openInJosu}
							>
								{josuLoading ? 'Downloading replay...' : 'Watch using JoSu'}
							</Button>
						{/if}
						<Button
							href={`${env.PUBLIC_API_URL}/room/replay/${params.id}.osr`}
							download
							disabled={josuLoading}
							target="_blank"
							color={josuAvailable ? 'secondary' : 'accent'}
							class="col-span-1 row-end-1"
						>
							Download replay
						</Button>
						<Button
							href={`https://osu.ppy.sh/beatmapsets/${room.score.beatmap.beatmapset_id}`}
							target="_blank"
							color="secondary"
							disabled={josuLoading}
							class="col-span-1 row-end-1"
						>
							Download beatmap
						</Button>
					</div>
				</Card>

				<Card class="min-w-full p-4 py-6">
					<h2 class="mb-3 text-xl font-semibold">Submit guess</h2>
					<label for="guess-rank-input" class="mb-2 block text-sm font-medium text-gray-400"
						>Global rank guess (less than 3mil)</label
					>
					<input
						id="guess-rank-input"
						type="number"
						min="1"
						max="3000000"
						bind:value={guessInput}
						placeholder="e.g. 1250"
						class="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-sm text-white placeholder-gray-400"
					/>

					<Button
						class="mt-4 w-full"
						color="secondary"
						onclick={submitGuess}
						disabled={!guessInput || submitLoading || !!room.guess}
					>
						{submitLoading ? 'Submitting...' : 'Submit guess'}
					</Button>

					<Turnstile
						siteKey={env.PUBLIC_TURNSTILE_SITE_KEY}
						theme="dark"
						class="mt-4 w-full"
						size="flexible"
						on:callback={(event) => (turnstileToken = event.detail.token)}
						on:error={(event) => {
							toast.error('Turnstile error: ' + event.detail.code);
							turnstileToken = null;
						}}
						on:expired={() => {
							toast.error('Turnstile expired. Please complete the captcha again.');
							turnstileToken = null;
						}}
					/>
				</Card>
			{:else}
				{@const res = result ? result : { guess: room.guess, player: room.score.user }}
				{@const guess = res?.guess}
				{@const player = res?.player}

				<Card class="min-w-full p-4 py-6">
					<h2 class="mb-3 text-xl font-semibold">Result</h2>
					<p class="text-xl">Your guess: #{guess?.guess}</p>
					<p class="text-xl">
						Actual global rank:
						<span class="font-bold">
							<ActualRank rank={guess!.actual_rank} elo={guess!.elo} />
						</span>
					</p>
				</Card>

				<a
					href={`https://osu.ppy.sh/users/${player?.id}`}
					target="_blank"
					rel="noopener noreferrer"
					class="w-full"
				>
					<Card class="min-w-full p-4">
						<div class="flex items-center gap-4">
							<Avatar
								src={player?.avatar_url}
								alt="Player avatar"
								// dot={{ placement: 'bottom-right', color: player?.is_online ? 'green' : 'gray' }}
							/>

							<div class="flex items-center justify-center gap-2 rounded-md">
								<p class="text-lg font-semibold">{player?.username}</p>
								<img
									class="h-6 w-6"
									alt="Country flag"
									src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${player?.country_code}.svg`}
								/>
							</div>
						</div>
					</Card>
				</a>

				<div class="flex min-w-full flex-col gap-2">
					<Button color="accent" onclick={getNextScore}>Play again</Button>
					<Button color="secondary" href="/">Return home</Button>
				</div>
			{/if}
		</div>
	{/if}
</section>
