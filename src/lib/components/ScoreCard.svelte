<script lang="ts">
	import type { Score } from '$lib/client';
	import { Badge } from 'flowbite-svelte';
	import PlayButton from './PlayButton.svelte';

	let {
		score,
		title = 'Score Metadata',
		showPlayButton = true,
		shouldPlayPreview = false
	}: {
		score: Score;
		title?: string;
		showPlayButton?: boolean;
		shouldPlayPreview?: boolean;
	} = $props();
	let stats = $derived(score.statistics);
</script>

<div
	class="flex h-full w-full flex-col justify-between rounded-md p-4"
	style={`
		background: 
			linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), 
			url(${score.beatmapset?.covers.slimcover}); 
		background-size: cover; 
		background-position: center;
	`}
>
	<div class="flex justify-between">
		<div class="mb-2 flex items-center gap-1">
			{#if showPlayButton}
				<PlayButton url={score.beatmapset.preview_url} shouldPlay={shouldPlayPreview} />
			{/if}
			<h3 class="text-lg font-semibold">{title}</h3>
		</div>
		<p>
			<span class="font-bold text-green-500">{stats.count_100}</span> /
			<span class="font-bold text-yellow-500">{stats.count_50}</span> /
			<span class="font-bold text-red-500">{stats.count_miss}</span>
		</p>
	</div>
	<div class="flex flex-col gap-2">
		<p class="text-wrap text-gray-400">
			{score.beatmapset?.artist} - {score.beatmapset?.title}
		</p>
		<div class="mt-3 flex justify-between">
			<div class="flex gap-1">
				<Badge color="blue">{Math.round(score.pp)}pp</Badge>
				<Badge color="cyan">{(score.accuracy * 100).toFixed(2)}%</Badge>
				{#if score.beatmap?.difficulty_rating}
					<Badge color="purple">★ {score.beatmap.difficulty_rating.toFixed(2)}</Badge>
				{/if}
			</div>
			<div class="flex gap-0.5">
				{#if score.mods.length > 0}
					{#each score.mods as mod}
						<Badge color="yellow">{mod}</Badge>
					{/each}
				{:else}
					<Badge color="gray">NM</Badge>
				{/if}
			</div>
		</div>
	</div>
</div>
