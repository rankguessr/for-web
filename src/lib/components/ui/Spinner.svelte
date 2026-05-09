<script lang="ts">
	let {
		size = 'md',
		class: className = ''
	}: { size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'; class?: string } = $props();
</script>

<span class={[`loading loading-spinner loading-${size}`, className]}></span>
