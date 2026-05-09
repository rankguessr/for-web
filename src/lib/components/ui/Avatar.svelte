<script lang="ts">
	let {
		alt,
		src,
		class: className = '',
		asButton = false
	}: { alt: string; src: string; class?: string; asButton?: boolean } = $props();

	const divProps = $derived(asButton ? { role: 'button', tabindex: 0 } : {});
</script>

<div class={['btn avatar btn-circle btn-ghost', className]} {...divProps}>
	<div class="w-10 rounded-full">
		<img {alt} {src} />
	</div>
</div>
