<script lang="ts">
	import { goto } from '$app/navigation';
	import { client, type User } from '$lib/client';
	import { Gamepad2, Trophy, Clock4, FrownIcon } from '@lucide/svelte';
	import { Button, Card, Badge } from 'flowbite-svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import ScoreCard from '$lib/components/ScoreCard.svelte';
	import type { PageProps } from './$types';
	import OsuIcon from '$lib/components/icons/OsuIcon.svelte';
	import GuessesColumn from '$lib/components/GuessesColumn.svelte';
	import { getUserContext } from '$lib/context';
	import { onDestroy } from 'svelte';
	import { toast } from '$lib/toasts';

	const REFILL_INTERVAL = 3 * 60 * 1000;

	const { data }: PageProps = $props();

	let room = $derived(data.room);
	const latest = $derived(data.latest?.slice(0, 10));

	const user = getUserContext();

	let availableGuesses = $state<number>(0);
	let refillIn = $state<number | null>(null);
	let intervalId = $state<ReturnType<typeof setInterval> | null>(null);

	if ($user) {
		updateInterval($user.refilled_at, $user.available_guesses);
		intervalId = setInterval(() => {
			updateInterval($user!.refilled_at, $user!.available_guesses);
		}, 1000);
	}

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

	function formatMillis(millis: number) {
		const totalSeconds = Math.floor(millis / 1000);
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = totalSeconds % 60;

		return `${minutes}:${seconds.toString().padStart(2, '0')}`;
	}

	async function createRoom() {
		try {
			const { room_id, refill } = await client.createRoom();
			if ($user) $user = { ...$user, ...refill };
			if (room_id && room_id !== '') await goto(`/room/${room_id}`);
		} catch (e) {
			toast.error('Failed to create room');
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

<section class="flex max-w-full flex-1 flex-col justify-center gap-4 py-4 md:flex-row">
	<div class={`grid grid-cols-1 gap-4 md:w-xl ${$user ? 'grid-rows-4' : 'grid-rows-5'}`}>
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
							disabled={!!room}
							onclick={createRoom}
						>
							<Gamepad2 class="mr-2 h-4 w-4" />
							Start new game ({availableGuesses} / 15)
						</Button>
						<Button color="alternative" href="/stats">
							<Trophy class="mr-2 h-4 w-4" />
							Statistics
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
					<Button color="alternative" href="/stats">
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
					<FrownIcon /> No active rooms
				</div>
				<p class="text-wrap text-gray-500 dark:text-gray-400">
					Your active sessions will be shown here, start a new game to create one
				</p>
			</Card>
		{/if}
	</div>

	{#if $user}
		<Card class="flex max-w-full flex-col gap-3 p-4 py-5 md:w-xl">
			<div class="mb-4 flex items-center justify-between">
				<div class="flex items-center gap-2">
					<Clock4 class="h-4 w-4" />
					<h2 class="text-xl font-semibold">Last guesses</h2>
				</div>
				<Badge color="gray">Recent 10</Badge>
			</div>

			<GuessesColumn guesses={latest ?? []} cap={6} />
		</Card>
	{/if}
</section>
