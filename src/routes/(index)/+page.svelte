<script lang="ts">
	import { goto } from '$app/navigation';
	import { client, type RoomKind } from '$lib/client';
	import { Gamepad2, Trophy, Clock4, FrownIcon } from '@lucide/svelte';
	import {
		Button,
		Card,
		Badge,
		PaginationNav,
		Spinner,
		Modal,
		Label,
		Input
	} from 'flowbite-svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import ScoreCard from '$lib/components/ScoreCard.svelte';
	import type { PageProps } from './$types';
	import OsuIcon from '$lib/components/icons/OsuIcon.svelte';
	import GuessesColumn from '$lib/components/GuessesColumn.svelte';
	import { getUserContext } from '$lib/context';
	import { onDestroy, onMount } from 'svelte';
	import { toast } from '$lib/toasts';
	import { formatMillis } from '$lib/utils';

	const REFILL_INTERVAL = 3 * 60 * 1000;

	const { data }: PageProps = $props();

	let latest = $derived(data.latest);

	const user = getUserContext();

	let submitModal = $state(false);

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

	function onSubmitAction({ action, data }: { action: string; data: FormData }): boolean {
		if (action === 'submit') {
			const score_url = data.get('score_url') as string;
			const comment = data.get('comment') as string;

			if (!score_url) {
				toast.error('Score URL is required');
				return false;
			}

			client
				.submitScore({ score_url, comment })
				.then(() => {
					toast.success('Score submitted successfully');
				})
				.catch((e) => {
					toast.error(`Failed to submit a score: ${e.message || 'unknown error'}`);
				});
		}

		return true;
	}

	async function createRoom(kind: RoomKind) {
		try {
			const { room_id, refill } = await client.createRoom({ kind });
			if ($user) $user = { ...$user, ...refill };
			if (room_id && room_id !== '') await goto(`/room/${room_id}`);
		} catch (e) {
			toast.error('Failed to create room');
		}
	}

	async function onPageChange(page: number) {
		if (page === guessesPage) return;
		try {
			guessesLoading = true;
			latest = await client.getGuesses(page);
			guessesPage = page;
		} catch (e) {
			toast.error('Failed to load guesses');
		} finally {
			guessesLoading = false;
		}
	}

	onDestroy(() => {
		if (intervalId) clearInterval(intervalId);
	});
</script>

<svelte:head>
	<title>rankguessr - Guess osu! global rank from replay</title>
</svelte:head>

{#snippet loginBtn()}
	<Button class="gap-2" color="primary" size="lg" href={`${PUBLIC_API_URL}/auth/login`}>
		<div class="h-6 w-6">
			<OsuIcon />
		</div>
		Login with osu
	</Button>
{/snippet}

<Modal form bind:open={submitModal} size="xs" onaction={onSubmitAction}>
	<div class="flex flex-col space-y-6">
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Submit a score</h3>
		<!-- {#if submitError}
			<Label color="red">{submitError}</Label>
		{/if} -->
		<Label class="space-y-3">
			<span>Score URL</span>
			<Input type="url" name="score_url" placeholder="https://osu.ppy.sh/scores/..." required />
		</Label>
		<Label class="space-y-3">
			<span>Comment</span>
			<Input type="text" name="comment" placeholder="Add a comment..." />
		</Label>

		<Button type="submit" value="submit">Submit</Button>
	</div>
</Modal>

<section class="flex max-w-full flex-1 flex-col justify-center gap-4 py-4 md:flex-row">
	<div
		class={`grid grid-cols-1 gap-4 ${$user ? 'grid-rows-4' : 'grid-rows-5'} ${latest && latest.items.length > 0 ? 'md:w-xl' : 'md:w-3xl'}`}
	>
		<Card
			class={`relative row-span-3 max-w-full items-center justify-center gap-5 px-5 py-10 ${$user ? '' : 'row-end-5'}`}
		>
			<div class="w-full space-y-2">
				<div class="flex items-center gap-2">
					<Badge color="purple">rankguessr</Badge>
				</div>
				<h1 class="text-4xl font-bold">Guess osu! global rank from replay</h1>
				<p class="text-gray-500 dark:text-gray-400">
					Download random player's one of top 20 replays, watch it and try to get an exact guess!
				</p>
			</div>

			{#if $user}
				<div class="flex w-full flex-col gap-2">
					<div class="flex w-full flex-wrap items-center gap-3">
						<Button
							color="primary"
							class="cursor-pointer"
							size="lg"
							disabled={!!room || availableGuesses === 0}
							onclick={() => createRoom('v2')}
						>
							<Gamepad2 class="mr-2 h-4 w-4" />
							Start new game ({availableGuesses} / 15)
						</Button>
						<Button
							color="alternative"
							class="cursor-pointer"
							size="lg"
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
			{:else}
				<div class="flex w-full flex-wrap items-center gap-3">
					{@render loginBtn()}
					<Button color="alternative">
						<Trophy class="mr-2 h-4 w-4" />
						Statistics
					</Button>
				</div>
			{/if}

			<div class="absolute bottom-3 left-5 text-gray-500">
				<p>
					made by
					<a class="font-semibold" target="_blank" href="https://osu.ppy.sh/users/20848169"
						>@harvywtf</a
					>
					//
					<a target="_blank" href="https://github.com/rankguessr">development</a>
				</p>
			</div>
		</Card>

		{#if room}
			<a class="row-span-1 max-w-full" href={`/room/${room.id}`}>
				<ScoreCard
					title="Current Room"
					score={room.score}
					showPlayButton={false}
					closesAt={room.closes_at}
					onClose={() => (room = null)}
				/>
			</a>
		{:else if $user}
			<Card class="row-span-1 min-w-full gap-4 p-4">
				<div class="flex items-center justify-start gap-1.5 text-xl font-semibold">
					Submit your score
				</div>
				<p class="text-wrap text-gray-500 dark:text-gray-400">
					You can submit your most (or least) proud score for others to guess!
				</p>
				<Button color="alternative" onclick={() => (submitModal = true)}>Submit a score</Button>
			</Card>
		{/if}
	</div>

	{#if $user && latest && latest.items.length > 0}
		<Card class="flex max-w-full flex-col items-center gap-2 p-4 py-5 md:w-xl">
			<div class="flex w-full items-center justify-between">
				<div class="flex items-center gap-2">
					<Clock4 class="h-4 w-4" />
					<h2 class="text-xl font-semibold">Last guesses</h2>
				</div>
			</div>

			{#if guessesLoading}
				<Spinner class="m-auto h-full" />
			{:else}
				<GuessesColumn guesses={latest?.items ?? []} cap={6} showTimeSince={true} />
			{/if}
			{#if latest && latest.pages_total > 1}
				<PaginationNav
					{onPageChange}
					currentPage={guessesPage}
					totalPages={latest?.pages_total ?? 5}
					previousLabel="Prev"
					size="large"
				/>
			{/if}
		</Card>
	{/if}
</section>
