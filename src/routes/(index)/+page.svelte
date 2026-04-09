<script lang="ts">
	import { getContext } from 'svelte';
	import { goto } from '$app/navigation';
	import { client, type User } from '$lib/client';
	import { Gamepad2, Trophy, Clock4, FrownIcon } from '@lucide/svelte';
	import {
		Button,
		Card,
		Badge,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Spinner
	} from 'flowbite-svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import ScoreCard from '$lib/components/ScoreCard.svelte';
	import type { PageData, PageProps } from './$types';

	const { data }: PageProps = $props();
	const latest = $derived(data.latest);
	const room = $derived(data.room);

	const getUser = getContext<() => User | null>('user');
	const user = $derived(getUser());

	async function createRoom() {
		try {
			const { room_id } = await client.createRoom();
			await goto(`/room/${room_id}`);
		} catch (e) {
			console.error('Error starting room:', e);
			alert('Failed to start room.');
		}
	}
</script>

<svelte:head>
	<title>rankguessr - Guess osu! global rank from replay</title>
</svelte:head>

<section class="flex w-full flex-1 justify-center gap-4 py-4">
	<div class={`grid w-xl grid-cols-1 gap-4 ${user ? 'grid-rows-4' : 'grid-rows-5'}`}>
		<Card
			class={`relative row-span-3  min-w-full items-center justify-center gap-5 p-5 ${user ? '' : 'row-end-5'}`}
		>
			<div class="w-full space-y-2">
				<div class="flex items-center gap-2">
					<Badge color="purple">rankguessr</Badge>
				</div>
				<h1 class="text-4xl font-bold">Guess osu! global rank from replay</h1>
				<p class="text-gray-500 dark:text-gray-400">
					Download anonymized replay, submit your estimate, and climb the elo leaderboard.
				</p>
			</div>

			<div class="flex w-full flex-wrap items-center gap-3">
				{#if user}
					<Button
						color="primary"
						class="cursor-pointer"
						size="lg"
						disabled={!!room}
						onclick={createRoom}
					>
						<Gamepad2 class="mr-2 h-4 w-4" />
						Start new game
					</Button>
					<Button color="alternative" href="/stats">
						<Trophy class="mr-2 h-4 w-4" />
						Statistics
					</Button>
				{:else}
					<Button color="primary" size="lg" href={`${PUBLIC_API_URL}/auth/login`}>
						<span
							class="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-pink-600 text-xs font-bold text-white"
						>
							osu!
						</span>
						Login with osu!
					</Button>
					<Button color="alternative" href="/stats">
						<Trophy class="mr-2 h-4 w-4" />
						Statistics
					</Button>
				{/if}
			</div>

			<div class="absolute bottom-3 left-5 text-gray-500">
				<p>
					made by
					<a class="font-semibold" target="_blank" href="https://github.com/havrydotdev"
						>@harvywtf</a
					>
					//
					<a target="_blank" href="https://github.com/rankguessr">development</a>
				</p>
			</div>
		</Card>

		{#if room}
			<a class="row-span-1 max-w-xl" href={`/room/${room.id}`}>
				<ScoreCard score={room.score} showPlayButton={false} title="Current Room" />
			</a>
		{:else if user}
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

	{#if user}
		<Card class="p-4">
			<div class="mb-4 flex items-center justify-between">
				<div class="flex items-center gap-2">
					<Clock4 class="h-4 w-4" />
					<h2 class="text-xl font-semibold">Last guesses</h2>
				</div>
				<Badge color="gray">Recent 10</Badge>
			</div>

			{#if latest && latest.length > 0}
				<Table hoverable>
					<TableHead>
						<TableHeadCell>Your guess</TableHeadCell>
						<TableHeadCell>Actual</TableHeadCell>
						<TableHeadCell>Elo</TableHeadCell>
					</TableHead>
					<TableBody class="divide-y">
						{#each latest.splice(0, 10) as guess}
							<TableBodyRow>
								<TableBodyCell>#{guess.guess}</TableBodyCell>
								<TableBodyCell>#{guess.actual_rank}</TableBodyCell>
								<TableBodyCell>
									<Badge color={guess.elo > 0 ? 'green' : 'red'}>
										{guess.elo}
									</Badge>
								</TableBodyCell>
							</TableBodyRow>
						{/each}
					</TableBody>
				</Table>
			{:else}
				<div
					class="rounded-lg border border-dashed border-gray-300 p-6 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400"
				>
					No guesses yet. Start a new game to fill this section.
				</div>
			{/if}
		</Card>
	{/if}
</section>
