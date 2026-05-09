<script lang="ts">
	import type { ButtonProps, UIColors } from '.';

	let {
		size = 'md',
		color = 'primary',
		class: className = '',
		wide = false,
		disabled = false,
		children,
		...restProps
	}: ButtonProps = $props();

	let cls = $derived([
		'btn',
		sizeToClass(size),
		colorToClass(color),
		wide ? 'btn-wide' : '',
		disabled ? 'btn-disabled' : '',
		className
	]);

	function sizeToClass(size: string): string {
		switch (size) {
			case 'sm':
				return 'btn-sm';
			case 'lg':
				return 'btn-lg';
			default:
				return '';
		}
	}

	function colorToClass(color: UIColors): string {
		switch (color) {
			case 'accent':
				return 'btn-accent';
			case 'primary':
				return 'btn-primary';
			case 'secondary':
				return 'btn-secondary';
			case 'success':
				return 'btn-success';
			case 'warning':
				return 'btn-warning';
			case 'error':
				return 'btn-error';
			default:
				return '';
		}
	}
</script>

{#if restProps.href !== undefined}
	<a class={cls} {...restProps}>
		{@render children?.()}
	</a>
{:else}
	<button type="button" class={cls} {...restProps}>
		{@render children?.()}
	</button>
{/if}
