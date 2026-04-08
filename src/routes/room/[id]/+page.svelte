<script lang="ts">
	import { getContext } from 'svelte';
	import { client, type Guess, type User } from '$lib/client';
	import { Badge, Button, Card } from 'flowbite-svelte';
	import type { PageProps } from './$types';
	import { goto } from '$app/navigation';
	import ActualRank from '$lib/components/ActualRank.svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import PlayButton from '$lib/components/PlayButton.svelte';

	let { params }: PageProps = $props();

	let sessionId = $derived(params.id);

	const getUser = getContext<() => User | null>('user');
	const user = $derived(getUser());

	if (!user) {
		goto('/');
	}

	let guessInput = $state<number>(1);
	let errorMessage = $state<string | null>(null);
	let result = $state<Guess | null>(null);

	let submitting = $state(false);

	let room = client.getRoom(sessionId);

	async function submitGuess() {
		submitting = true;
		try {
			result = await client.submitGuess(sessionId, guessInput);
		} catch (e) {
			console.error('Error submitting guess:', e);
			errorMessage = 'Failed to submit guess.';
		} finally {
			submitting = false;
		}
	}
</script>

<section class="flex w-full flex-1 flex-col items-center gap-6 p-6">
	{#await room}
		<Card>
			<p class="text-gray-400">Loading session...</p>
		</Card>
	{:then room}
		{@const score = room.score}
		{@const stats = score.statistics}

		<div class="flex min-w-3xl flex-col items-center gap-5">
			<div class="flex w-full flex-col gap-1">
				<div class="flex items-center gap-2">
					<Badge color="purple">Session</Badge>
					{#if sessionId}<Badge color="gray">{sessionId}</Badge>{/if}
				</div>
				<h1 class="text-3xl font-bold">Guess player rank from replay</h1>
			</div>

			<div
				class="min-w-full rounded-md p-4"
				style={`
					background: 
						linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), 
						url(${score.beatmapset?.covers.slimcover}); 
					background-size: cover; 
					background-position: center;
				`}
			>
				<div class="flex justify-between">
					<div class="mb-2 flex items-center gap-1">
						<PlayButton url={score.beatmapset.preview_url} shouldPlay={false} />
						<h3 class="text-lg font-semibold">Score metadata</h3>
					</div>
					<p>
						<span class="font-bold text-green-500">{stats.count_100}</span> /
						<span class="font-bold text-yellow-500">{stats.count_50}</span> /
						<span class="font-bold text-red-500">{stats.count_miss}</span>
					</p>
				</div>
				<p class="text-gray-400">
					{score.beatmapset?.artist} - {score.beatmapset?.title}
				</p>
				<div class="mt-3 flex justify-between">
					<div class="flex gap-1">
						<Badge color="blue">pp: {Math.round(score.pp)}</Badge>
						<Badge color="cyan">acc: {(score.accuracy * 100).toFixed(2)}%</Badge>
						{#if score.beatmap?.difficulty_rating}
							<Badge color="purple">★ {score.beatmap.difficulty_rating.toFixed(2)}</Badge>
						{/if}
					</div>
					<div class="flex gap-0.5">
						{#if score.mods.length > 0}
							{#each score.mods as mod}
								<Badge color="yellow">{mod}</Badge>
							{/each}
						{:else}
							<Badge color="gray">NM</Badge>
						{/if}
					</div>
				</div>
			</div>

			{#if !result}
				<Card class="min-w-full p-4 py-6">
					<h2 class="mb-3 text-xl font-semibold">1) Download replay</h2>
					<p class="mb-4 text-gray-400">
						Download anonymized .osr replay, open it in osu!, then estimate the player's global
						rank.
					</p>

					<Button href={`${PUBLIC_API_URL}/room/replay/${params.id}.osr`} color="primary">
						Download .osr replay
					</Button>
				</Card>

				<Card class="min-w-full p-4 py-6">
					<h2 class="mb-3 text-xl font-semibold">2) Submit guess</h2>
					<label for="guess-rank-input" class="mb-2 block text-sm font-medium"
						>Global rank guess</label
					>
					<input
						id="guess-rank-input"
						type="number"
						min="1"
						bind:value={guessInput}
						placeholder="e.g. 1250"
						class="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-sm text-white placeholder-gray-400 focus:border-primary-500 focus:ring-primary-500"
					/>

					<Button
						class="mt-4 w-full"
						color="green"
						onclick={submitGuess}
						disabled={!guessInput || submitting || room.is_closed}
					>
						{submitting ? 'Submitting...' : 'Submit guess'}
					</Button>
				</Card>
			{:else}
				<Card class="min-w-full p-4 py-6">
					<h2 class="mb-3 text-xl font-semibold">Result</h2>
					<p class="text-xl">Your guess: #{result.guess}</p>
					<p class="text-xl">
						Actual global rank:
						<span class="font-bold">
							<ActualRank rank={result.actual_rank} elo={result.elo} />
						</span>
					</p>
				</Card>

				<div class="flex">
					<Button
						color="primary"
						onclick={() => {
							result = null;
							errorMessage = null;
						}}
					>
						Play again
					</Button>
					<Button class="ml-2" color="gray" onclick={() => goto('/')}>Return home</Button>
				</div>
			{/if}
		</div>
	{:catch}
		<Card>
			<p class="text-red-400">{errorMessage}</p>
		</Card>
	{/await}
</section>
