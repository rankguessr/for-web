<script lang="ts">
	import { Pause, Play } from '@lucide/svelte';

	let { url, shouldPlay }: { url: string; shouldPlay: boolean } = $props();

	let isPlaying = $state(false);
	let song = $state(new Audio(url));

	song.volume = 0.2;
	song.onended = () => {
		isPlaying = false;
	};

	if (shouldPlay) {
		isPlaying = true;
	}

	$effect(() => {
		if (isPlaying) {
			song.play();
		} else {
			song.pause();
		}
	});
</script>

<button class="cursor-pointer" onclick={() => (isPlaying = !isPlaying)}>
	{#if isPlaying}
		<Pause width={14} />
	{:else}
		<Play width={14} />
	{/if}
</button>
