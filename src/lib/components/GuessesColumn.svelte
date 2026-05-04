<script lang="ts">
	import type { Guess } from '$lib/client';
	import GuessRow from './GuessRow.svelte';

	let {
		guesses,
		cap = 5,
		showTimeSince = false
	}: { guesses: Guess[]; cap?: number; showTimeSince?: boolean } = $props();
</script>

<div class="flex w-full flex-1 flex-col gap-2">
	{#if guesses.length > 0}
		{#each guesses.slice(0, cap) as item}
			<GuessRow guess={item} {showTimeSince} />
		{/each}
	{:else}
		<div class="flex w-full flex-1 items-center justify-center">No guesses available.</div>
	{/if}
</div>
