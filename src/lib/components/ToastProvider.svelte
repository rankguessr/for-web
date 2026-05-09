<script lang="ts">
	import { toasts } from '$lib/toasts';
	import { fly } from 'svelte/transition';
	import ErrorIcon from './icons/ErrorIcon.svelte';
	import SuccessIcon from './icons/SuccessIcon.svelte';
</script>

<div class="toast toast-end">
	{#each $toasts as t (t.id)}
		{#if t.visible}
			<div
				role="alert"
				class={['alert', t.type === 'success' ? 'alert-success' : 'alert-error']}
				transition:fly={{ x: 200, duration: 800 }}
			>
				{#if t.type === 'success'}
					<SuccessIcon />
				{:else if t.type === 'error'}
					<ErrorIcon />
				{/if}
				<span>{t.message}</span>
			</div>
		{/if}
	{/each}
</div>
