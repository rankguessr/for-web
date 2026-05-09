<script lang="ts">
	import { Sun, Moon } from '@lucide/svelte';
	import { onMount } from 'svelte';

	type Theme = 'latte' | 'mocha';
	let theme = $state<Theme>('mocha');

	onMount(() => {
		theme = (localStorage.getItem('theme') as Theme) || 'mocha';
	});

	function applyTheme(newTheme: Theme) {
		theme = newTheme;
		document.documentElement.setAttribute('data-theme', newTheme);
		localStorage.setItem('theme', newTheme);
	}

	function toggleTheme() {
		const nextTheme = theme === 'latte' ? 'mocha' : 'latte';
		applyTheme(nextTheme);
	}
</script>

<label class="swap swap-rotate">
	<input type="checkbox" checked={theme === 'latte'} onchange={toggleTheme} />

	<Sun size={24} class="swap-off fill-current" />

	<Moon size={24} class="swap-on fill-current" />
</label>
