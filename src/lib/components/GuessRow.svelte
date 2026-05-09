<script lang="ts">
	import type { Guess, User } from '$lib/client';
	import { formatNumber, getCoverURL, timeSince } from '$lib/utils';
	import { onMount } from 'svelte';
	import type { UIColors } from './ui';
	import Avatar from './ui/Avatar.svelte';
	import Badge from './ui/Badge.svelte';

	let {
		guess,
		user,
		showTimeSince = false
	}: { guess: Guess; user?: User; showTimeSince?: boolean } = $props();

	let isLoading = $state(true);
	let imgSrc = $derived(getCoverURL(guess.beatmapset_id, guess.beatmap_id));

	function getBadgeColor(): UIColors {
		if (guess.kind !== 'v2') return 'neutral';
		return guess.elo > 0 ? 'success' : 'error';
	}
</script>

<a
	class="relative flex h-22 max-h-30 w-full cursor-pointer justify-between rounded-md p-2"
	target="_blank"
	href={`https://osu.ppy.sh/scores/${guess.score_id}`}
>
	<div
		class={[
			'absolute inset-0 h-full w-full skeleton rounded-md object-cover brightness-45',
			isLoading ? '' : 'hidden'
		]}
	></div>
	<img
		src={imgSrc}
		fetchpriority="high"
		onload={() => (isLoading = false)}
		class={[
			'absolute inset-0 h-full w-full rounded-md object-cover brightness-45 transition-opacity',
			isLoading ? 'opacity-0' : 'opacity-100'
		]}
		alt="Beatmap cover"
	/>

	<div class="z-10 flex flex-col justify-center gap-1">
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
	<div class="z-10 flex flex-col items-end justify-between p-2">
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
