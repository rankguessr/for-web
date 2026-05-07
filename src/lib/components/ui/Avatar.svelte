<script lang="ts">
	let { alt, src, class: className = '' }: { alt: string; src: string; class?: string } = $props();
</script>

<div tabindex="0" role="button" class={['btn avatar btn-circle btn-ghost', className]}>
	<div class="w-10 rounded-full">
		<img {alt} {src} />
	</div>
</div>
