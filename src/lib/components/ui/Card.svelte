<script lang="ts">
	import type { Snippet } from 'svelte';

	let { class: className = '', children }: { class?: string; children?: Snippet } = $props();
</script>

<div class={['rounded-md border border-base-200 bg-base-200/60', className]}>
	{@render children?.()}
</div>
