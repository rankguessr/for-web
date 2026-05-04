<script lang="ts">
	import { Avatar, Card } from 'flowbite-svelte';
	import GuessRow from '$lib/components/GuessRow.svelte';
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

	<section class="flex max-w-full flex-1 items-center justify-center">
		<div class="flex w-2xl flex-col gap-4 sm:flex-row sm:justify-center md:w-4xl">
			<Card class="flex w-full p-3" size="xl">
				<div class="mb-4 flex w-full items-center gap-2">
					<TrophyIcon class="h-5 w-5" />
					<h2 class="text-2xl font-semibold">Best guessers</h2>
				</div>

				<div class="flex w-full flex-col gap-4">
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
								<Avatar size="md" src={user?.avatar_url} alt="User avatar" />

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
					<Card class="p-2">
						<p class="text-sm text-gray-500 dark:text-gray-400">Guesses today</p>
						<div class="mt-2 text-4xl font-bold">{formatNumber(stats.count_24h)}</div>
					</Card>
					<Card class="p-2">
						<p class="text-sm text-gray-500 dark:text-gray-400">Guesses total</p>
						<div class="mt-2 text-4xl font-bold">{formatNumber(stats.count_global)}</div>
					</Card>
				</div>

				<Card class="h-full p-3" size="xl">
					<div class="mb-4 items-center gap-2">
						<h2 class="text-xl font-semibold">Best guesses (24h)</h2>
					</div>

					<div class="flex w-full flex-1 flex-col gap-2">
						{#if best.length > 0}
							{#each best.slice(0, 5) as item}
								<GuessRow guess={item} user={item.user} showTimeSince={true} />
							{/each}
						{:else}
							<div class="font-semibold">No guesses available.</div>
						{/if}
					</div>
				</Card>
			</div>
		</div>
	</section>
{:else}
	<section class="flex w-full flex-1 items-center justify-center py-4">
		<Card class="p-4">Failed to fetch statistics, please try again later</Card>
	</section>
{/if}
