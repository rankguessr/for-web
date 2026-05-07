<script lang="ts">
	import type { Guess, GuessExtended } from '$lib/client';
	import GuessRow from './GuessRow.svelte';

	let {
		guesses,
		cap = 5,
		showTimeSince = false,
		class: className = ''
	}: {
		guesses: (Guess | GuessExtended)[];
		cap?: number;
		showTimeSince?: boolean;
		class?: string;
	} = $props();
</script>

<div class={['flex w-full flex-col gap-2', className]}>
	{#if guesses.length > 0}
		{#each guesses.slice(0, cap) as item}
			<GuessRow guess={item} user={'user' in item ? item.user : undefined} {showTimeSince} />
		{/each}
	{:else}
		<div class="flex w-full flex-1 items-center justify-center">No guesses available.</div>
	{/if}
</div>
