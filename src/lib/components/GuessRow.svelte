<script lang="ts">
	import type { Guess, User } from '$lib/client';
	import { formatNumber, getGuessCoverURL } from '$lib/utils';
	import { Avatar, Badge } from 'flowbite-svelte';

	let { guess, user }: { guess: Guess; user?: User } = $props();
</script>

<a
	class="flex h-22 max-h-30 w-full cursor-pointer justify-between rounded-md p-2"
	style={`
        background: 
            linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), 
            url(${getGuessCoverURL(guess)}); 
        background-size: cover; 
        background-position: center;
    `}
	target="_blank"
	href={`https://osu.ppy.sh/scores/${guess.score_id}`}
>
	<div class="flex flex-col justify-center gap-1">
		{#if user}
			<div class="flex items-center gap-2">
				<Avatar size="sm" src={user.avatar_url} alt="User avatar" />
				<p class="text-right text-sm font-semibold">{user.username}</p>
			</div>
		{/if}
		<div class="flex gap-2">
			<div>
				<p class="text-xs text-gray-400">Guess</p>
				<p class="font-semibold">#{formatNumber(guess.guess)}</p>
			</div>
			<div>
				<p class="text-xs text-green-300">Actual</p>
				<p class="font-semibold">#{formatNumber(guess.actual_rank)}</p>
			</div>
		</div>
	</div>
	<div class="flex flex-col justify-center">
		<Badge color={guess.elo > 0 ? 'green' : 'red'} size="small">
			{guess.elo}
		</Badge>
	</div>
</a>
