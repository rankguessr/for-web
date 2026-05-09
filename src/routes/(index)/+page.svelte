<script lang="ts">
	import { goto } from '$app/navigation';
	import { client, type RoomKind } from '$lib/client';
	import { Gamepad2, Trophy, Clock4 } from '@lucide/svelte';
	import { env } from '$env/dynamic/public';
	import ScoreCard from '$lib/components/ScoreCard.svelte';
	import type { PageProps } from './$types';
	import OsuIcon from '$lib/components/icons/OsuIcon.svelte';
	import GuessesColumn from '$lib/components/GuessesColumn.svelte';
	import { getUserContext } from '$lib/context';
	import { onDestroy } from 'svelte';
	import { toast } from '$lib/toasts';
	import { formatMillis, validateScoreURL } from '$lib/utils';
	import Button from '$lib/components/ui/Button.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';
	import { resolve } from '$app/paths';

	const REFILL_INTERVAL = 3 * 60 * 1000;
	const MAX_REPLAY_SIZE = 10 * 1024 * 1024; // 10mb

	const { data }: PageProps = $props();

	let latest = $derived(data.latest);

	const user = getUserContext();

	let submitModal = $state(false);

	let roomLoading = $state(false);
	let guessesPage = $state(1);
	let guessesLoading = $state(false);
	let room = $derived(data.room);

	let availableGuesses = $state<number>(0);
	let refillIn = $state<number | null>(null);
	let intervalId = $state<ReturnType<typeof setInterval> | null>(null);

	if ($user) {
		updateInterval($user.refilled_at, $user.available_guesses);
		intervalId = setInterval(() => {
			updateInterval($user!.refilled_at, $user!.available_guesses);
		}, 1000);
	}

	// this smells but works, should be refactored at some point
	function updateInterval(refilled_at: Date, available_guesses: number) {
		const now = Date.now();
		const diff = now - new Date(refilled_at).getTime();

		availableGuesses = Math.min(
			15,
			available_guesses +
				Math.floor((new Date().getTime() - new Date(refilled_at).getTime()) / REFILL_INTERVAL)
		);

		refillIn = REFILL_INTERVAL - (diff % REFILL_INTERVAL);
	}

	onDestroy(() => {
		if (intervalId) clearInterval(intervalId);
	});

	let scoreURL = $state<string>();
	let scoreFile = $state<FileList>();
	let hasReplay = $state(false);

	function validateReplay() {
		if (!scoreURL && !scoreFile) {
			throw new Error('Please provide a score URL or a replay file');
		}

		if (scoreURL && scoreFile) {
			throw new Error('Please provide only one of score URL or replay file');
		}

		if (scoreURL) {
			const valid = validateScoreURL(scoreURL);
			if (!valid) {
				throw new Error('Invalid score URL');
			}
		} else if (scoreFile) {
			if (scoreFile[0].size > MAX_REPLAY_SIZE) {
				throw new Error('Replay file is too large');
			}
		}
	}

	function onUploadReplayAction() {
		try {
			validateReplay();
			submitModal = false;
			hasReplay = true;
		} catch (err: unknown) {
			toast.error('Failed to upload replay', err);
		}
	}

	async function onSubmitAction(e: SubmitEvent) {
		e.preventDefault();
		const data = new FormData(e.target as HTMLFormElement);
		const comment = (data.get('comment') ?? '') as string;
		const is_anonymous = data.get('is_anonymous') === 'on';

		try {
			await client.submitScore(
				scoreFile && scoreFile.length > 0
					? { score_file: scoreFile[0], comment, is_anonymous }
					: { score_url: scoreURL!, comment, is_anonymous }
			);

			toast.success('Score submitted successfully');
		} catch (err: unknown) {
			toast.error('Failed to submit a score', err);
		} finally {
			hasReplay = false;
			scoreURL = undefined;
			scoreFile = undefined;
		}
	}

	async function createRoom(kind: RoomKind) {
		roomLoading = true;
		try {
			const { room_id, refill } = await client.createRoom({ kind });
			if ($user) $user = { ...$user, ...refill };
			if (room_id && room_id !== '') await goto(resolve(`/room/[id]`, { id: room_id }));
		} catch (err: unknown) {
			toast.error('Failed to create room', err);
		} finally {
			roomLoading = false;
		}
	}

	async function onPageChange(page: number) {
		if (page === guessesPage) return;
		try {
			guessesLoading = true;
			latest = await client.getGuesses(page);
			guessesPage = page;
		} catch (err: unknown) {
			toast.error('Failed to load guesses', err);
		} finally {
			guessesLoading = false;
		}
	}
</script>

<svelte:head>
	<title>rankguessr - Guess osu! global rank from replay</title>
</svelte:head>

<Modal id="upload-replay-modal" bind:showModal={submitModal}>
	<h3 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Replay info</h3>
	<div class="flex w-full flex-col gap-4">
		<div class="mb-2 flex w-full flex-col">
			<Input
				class="w-full"
				type="url"
				label="Score URL"
				name="score_url"
				placeholder="https://osu.ppy.sh/scores/..."
				disabled={!!scoreFile}
				bind:value={scoreURL}
				required
			/>
			<div class="divider">or</div>
			<input
				type="file"
				name="score_file"
				class="file-input w-full file-input-secondary"
				bind:files={scoreFile}
				disabled={!!scoreURL}
			/>
		</div>

		<Button type="submit" color="accent" onclick={onUploadReplayAction}>Upload</Button>
	</div>
</Modal>

<Modal id="submit-replay-modal" bind:showModal={hasReplay}>
	<h3 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Submit a score</h3>
	<form class="flex w-full flex-col gap-4" onsubmit={onSubmitAction}>
		<div class="mb-2 flex w-full flex-col gap-2">
			<Input
				class="w-full"
				type="text"
				label="Comment"
				name="comment"
				placeholder="Add a comment..."
			/>
			<Checkbox label="Submit anonymously" name="is_anonymous" color="warning" checked={false} />
		</div>

		<Button type="submit" color="accent">Submit</Button>
	</form>
</Modal>

{#if !$user}
	<section
		class="flex max-w-full flex-1 flex-col items-center justify-center gap-4 py-4 md:flex-row"
	>
		<Card class="flex max-w-150 flex-col items-center justify-center gap-6 px-8 py-22">
			<div class="w-full space-y-4">
				<h1 class="text-4xl font-semibold">Guess osu! global rank from replay</h1>
				<p class="text-gray-500 dark:text-gray-400">
					Download random player's one of top 20 replays, watch it and try to get an exact guess!
				</p>
			</div>

			<div class="flex w-full flex-wrap items-center gap-3">
				<Button class="gap-2" color="accent" size="lg" href={`${env.PUBLIC_API_URL}/auth/login`}>
					<div class="h-6 w-6">
						<OsuIcon />
					</div>
					Login with osu
				</Button>
				<Button color="secondary" href="/stats">
					<Trophy class="mr-2 h-4 w-4" />
					Statistics
				</Button>
			</div>
		</Card>
	</section>
{:else}
	<section class="flex max-w-full flex-1 flex-col justify-center gap-4 py-4 md:flex-row">
		<div
			class={[
				'grid grid-cols-1 grid-rows-4 gap-4',
				latest && latest.items.length > 0 ? 'md:w-xl' : 'md:w-3xl'
			]}
		>
			<Card
				class="row-span-3 flex max-w-full flex-col items-center justify-center gap-5 px-5 py-10"
			>
				<div class="w-full space-y-2">
					<h1 class="text-4xl font-bold">Guess osu! global rank from replay</h1>
					<p class="text-gray-500 dark:text-gray-400">
						Download random player's one of top 20 replays, watch it and try to get an exact guess!
					</p>
				</div>

				<div class="flex w-full flex-col gap-2">
					<div class="flex w-full flex-wrap items-center gap-3">
						<Button
							size="md"
							color="accent"
							disabled={!!room || availableGuesses === 0 || roomLoading}
							onclick={() => createRoom('v2')}
						>
							<Gamepad2 class="mr-2 h-4 w-4" />
							{roomLoading ? 'Starting...' : `Start new game (${availableGuesses} / 15)`}
						</Button>

						<Button
							size="md"
							color="secondary"
							disabled={!!room || roomLoading}
							onclick={() => createRoom('v2sub')}
						>
							Unranked game
						</Button>
					</div>

					{#if availableGuesses !== null && refillIn !== null && availableGuesses !== 15}
						<p class="text-sm text-gray-500">
							next guess in <span class="font-semibold">{formatMillis(refillIn)}</span>
						</p>
					{/if}
				</div>
			</Card>

			{#if room}
				<a class="row-span-1 max-w-full" href={resolve(`/room/${room.id}`)}>
					<ScoreCard
						title="Current Room"
						score={room.score}
						showPlayButton={false}
						closesAt={room.closes_at}
						onClose={() => (room = null)}
					/>
				</a>
			{:else}
				<Card class="row-span-1 flex min-w-full flex-col justify-between gap-2 p-4">
					<div class="flex items-center justify-start gap-1.5 text-xl font-semibold">
						Submit your score
					</div>
					<p class="text-wrap text-gray-500 dark:text-gray-400">
						You can submit your most (or least) proud score for others to guess!
					</p>
					<Button color="secondary" onclick={() => (submitModal = true)}>Submit a score</Button>
				</Card>
			{/if}
		</div>

		{#if latest && latest.items.length > 0}
			<Card class="flex flex-col items-center justify-between gap-3 p-4 md:w-xl">
				<div class="flex w-full items-center justify-start gap-2">
					<Clock4 class="h-5 w-5" />
					<h2 class="text-xl font-semibold">Last guesses</h2>
				</div>

				{#if guessesLoading}
					<div class="flex w-full flex-1 flex-col gap-2">
						{#each Array.from({ length: 6 }, (_, idx) => idx) as idx (idx)}
							<div class="h-22 w-full skeleton"></div>
						{/each}
					</div>
				{:else}
					<GuessesColumn
						class="md:min-h-142"
						guesses={latest?.items ?? []}
						cap={6}
						showTimeSince={true}
					/>
				{/if}

				{#if latest.pages_total > 1}
					<Pagination
						{onPageChange}
						currentPage={guessesPage}
						totalPages={latest?.pages_total ?? 5}
						visiblePages={6}
						size="md"
					/>
				{/if}
			</Card>
		{/if}
	</section>
{/if}
