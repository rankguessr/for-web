<script lang="ts">
	import { Pause, Play } from '@lucide/svelte';

	let { url, shouldPlay }: { url: string; shouldPlay: boolean } = $props();

	let isPlaying = $state(false);
	let audioUrl = $derived(url);
	let song = $derived(new Audio(audioUrl));

	$effect(() => {
		song.volume = 0.2;
		song.onended = () => {
			isPlaying = false;
		};
	});

	$effect(() => {
		if (shouldPlay) {
			isPlaying = true;
		}
	});

	$effect(() => {
		if (isPlaying) {
			song.play();
		} else {
			song.pause();
		}
	});
</script>

<button class="cursor-pointer text-white" onclick={() => (isPlaying = !isPlaying)}>
	{#if isPlaying}
		<Pause width={14} />
	{:else}
		<Play width={14} />
	{/if}
</button>
