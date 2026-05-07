<script lang="ts">
	import GuessesColumn from '$lib/components/GuessesColumn.svelte';
	import GuessRow from '$lib/components/GuessRow.svelte';
	import Avatar from '$lib/components/ui/Avatar.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import { formatNumber } from '$lib/utils';
	import { TrophyIcon } from '@lucide/svelte';

	const { data } = $props();
	const stats = $derived(data.stats);

	function getRankColor(rank: number) {
		switch (rank) {
			case 1:
				return 'bg-gradient-to-tr from-blue-200 to-indigo-500 bg-clip-text text-transparent';
			case 2:
				return 'bg-gradient-to-tr from-slate-200 to-slate-600 bg-clip-text text-transparent';
			case 3:
				return 'bg-gradient-to-tr from-amber-500 to-amber-800 bg-clip-text text-transparent';
			default:
				return '';
		}
	}
</script>

<svelte:head>
	<title>rankguessr - statistics</title>
</svelte:head>

{#if stats}
	{@const { best, top_users } = stats}

	<section class="flex max-w-full flex-1 justify-center py-4">
		<div class="flex w-2xl flex-col gap-4 sm:flex-row sm:justify-center md:w-5xl">
			<Card class="flex w-full flex-col gap-3 p-3 py-4">
				<div class="flex w-full items-center gap-2">
					<TrophyIcon class="h-5 w-5" />
					<h2 class="text-2xl font-semibold">Best guessers</h2>
				</div>

				<div
					class="flex h-full w-full flex-col gap-3 py-4 md:items-center md:justify-between md:gap-0"
				>
					{#each top_users as user (user.osu_id)}
						<a
							href={`https://osu.ppy.sh/users/${user.osu_id}`}
							class="flex w-full items-center justify-between"
							target="_blank"
							rel="noopener noreferrer"
						>
							<div class="flex items-center gap-2">
								<p class={`min-w-7 text-lg font-semibold ${getRankColor(user.rank)}`}>
									#{formatNumber(user.rank)}
								</p>
								<Avatar src={user?.avatar_url} alt="User avatar" />

								<div class="flex items-center justify-center gap-2 rounded-md">
									<p class="text-lg">{user.username}</p>
									<img
										class="h-6 w-6"
										alt="Country flag"
										src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${user.country_code}.svg`}
									/>
								</div>
							</div>

							<p class="font-semibold">{formatNumber(user.elo)} elo</p>
						</a>
					{/each}
				</div>
			</Card>

			<div class="flex w-full flex-col gap-4 sm:w-full md:w-full">
				<div class="flex gap-2">
					<Card class="w-full p-2">
						<p class="text-sm text-gray-500 dark:text-gray-400">Guesses today</p>
						<div class="mt-2 text-4xl font-bold">{formatNumber(stats.count_24h)}</div>
					</Card>
					<Card class="w-full p-2">
						<p class="text-sm text-gray-500 dark:text-gray-400">Guesses total</p>
						<div class="mt-2 text-4xl font-bold">{formatNumber(stats.count_global)}</div>
					</Card>
				</div>

				<Card class="h-full p-3">
					<div class="mb-4 items-center gap-2">
						<h2 class="text-xl font-semibold">Best guesses (24h)</h2>
					</div>

					<GuessesColumn guesses={best} cap={5} showTimeSince={true} />
				</Card>
			</div>
		</div>
	</section>
{:else}
	<section class="flex w-full flex-1 items-center justify-center py-4">
		<Card class="p-4">Failed to fetch statistics, please try again later</Card>
	</section>
{/if}
