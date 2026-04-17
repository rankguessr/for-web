<script lang="ts">
	import { toast, toasts } from '$lib/toasts';
	import { CircleAlert, CircleCheck } from '@lucide/svelte';
	import { Toast, ToastContainer } from 'flowbite-svelte';
	import { onDestroy } from 'svelte';
	import { fly } from 'svelte/transition';

	onDestroy(() => {
		toast.clearTimeouts();
	});
</script>

<ToastContainer position="bottom-right">
	{#each $toasts as t (t.id)}
		<Toast
			color={t.type === 'success' ? 'green' : 'red'}
			dismissable={true}
			transition={fly}
			params={{ x: 200, duration: 800 }}
			class="w-64"
			onclose={() => toast.dismiss(t.id)}
			bind:toastStatus={t.visible}
		>
			{#snippet icon()}
				{#if t.type === 'success'}
					<CircleCheck class="h-5 w-5" />
					<span class="sr-only">Check icon</span>
				{:else}
					<CircleAlert class="h-5 w-5" />
					<span class="sr-only">Alert icon</span>
				{/if}
			{/snippet}

			{t.message}
		</Toast>
	{/each}
</ToastContainer>
