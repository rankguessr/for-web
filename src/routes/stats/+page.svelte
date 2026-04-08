<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Badge,
		Button,
		Card,
		Select,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';

	type GuessStat = {
		id: string;
		player: string;
		guessed_rank: number;
		actual_rank: number;
		diff: number;
		created_at: string;
	};

	type Totals = {
		today: number;
		global: number;
	};

	const ranges = [
		{ value: '1d', name: 'Last 24 hours' },
		{ value: '7d', name: 'Last 7 days' },
		{ value: '30d', name: 'Last 30 days' },
		{ value: 'all', name: 'All time' }
	];

	let dateRange = $state('7d');
	let loading = $state(false);
	let globalBest = $state<GuessStat[]>([]);
	let latest = $state<GuessStat[]>([]);
	let totals = $state<Totals>({ today: 0, global: 0 });

	onMount(async () => {
		await loadStats();
	});

	async function loadStats() {
		loading = true;
		try {
			const [bestRes, latestRes, totalsRes] = await Promise.all([
				fetch(`/api/stats/global-best?range=${dateRange}`, { credentials: 'include' }),
				fetch('/api/stats/latest?limit=10', { credentials: 'include' }),
				fetch('/api/stats/totals', { credentials: 'include' })
			]);

			if (bestRes.ok) {
				globalBest = (await bestRes.json()) as GuessStat[];
			}

			if (latestRes.ok) {
				latest = (await latestRes.json()) as GuessStat[];
			}

			if (totalsRes.ok) {
				totals = (await totalsRes.json()) as Totals;
			}
		} catch {
			globalBest = [];
			latest = [];
			totals = { today: 0, global: 0 };
		} finally {
			loading = false;
		}
	}
</script>

<section class="flex w-full flex-1 flex-col gap-6 p-6">
	<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
		<div>
			<h1 class="text-3xl font-bold">Statistics</h1>
			<p class="text-gray-500 dark:text-gray-400">
				Track best and latest guesses from rankguessr players.
			</p>
		</div>
		<Button href="/" color="alternative">Back to main page</Button>
	</div>

	<div class="grid gap-4 md:grid-cols-2">
		<Card>
			<p class="text-sm text-gray-500 dark:text-gray-400">Total guesses today</p>
			<div class="mt-2 text-4xl font-bold">{totals.today}</div>
		</Card>
		<Card>
			<p class="text-sm text-gray-500 dark:text-gray-400">Total guesses globally</p>
			<div class="mt-2 text-4xl font-bold">{totals.global}</div>
		</Card>
	</div>

	<div class="grid gap-6 lg:grid-cols-2">
		<Card>
			<div class="mb-4 flex items-center justify-between gap-3">
				<div class="flex items-center gap-2">
					<h2 class="text-xl font-semibold">Global best guesses</h2>
					<Badge color="green">Top accuracy</Badge>
				</div>
				<div class="w-48">
					<Select items={ranges} bind:value={dateRange} onchange={loadStats} />
				</div>
			</div>

			<Table hoverable>
				<TableHead>
					<TableHeadCell>Player</TableHeadCell>
					<TableHeadCell>Guess</TableHeadCell>
					<TableHeadCell>Actual</TableHeadCell>
					<TableHeadCell>Diff</TableHeadCell>
				</TableHead>
				<TableBody class="divide-y">
					{#if globalBest.length > 0}
						{#each globalBest as item}
							<TableBodyRow>
								<TableBodyCell class="font-medium">{item.player}</TableBodyCell>
								<TableBodyCell>#{item.guessed_rank}</TableBodyCell>
								<TableBodyCell>#{item.actual_rank}</TableBodyCell>
								<TableBodyCell>{item.diff}</TableBodyCell>
							</TableBodyRow>
						{/each}
					{:else}
						<TableBodyRow>
							<TableBodyCell colspan={4} class="text-center text-gray-500 dark:text-gray-400">
								No data yet for this date range.
							</TableBodyCell>
						</TableBodyRow>
					{/if}
				</TableBody>
			</Table>
		</Card>

		<Card>
			<div class="mb-4 flex items-center gap-2">
				<h2 class="text-xl font-semibold">Latest guesses</h2>
				<Badge color="blue">Live feed</Badge>
			</div>

			<Table hoverable>
				<TableHead>
					<TableHeadCell>Player</TableHeadCell>
					<TableHeadCell>Guess</TableHeadCell>
					<TableHeadCell>Actual</TableHeadCell>
					<TableHeadCell>Diff</TableHeadCell>
				</TableHead>
				<TableBody class="divide-y">
					{#if latest.length > 0}
						{#each latest as item}
							<TableBodyRow>
								<TableBodyCell class="font-medium">{item.player}</TableBodyCell>
								<TableBodyCell>#{item.guessed_rank}</TableBodyCell>
								<TableBodyCell>#{item.actual_rank}</TableBodyCell>
								<TableBodyCell>{item.diff}</TableBodyCell>
							</TableBodyRow>
						{/each}
					{:else}
						<TableBodyRow>
							<TableBodyCell colspan={4} class="text-center text-gray-500 dark:text-gray-400">
								No latest guesses available.
							</TableBodyCell>
						</TableBodyRow>
					{/if}
				</TableBody>
			</Table>
		</Card>
	</div>

	{#if loading}
		<p class="text-sm text-gray-500 dark:text-gray-400">Refreshing statistics...</p>
	{/if}
</section>
