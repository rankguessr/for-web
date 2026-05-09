<script lang="ts">
	import { client } from '$lib/client';
	import GuessesColumn from '$lib/components/GuessesColumn.svelte';
	import Avatar from '$lib/components/ui/Avatar.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import { toast } from '$lib/toasts';
	import { formatNumber } from '$lib/utils';
	import { TrophyIcon } from '@lucide/svelte';

	const { data } = $props();

	let stats = $derived(data.stats);
	let currentUsersPage = $state(1);

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

	async function onUsersPageChange(page: number) {
		if (page === currentUsersPage) return;
		if (stats) {
			try {
				stats = {
					...stats,
					top_users: await client.getPublicTopUsers({ page })
				};
				currentUsersPage = page;
			} catch (e: unknown) {
				toast.error(
					`Failed to fetch top users: ${e instanceof Error ? e.message : 'Unknown error'}`
				);
			}
		} else {
			toast.error('Failed to fetch top users');
		}
	}
</script>

<svelte:head>
	<title>rankguessr - statistics</title>
</svelte:head>

{#if stats}
	<section class="flex max-w-full flex-1 justify-center py-4">
		<div class="flex w-2xl flex-col gap-4 sm:flex-row sm:justify-center md:w-5xl">
			<Card class="flex w-full flex-col items-center gap-3 p-3 py-5">
				<div class="flex w-full items-center gap-2">
					<TrophyIcon class="h-5 w-5" />
					<h2 class="text-2xl font-semibold">Best guessers</h2>
				</div>

				<div
					class="flex h-full w-full flex-col gap-3 py-4 md:items-center md:justify-between md:gap-0"
				>
					{#each stats.top_users.items as user (user.osu_id)}
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

							<p class="inline font-semibold">
								{formatNumber(user.elo)}
								<span class="hidden min-[420px]:inline sm:max-[700px]:hidden">elo</span>
							</p>
						</a>
					{/each}
				</div>
				{#if stats.top_users.pages_total > 1}
					<Pagination
						onPageChange={onUsersPageChange}
						totalPages={stats.top_users.pages_total}
						currentPage={currentUsersPage}
						visiblePages={6}
					/>
				{/if}
			</Card>

			<div class="flex w-full flex-col gap-4 sm:w-full md:w-full">
				<div class="flex gap-2">
					<Card class="w-full p-4">
						<p class="text-sm text-gray-500 dark:text-gray-400">Guesses today</p>
						<div class="mt-2 text-4xl font-bold">{formatNumber(stats.count_24h)}</div>
					</Card>
					<Card class="w-full p-4">
						<p class="text-sm text-gray-500 dark:text-gray-400">Guesses total</p>
						<div class="mt-2 text-4xl font-bold">{formatNumber(stats.count_global)}</div>
					</Card>
				</div>

				<Card class="flex flex-1 flex-col p-3">
					<div class="mb-4 items-center gap-2">
						<h2 class="text-xl font-semibold">Best guesses (24h)</h2>
					</div>

					<GuessesColumn guesses={stats.best} cap={5} showTimeSince={true} />
				</Card>
			</div>
		</div>
	</section>
{:else}
	<section class="flex w-full flex-1 items-center justify-center py-4">
		<Card class="p-4">Failed to fetch statistics, please try again later</Card>
	</section>
{/if}
