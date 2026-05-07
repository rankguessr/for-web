<script lang="ts">
	import type { BadgeProps, UIColors, UISizes } from '.';

	let {
		color = 'primary',
		size = 'md',
		class: className = '',
		soft = false,
		children
	}: BadgeProps = $props();

	const colorToClass = (color: UIColors): string => {
		switch (color) {
			case 'primary':
				return 'badge-primary';
			case 'secondary':
				return 'badge-secondary';
			case 'success':
				return 'badge-success';
			case 'warning':
				return 'badge-warning';
			case 'error':
				return 'badge-error';
			default:
				return '';
		}
	};

	const sizeToClass = (size: UISizes): string => {
		switch (size) {
			case 'sm':
				return 'badge-sm';
			case 'md':
				return 'badge-md';
			case 'lg':
				return 'badge-lg';
			case 'xl':
				return 'badge-xl';
			default:
				return '';
		}
	};
</script>

<div class={['badge', sizeToClass(size), colorToClass(color), soft ? 'badge-soft' : '', className]}>
	{@render children?.()}
</div>
