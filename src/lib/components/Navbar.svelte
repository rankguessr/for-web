<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';
	import { getUserContext } from '$lib/context';
	import { LogOut } from '@lucide/svelte';
	import { Avatar, Button, Navbar, NavBrand, NavLi, NavUl } from 'flowbite-svelte';

	const user = getUserContext();
</script>

<Navbar class="px-3 py-1 sm:px-4 dark:border-gray-700">
	<div class="flex gap-4">
		<NavBrand href="/">
			<span class="self-center text-xl font-semibold whitespace-nowrap">rankguessr</span>
		</NavBrand>

		<NavUl>
			<NavLi href="/stats">statistics</NavLi>
			<NavLi href="https://ko-fi.com/harvywtf" target="_blank">support me</NavLi>
			<NavLi href="https://github.com/rankguessr/api" target="_blank">source code</NavLi>
		</NavUl>
	</div>

	<div class="flex items-center gap-3 md:order-2">
		{#if $user}
			<div class="hidden text-right sm:block">
				<p class="text-xs font-medium sm:text-sm">{$user.username}</p>
				<p class="text-xs font-semibold">({$user.elo} elo)</p>
			</div>
			<Avatar src={$user.avatar_url} alt={$user.username} class="h-8 w-8" />
			<a href={`${PUBLIC_API_URL}/auth/logout`}>
				<LogOut size={20} />
			</a>
		{:else}
			<Button href={`${PUBLIC_API_URL}/auth/login`} size="sm" color="primary"
				>Login with osu!</Button
			>
		{/if}
	</div>
</Navbar>
