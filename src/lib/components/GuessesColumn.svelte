<script lang="ts">
	import type { Guess } from '$lib/client';
	import GuessRow from './GuessRow.svelte';

	let { guesses, cap = 5 }: { guesses: Guess[]; cap?: number } = $props();
</script>

<div class="flex w-full flex-1 flex-col gap-2">
	{#if guesses.length > 0}
		{#each guesses.slice(0, cap) as item}
			<GuessRow guess={item} />
		{/each}
	{:else}
		<div class="font-semibold">No guesses available.</div>
	{/if}
</div>
