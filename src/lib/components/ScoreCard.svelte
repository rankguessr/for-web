<script lang="ts">
	import type { Score } from '$lib/client';
	import PlayButton from './PlayButton.svelte';
	import RoomCountdown from './RoomCountdown.svelte';
	import Badge from './ui/Badge.svelte';

	let {
		score,
		title = 'Score Metadata',
		showPlayButton = true,
		shouldPlayPreview = false,
		closesAt,
		onClose
	}: {
		score: Score;
		title?: string;
		showPlayButton?: boolean;
		shouldPlayPreview?: boolean;
		closesAt?: Date;
		onClose?: () => void;
	} = $props();

	let stats = $derived(score.statistics);
	const mods = $derived(score.mods.filter((mod) => mod.toLowerCase() !== 'cl'));
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
			{#if closesAt}
				<RoomCountdown {closesAt} {onClose} />
			{/if}
		</div>
		<p>
			<span class="font-bold text-green-500">{stats.ok ?? 0}</span> /
			<span class="font-bold text-yellow-500">{stats.meh ?? 0}</span> /
			<span class="font-bold text-red-500">{stats.miss ?? 0}</span>
		</p>
	</div>
	<div class="flex flex-col gap-2">
		<p class="text-wrap text-gray-400">
			{score.beatmapset?.artist} - {score.beatmapset?.title}
		</p>
		<div class="mt-3 flex justify-between">
			<div class="flex gap-1">
				<Badge color="neutral" soft>{Math.round(score.pp)}pp</Badge>
				<Badge color="neutral" soft>{(score.accuracy * 100).toFixed(2)}%</Badge>
				{#if score.beatmap?.difficulty_rating}
					<Badge color="neutral" soft>★ {score.beatmap.difficulty_rating.toFixed(2)}</Badge>
				{/if}
			</div>
			<div class="flex gap-0.5">
				{#if mods.length > 0}
					{#each mods as mod}
						<Badge color="warning" soft>{mod}</Badge>
					{/each}
				{:else}
					<Badge color="neutral" size="sm" soft>NM</Badge>
				{/if}
			</div>
		</div>
	</div>
</div>
