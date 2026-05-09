<script lang="ts">
	import type { Score } from '$lib/client';
	import PlayButton from './PlayButton.svelte';
	import RoomCountdown from './RoomCountdown.svelte';
	import Badge from './ui/Badge.svelte';
	import { getCoverURL } from '$lib/utils';

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

	let isLoading = $state(true);

	const stats = $derived(score.statistics);
	const imgSrc = $derived(getCoverURL(score.beatmap.beatmapset_id, 0));
	const mods = $derived(score.mods.filter((mod) => mod.toLowerCase() !== 'cl'));
</script>

<div class="relative flex h-full w-full flex-col justify-between rounded-md p-4">
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

	<div class="z-10 flex justify-between">
		<div class="mb-2 flex items-center gap-1">
			{#if showPlayButton}
				<PlayButton url={score.beatmapset.preview_url} shouldPlay={shouldPlayPreview} />
			{/if}
			<h3 class="text-lg font-semibold text-white">{title}</h3>
			{#if closesAt}
				<RoomCountdown {closesAt} {onClose} />
			{/if}
		</div>
		<p class="text-white">
			<span class="font-bold text-green-500">{stats.ok ?? 0}</span> /
			<span class="font-bold text-yellow-500">{stats.meh ?? 0}</span> /
			<span class="font-bold text-red-500">{stats.miss ?? 0}</span>
		</p>
	</div>
	<div class="z-10 flex flex-col gap-2">
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
					{#each mods as mod (mod)}
						<Badge color="warning" soft>{mod}</Badge>
					{/each}
				{:else}
					<Badge color="neutral" size="sm" soft>NM</Badge>
				{/if}
			</div>
		</div>
	</div>
</div>
