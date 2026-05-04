<script lang="ts">
	import {
		PUBLIC_API_URL,
		PUBLIC_DONATION_URL,
		PUBLIC_GITHUB_URL,
		PUBLIC_DISCORD_URL
	} from '$env/static/public';
	import { getUserContext } from '$lib/context';
	import { formatNumber } from '$lib/utils';
	import { ChevronDown, LogOut } from '@lucide/svelte';
	import {
		Avatar,
		Button,
		Dropdown,
		Navbar,
		NavBrand,
		NavHamburger,
		NavLi,
		NavUl
	} from 'flowbite-svelte';

	const user = getUserContext();
</script>

<Navbar class="px-3 py-1 sm:px-4 dark:border-gray-700" breakpoint="md">
	<NavHamburger />
	<NavBrand href="/">
		<span class="self-center text-xl font-semibold whitespace-nowrap">rankguessr</span>
	</NavBrand>

	<NavUl>
		<NavLi href="/stats">statistics</NavLi>
		<NavLi href={PUBLIC_DISCORD_URL} target="_blank">discord</NavLi>
		{#if $user?.is_admin}
			<NavLi href="/admin">admin</NavLi>
		{/if}

		<NavLi class="cursor-pointer">
			misc<ChevronDown class="ms-1 inline h-6 w-6 text-primary-800 dark:text-gray-400" />
		</NavLi>
		<Dropdown simple class="w-44">
			<NavLi href={PUBLIC_DONATION_URL} target="_blank">support me</NavLi>
			<NavLi href={PUBLIC_GITHUB_URL} target="_blank">source code</NavLi>
		</Dropdown>
	</NavUl>

	<div class="flex items-center gap-3 md:order-2">
		{#if $user}
			<div class="hidden text-right sm:block">
				<p class="text-xs font-medium sm:text-sm">{$user.username}</p>
				<p class="text-xs font-semibold">({formatNumber($user.elo)} elo)</p>
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
