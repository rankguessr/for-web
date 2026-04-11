<script lang="ts">
	import type { Guess } from '$lib/client';
	import { getGuessCoverURL } from '$lib/utils';
	import { Badge } from 'flowbite-svelte';

	let { guess }: { guess: Guess } = $props();
</script>

<a
	class="flex h-22 max-h-30 w-full cursor-pointer justify-between rounded-md p-3"
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
		<p>Guess: #{new Intl.NumberFormat().format(guess.guess)}</p>
		<p>Actual Rank: #{new Intl.NumberFormat().format(guess.actual_rank)}</p>
	</div>
	<div class="flex flex-col justify-center">
		<Badge color={guess.elo > 0 ? 'green' : 'red'} size="small">
			{guess.elo}
		</Badge>
	</div>
</a>
