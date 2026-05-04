<script lang="ts">
	import type { LayoutProps } from './$types';
	import './layout.css';
	import { Spinner, ThemeProvider } from 'flowbite-svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { setUserContext } from '$lib/context';
	import { writable } from 'svelte/store';
	import UpdateModal from '$lib/components/UpdateModal.svelte';
	import ToastsProvider from '$lib/components/ToastsProvider.svelte';

	let { children, data }: LayoutProps = $props();

	const user = $derived(data.user);
	setUserContext(writable(user));

	let loading = $state(false);
	beforeNavigate(() => {
		loading = true;
	});

	afterNavigate(() => {
		loading = false;
	});
</script>

<ThemeProvider>
	<main class="flex min-h-screen w-full flex-col dark bg-gray-900 text-white">
		<div class="mx-auto flex min-h-screen w-full flex-col">
			<Navbar />
			<div class="flex w-full flex-1 flex-col px-4">
				{#if loading}
					<div class="flex flex-1 items-center justify-center">
						<Spinner type="default" color="primary" />
					</div>
				{:else}
					{#if user}
						<UpdateModal />
					{/if}

					<ToastsProvider />

					{@render children()}
				{/if}
			</div>
			<!-- 
			<Footer>
				<p>made by <a href="https://github.com/havrydotdev">@harvywtf</a></p>
				<FooterLinkGroup
					class="mt-3 flex flex-wrap items-center text-sm text-gray-500 sm:mt-0 dark:text-gray-400"
				>
					<FooterLink href="/">About</FooterLink>
					<FooterLink href="/">Privacy Policy</FooterLink>
					<FooterLink href="/">Licensing</FooterLink>
					<FooterLink href="/">Contact</FooterLink>
				</FooterLinkGroup>
			</Footer> -->
		</div>
	</main>
</ThemeProvider>
