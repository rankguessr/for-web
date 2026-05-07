<script lang="ts">
	// import { Button, Modal, P } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	const CURRENT_UPDATE = '20260412';
	const LAST_UPDATE_KEY = 'last_update';

	let defaultModal = $state(false);

	onMount(() => {
		const lastUpdate = localStorage.getItem(LAST_UPDATE_KEY);
		if (lastUpdate !== CURRENT_UPDATE) {
			defaultModal = true;
		}
	});

	function handleClose() {
		localStorage.setItem(LAST_UPDATE_KEY, CURRENT_UPDATE);
		defaultModal = false;
	}
</script>
<!-- 
<Modal
	title="New update"
	form
	bind:open={defaultModal}
	onaction={handleClose}
	onclose={handleClose}
>
	<P class="text-lg"
		>Hi! Thank you so much for using this app. We are already over <span class="font-semibold"
			>550</span
		> unique users!</P
	>
	<P class="text-lg">
		I've updated score selection algorythm to make less osu api requests, but it might be a little
		unstable. If you have any issues, please message me on discord: @harvywtf
	</P>

	{#snippet footer()}
		<Button type="submit" color="alternative">Close</Button>
	{/snippet}
</Modal> -->
