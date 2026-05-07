<script lang="ts">
	import type { PaginationProps } from '.';

	let {
		currentPage,
		totalPages,
		visiblePages = 5,
		size = 'md',
		onPageChange
	}: PaginationProps = $props();

	const halfVisible = $derived(Math.floor(visiblePages / 2));
	const lastPage = $derived(
		Math.min(Math.max(currentPage + halfVisible, visiblePages), totalPages)
	);
	const firstPage = $derived(Math.max(1, lastPage - visiblePages + 1));

	const pageNumbers = $derived(paginationRange(firstPage, lastPage));

	function sizeToClass(size: string) {
		switch (size) {
			case 'sm':
				return 'btn-sm';
			case 'lg':
				return 'btn-lg';
			default:
				return '';
		}
	}

	function paginationRange(start: number, end: number): number[] {
		return Array.from({ length: end - start + 1 }, (_, i) => start + i);
	}
</script>

{#snippet quickBtn(text: string, disabled: boolean, onclick: () => void)}
	<button
		type="button"
		class={['btn join-item btn-secondary', disabled ? 'btn-disabled' : '', sizeToClass(size)]}
		{onclick}
	>
		{text}
	</button>
{/snippet}

<div class="join">
	{@render quickBtn('«', currentPage <= 1, () => onPageChange(currentPage - 1))}
	{#each pageNumbers as page}
		<button
			class={['btn join-item btn-secondary', sizeToClass(size)]}
			class:btn-active={page === currentPage}
			onclick={() => onPageChange(page)}
		>
			{page}
		</button>
	{/each}
	{@render quickBtn('»', currentPage >= totalPages, () => onPageChange(currentPage + 1))}
</div>
