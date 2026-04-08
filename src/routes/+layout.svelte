<script lang="ts">
	import { setContext } from 'svelte';
	import type { LayoutProps } from './$types';
	import './layout.css';
	import {
		Footer,
		FooterCopyright,
		FooterLink,
		FooterLinkGroup,
		ThemeProvider
	} from 'flowbite-svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	let { children, data }: LayoutProps = $props();

	setContext('user', () => data.user);
</script>

<ThemeProvider>
	<main class="flex min-h-screen w-full flex-col dark bg-gray-900 text-white">
		<div class="mx-auto flex min-h-screen w-full flex-col">
			<Navbar user={data.user} />
			<div class="flex w-full flex-1 flex-col">
				{@render children()}
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
