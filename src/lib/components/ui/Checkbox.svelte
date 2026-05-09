<script lang="ts">
	import type { CheckboxProps, UIColors, UISizes } from '.';

	let {
		label,
		uisize = 'md',
		color = 'secondary',
		class: className,
		checked = $bindable(),
		...restProps
	}: CheckboxProps = $props();

	function sizeToClass(size: UISizes) {
		switch (size) {
			case 'sm':
				return 'checkbox-sm';
			case 'md':
				return 'checkbox-md';
			case 'lg':
				return 'checkbox-lg';
			case 'xl':
				return 'checkbox-xl';
			default:
				return 'checkbox-md';
		}
	}

	function colorToClass(color: UIColors) {
		switch (color) {
			case 'primary':
				return 'checkbox-primary';
			case 'secondary':
				return 'checkbox-secondary';
			case 'accent':
				return 'checkbox-accent';
			case 'error':
				return 'checkbox-error';
			default:
				return '';
		}
	}
</script>

<label class="label">
	<input
		type="checkbox"
		bind:checked
		class={['checkbox', sizeToClass(uisize), colorToClass(color), className]}
		{...restProps}
	/>
	{label}
</label>
