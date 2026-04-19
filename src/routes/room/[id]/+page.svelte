<script lang="ts">
	import { client, type Guess, type Player } from '$lib/client';
	import { Avatar, Badge, Button, Card, Spinner } from 'flowbite-svelte';
	import type { PageProps } from './$types';
	import { goto } from '$app/navigation';
	import ActualRank from '$lib/components/ActualRank.svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import ScoreCard from '$lib/components/ScoreCard.svelte';
	import { getUserContext } from '$lib/context';
	import { CircleAlert } from '@lucide/svelte';
	import { Turnstile } from 'svelte-turnstile';
	import { toast } from '$lib/toasts';
	import { PUBLIC_TURNSTILE_SITE_KEY } from '$env/static/public';

	let { params, data }: PageProps = $props();

	const sessionId = $derived(params.id);

	const user = getUserContext();

	$effect(() => {
		if (!user) {
			goto('/login');
		}
	});

	let turnstileToken = $state<string | null>(null);
	let guessInput = $state<number>(1);
	let result = $state<{ guess: Guess; player: Player } | null>(null);
	let loadingNext = $state(false);
	let room = $derived(data.room);

	let submitting = $state(false);

	$effect(() => {
		if (turnstileToken) {
			console.log('Turnstile token:', turnstileToken);
		}
	});

	async function submitGuess() {
		if (!turnstileToken) {
			toast.error('Please complete the captcha before submitting your guess.');
			return;
		}

		submitting = true;
		try {
			const resp = await client.submitGuess(sessionId, {
				guess: guessInput,
				token: turnstileToken
			});
			result = { guess: resp.guess, player: resp.player };
			if ($user) $user = { ...$user, elo: resp.new_elo };
		} catch (e) {
			toast.error('Failed to submit guess: ' + (e instanceof Error ? e.message : 'Unknown error'));
		} finally {
			submitting = false;
		}
	}

	async function getNextScore() {
		loadingNext = true;
		try {
			const next = await client.getRoomNextScore(sessionId);

			room = { ...next, guess: null };
			result = null;
			guessInput = 0;

			if ($user) $user = { ...$user, ...next.refill };
		} catch (e) {
			toast.error('Failed to submit guess: ' + (e instanceof Error ? e.message : 'Unknown error'));
		} finally {
			loadingNext = false;
		}
	}
</script>

<svelte:head>
	<title>rankguessr - in room {params.id}</title>
</svelte:head>

<section class="flex min-w-full flex-1 flex-col items-center justify-center gap-6 py-8">
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
	{:else if loadingNext}
		<Spinner type="default" color="primary" />
	{:else}
		<div class="flex w-full flex-col items-center gap-5 md:w-3xl">
			<div class="flex w-full flex-col gap-1">
				<div class="flex items-center gap-2">
					<Badge color="purple">Room</Badge>
					{#if sessionId}<Badge color="gray">{sessionId}</Badge>{/if}
				</div>
				<h1 class="text-3xl font-bold">Guess player rank from replay</h1>
			</div>

			<div class="w-full">
				<ScoreCard score={room.score} shouldPlayPreview={false} />
			</div>

			{#if !result && !room.guess}
				<Card class="min-w-full p-4 py-6">
					<h2 class="mb-3 text-xl font-semibold">Download replay</h2>
					<p class="mb-4 text-gray-400">
						Download anonymized .osr replay, open it in osu!, then estimate the player's global
						rank.
					</p>

					<div class="grid grid-cols-3 grid-rows-1 gap-2">
						<Button
							href={`${PUBLIC_API_URL}/room/replay/${params.id}.osr`}
							download
							target="_blank"
							color="primary"
							class="col-span-2"
						>
							Download .osr replay
						</Button>
						<Button
							href={`https://osu.ppy.sh/beatmapsets/${room.score.beatmap.beatmapset_id}`}
							download
							target="_blank"
							color="gray"
							class="col-span-1"
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
						class="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-sm text-white placeholder-gray-400 focus:border-primary-500 focus:ring-primary-500"
					/>

					<Button
						class="mt-4 w-full"
						color="green"
						onclick={submitGuess}
						disabled={!guessInput || submitting || !!room.guess}
					>
						{submitting ? 'Submitting...' : 'Submit guess'}
					</Button>

					<Turnstile
						siteKey={PUBLIC_TURNSTILE_SITE_KEY}
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
								size="md"
								src={player?.avatar_url}
								alt="Player avatar"
								dot={{ placement: 'bottom-right', color: player?.is_online ? 'green' : 'gray' }}
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

				<div class="flex">
					<Button color="primary" onclick={getNextScore}>Play again</Button>
					<Button class="ml-2" color="gray" onclick={() => goto('/')}>Return home</Button>
				</div>
			{/if}
		</div>
	{/if}
</section>
