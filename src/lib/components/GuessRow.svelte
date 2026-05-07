<script lang="ts">
	import type { Guess, User } from '$lib/client';
	import { formatNumber, getCoverURL, timeSince } from '$lib/utils';
	import type { UIColors } from './ui';
	import Avatar from './ui/Avatar.svelte';
	import Badge from './ui/Badge.svelte';

	let {
		guess,
		user,
		showTimeSince = false
	}: { guess: Guess; user?: User; showTimeSince?: boolean } = $props();

	function getBadgeColor(): UIColors {
		if (guess.kind !== 'v2') return 'neutral';
		return guess.elo > 0 ? 'success' : 'error';
	}
</script>

<a
	class="flex h-22 max-h-30 w-full cursor-pointer justify-between rounded-md p-2"
	style={`
        background: 
            linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.6)), 
            url(${getCoverURL(guess.beatmapset_id, guess.beatmap_id)}); 
        background-size: cover; 
        background-position: center;
    `}
	target="_blank"
	href={`https://osu.ppy.sh/scores/${guess.score_id}`}
>
	<div class="flex flex-col justify-center gap-1">
		{#if user}
			<div class="flex items-center gap-2">
				<Avatar src={user.avatar_url} alt="User avatar" />
				<p class="text-right text-sm font-semibold">{user.username}</p>
			</div>
		{/if}
		<div class="flex gap-3">
			{#if guess.guess !== 0}
			<div>
				<p class="text-xs text-gray-400">Guess</p>
				<p class="font-semibold">#{formatNumber(guess.guess)}</p>
			</div>
			{/if}
			<div>
				<p class="text-xs text-success">Actual</p>
				<p class="font-semibold">#{formatNumber(guess.actual_rank)}</p>
			</div>
		</div>
	</div>
	<div class="flex flex-col items-end justify-between p-2">
		<Badge color={getBadgeColor()} size="sm" soft={true}>
			{guess.elo}
		</Badge>

		{#if showTimeSince}
			<p class="text-xs text-gray-400">
				{timeSince(new Date(guess.created_at))}
			</p>
		{/if}
	</div>
</a>
