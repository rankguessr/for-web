<script lang="ts">
	import { Avatar, Card, Spinner } from 'flowbite-svelte';
	import { client } from '$lib/client';
	import GuessesColumn from '$lib/components/GuessesColumn.svelte';

	const stats = client.getPublicStats();
</script>

<svelte:head>
	<title>rankguessr - statistics</title>
</svelte:head>

{#await stats}
	<section class="flex w-full flex-1 items-center justify-center">
		<Spinner type="default" color="primary" />
	</section>
{:then stats}
	{@const { best, top_users } = stats}

	<section class="flex w-full flex-1 justify-center py-4">
		<div class="grid w-3xl grid-cols-2 gap-4">
			<Card class="col-span-1 p-3">
				<div class="mb-6 flex items-center gap-2">
					<h2 class="text-xl font-semibold">Best guessers</h2>
				</div>

				<div class="flex flex-col gap-2">
					{#each top_users as user (user.osu_id)}
						<a
							href={`https://osu.ppy.sh/users/${user.osu_id}`}
							class="flex items-center justify-between"
							target="_blank"
							rel="noopener noreferrer"
						>
							<div class="flex items-center gap-3">
								<Avatar size="md" src={user?.avatar_url} alt="User avatar" />

								<div class="flex items-center justify-center gap-2 rounded-md">
									<p class="text-lg font-semibold">{user.username}</p>
									<img
										class="h-6 w-6"
										alt="Country flag"
										src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${user.country_code}.svg`}
									/>
								</div>
							</div>

							<p class="font-semibold">{user.elo} elo</p>
						</a>
					{/each}
				</div>
			</Card>

			<div class="col-span-1 flex w-full flex-col gap-4">
				<div class="flex w-full gap-2">
					<Card class="p-2">
						<p class="text-sm text-gray-500 dark:text-gray-400">Guesses today</p>
						<div class="mt-2 text-4xl font-bold">{stats.count_24h}</div>
					</Card>
					<Card class="p-2">
						<p class="text-sm text-gray-500 dark:text-gray-400">Guesses total</p>
						<div class="mt-2 text-4xl font-bold">{stats.count_global}</div>
					</Card>
				</div>

				<Card class="h-full p-3">
					<div class="mb-4 flex items-center gap-2">
						<h2 class="text-xl font-semibold">Best guesses (24h)</h2>
					</div>

					<GuessesColumn guesses={best} cap={8} />
				</Card>
			</div>
		</div>
	</section>
{/await}
