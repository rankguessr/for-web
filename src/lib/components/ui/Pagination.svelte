<script lang="ts">
	import type { PaginationProps } from '.';

	let {
		currentPage = $bindable(),
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

	function paginationRange(start: number, end: number): number[] {
		return Array.from({ length: end - start + 1 }, (_, i) => start + i);
	}
</script>

{#snippet pageButton({
	text,
	onclick,
	disabled = false,
	active = false
}: {
	text: string;
	disabled?: boolean;
	active?: boolean;
	onclick: VoidFunction;
})}
	<button
		type="button"
		class={[
			'btn join-item btn-md btn-secondary max-[480px]:btn-sm',
			disabled ? 'btn-disabled' : '',
			active ? 'btn-active' : ''
		]}
		{onclick}
	>
		{text}
	</button>
{/snippet}

<div class="join">
	{@render pageButton({
		text: '«',
		disabled: currentPage <= 1,
		onclick: () => onPageChange(currentPage - 1)
	})}
	{#each pageNumbers as page}
		{@render pageButton({
			text: page.toString(),
			active: page === currentPage,
			onclick: () => onPageChange(page)
		})}
	{/each}
	{@render pageButton({
		text: '»',
		disabled: currentPage >= totalPages,
		onclick: () => onPageChange(currentPage + 1)
	})}
</div>
