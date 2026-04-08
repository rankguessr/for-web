<script lang="ts">
	import { getContext } from 'svelte';
	import { goto } from '$app/navigation';
	import { client, type User } from '$lib/client';
	import { Gamepad2, Trophy, Clock4 } from '@lucide/svelte';
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

	const getUser = getContext<() => User | null>('user');
	const user = $derived(getUser());

	let latest = client.getLatest();

	async function createRoom() {
		try {
			const { session_id } = await client.createRoom();
			await goto(`/room/${session_id}`);
		} catch (e) {
			console.error('Error starting session:', e);
			alert('Failed to start session.');
		}
	}
</script>

<section class="flex w-full flex-1 justify-center gap-6 py-8">
	<Card class="flex max-w-xl flex-1 items-center justify-center gap-5 p-5">
		<div class="w-full space-y-2">
			<div class="flex items-center gap-2">
				<Badge color="purple">rankguessr</Badge>
				<Badge color="green">osu! rank game</Badge>
			</div>
			<h1 class="text-4xl font-bold">Guess osu! global rank from replay</h1>
			<p class="text-gray-500 dark:text-gray-400">
				Download anonymized replay, submit your estimate, and climb the accuracy leaderboard.
			</p>
		</div>

		<div class="flex w-full flex-wrap items-center gap-3">
			{#if user}
				<Button color="primary" class="cursor-pointer" size="lg" onclick={createRoom}>
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
	</Card>

	{#if user}
		<Card class="p-4">
			<div class="mb-4 flex items-center justify-between">
				<div class="flex items-center gap-2">
					<Clock4 class="h-4 w-4" />
					<h2 class="text-xl font-semibold">Last guesses</h2>
				</div>
				<Badge color="gray">Recent 10</Badge>
			</div>

			{#await latest}
				<div class="flex items-center justify-center">
					<Spinner type="default" color="primary" />
				</div>
			{:then guesses}
				{#if guesses.length > 0}
					<Table hoverable>
						<TableHead>
							<TableHeadCell>Your guess</TableHeadCell>
							<TableHeadCell>Actual</TableHeadCell>
							<TableHeadCell>Elo</TableHeadCell>
						</TableHead>
						<TableBody class="divide-y">
							{#each guesses.splice(0, 10) as guess}
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
			{/await}
		</Card>
	{/if}
</section>
