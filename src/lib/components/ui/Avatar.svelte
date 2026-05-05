<script lang="ts">
	let { alt, src }: { alt: string; src: string } = $props();
</script>

<div tabindex="0" role="button" class="btn avatar btn-circle btn-ghost">
	<div class="w-10 rounded-full">
		<img {alt} {src} />
	</div>
</div>
