<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Badge,
		Card,
		Spinner,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { client } from '$lib/client';
	import { Car } from '@lucide/svelte';

	const stats = client.getPublicStats();
</script>

{#await stats}
	<section class="flex w-full flex-1 items-center justify-center">
		<Spinner type="default" color="primary" />
	</section>
{:then stats}
	{@const { best, latest } = stats}
	<section class="flex w-full justify-center gap-4 py-8">
		<Card class="p-3">
			<div class="mb-4 flex items-center gap-2">
				<h2 class="text-xl font-semibold">Best guesses (24h)</h2>
			</div>

			<Table hoverable>
				<TableHead>
					<TableHeadCell>Guess</TableHeadCell>
					<TableHeadCell>Actual</TableHeadCell>
					<TableHeadCell>Elo</TableHeadCell>
				</TableHead>
				<TableBody class="divide-y">
					{#if best.length > 0}
						{#each best as item}
							<TableBodyRow>
								<TableBodyCell class="font-medium">{item.guess}</TableBodyCell>
								<TableBodyCell>#{item.actual_rank}</TableBodyCell>
								<TableBodyCell>{item.elo}</TableBodyCell>
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

		<div class="flex flex-col gap-3">
			<div class="flex gap-2">
				<Card class="p-3">
					<p class="text-sm text-gray-500 dark:text-gray-400">Total guesses today</p>
					<div class="mt-2 text-4xl font-bold">{stats.count_24h}</div>
				</Card>
				<Card class="p-3">
					<p class="text-sm text-gray-500 dark:text-gray-400">Total guesses globally</p>
					<div class="mt-2 text-4xl font-bold">{stats.count_global}</div>
				</Card>
			</div>

			<Card class="p-3">
				<div class="mb-4 flex items-center gap-2">
					<h2 class="text-xl font-semibold">Latest guesses</h2>
					<Badge color="blue">Live feed</Badge>
				</div>

				<Table hoverable>
					<TableHead>
						<TableHeadCell>Guess</TableHeadCell>
						<TableHeadCell>Actual</TableHeadCell>
						<TableHeadCell>Diff</TableHeadCell>
					</TableHead>
					<TableBody class="divide-y">
						{#if latest.length > 0}
							{#each latest.splice(0, 8) as item}
								<TableBodyRow>
									<TableBodyCell>#{item.guess}</TableBodyCell>
									<TableBodyCell>#{item.actual_rank}</TableBodyCell>
									<TableBodyCell>{item.elo}</TableBodyCell>
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
	</section>
{/await}
