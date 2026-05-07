<script lang="ts">
	import type { InputProps, UISizes } from '.';

	let {
		label,
		uisize = 'md',
		class: className,
		value = $bindable(),
		...restProps
	}: InputProps = $props();

	function sizeToClass(size: UISizes) {
		switch (size) {
			case 'sm':
				return 'input-sm';
			case 'md':
				return 'input-md';
			case 'lg':
				return 'input-lg';
			case 'xl':
				return 'input-xl';
			default:
				return 'input-md';
		}
	}
</script>

<label class="floating-label">
	<input class={['input', sizeToClass(uisize), className]} bind:value {...restProps} />
	<span>{label}</span>
</label>
