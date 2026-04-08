<script lang="ts">
	import NumberFlow from '@number-flow/svelte';

	let { rank, elo }: { rank: number; elo: number } = $props();

	let value = $state<number>(0);
	let showElo = $state(false);

	setTimeout(() => {
		value = rank;
		setTimeout(() => {
			showElo = true;
		}, 1100);
	}, 500);
</script>

#<NumberFlow
	transformTiming={{
		duration: 1000
	}}
	spinTiming={{
		duration: 1000
	}}
	opacityTiming={{
		duration: 1000
	}}
	{value}
/>

{#if showElo}
	{#if elo > 0}
		<p class="text-sm text-green-400">(+{elo} elo)</p>
	{:else}
		<p class="text-sm text-red-400">({elo} elo)</p>
	{/if}
{/if}
