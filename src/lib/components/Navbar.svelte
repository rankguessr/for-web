<script lang="ts">
	import { env } from '$env/dynamic/public';
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

<div class="w-full rounded-md bg-base-100 shadow-sm max-lg:collapse lg:mb-48">
	<input id="navbar-1-toggle" class="peer hidden" type="checkbox" />
	<label for="navbar-1-toggle" class="fixed inset-0 hidden max-lg:peer-checked:block"></label>
	<div class="collapse-title navbar">
		<div class="navbar-start">
			<label for="navbar-1-toggle" class="btn btn-ghost lg:hidden">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h8m-8 6h16"
					/></svg
				>
			</label>
			<button class="btn text-xl btn-ghost">daisyUI</button>
		</div>
		<div class="navbar-center hidden lg:flex">
			<ul class="menu menu-horizontal px-1">
				<li><button>Item 1</button></li>
				<li>
					<details>
						<summary>Parent</summary>
						<ul class="z-1 w-40 bg-base-100 p-2">
							<li><button>Submenu 1</button></li>
							<li><button>Submenu 2</button></li>
						</ul>
					</details>
				</li>
				<li><button>Item 3</button></li>
			</ul>
		</div>
		<div class="navbar-end">
			<input type="text" placeholder="Search" class="input-bordered input w-64 lg:w-auto" />
		</div>
	</div>

	<div class="collapse-content z-1 lg:hidden">
		<ul class="menu">
			<li><button>Item 1</button></li>
			<li>
				<button>Parent</button>
				<ul>
					<li><button>Submenu 1</button></li>
					<li><button>Submenu 2</button></li>
				</ul>
			</li>
			<li><button>Item 3</button></li>
		</ul>
	</div>
</div>

<Navbar class="px-3 py-1 sm:px-4 dark:border-gray-700" breakpoint="md">
	<NavHamburger />
	<NavBrand href="/">
		<span class="self-center text-xl font-semibold whitespace-nowrap">rankguessr</span>
	</NavBrand>

	<NavUl>
		<NavLi href="/stats">statistics</NavLi>
		<NavLi href={env.PUBLIC_DISCORD_URL} target="_blank">discord</NavLi>
		{#if $user?.is_admin}
			<NavLi href="/admin">admin</NavLi>
		{/if}

		<NavLi class="cursor-pointer">
			misc<ChevronDown class="text-primary-800 ms-1 inline h-6 w-6 dark:text-gray-400" />
		</NavLi>
		<Dropdown simple class="w-44">
			<NavLi href={env.PUBLIC_DONATION_URL} target="_blank">support me</NavLi>
			<NavLi href={env.PUBLIC_GITHUB_URL} target="_blank">source code</NavLi>
		</Dropdown>
	</NavUl>

	<div class="flex items-center gap-3 md:order-2">
		{#if $user}
			<div class="hidden text-right sm:block">
				<p class="text-xs font-medium sm:text-sm">{$user.username}</p>
				<p class="text-xs font-semibold">({formatNumber($user.elo)} elo)</p>
			</div>
			<Avatar src={$user.avatar_url} alt={$user.username} class="h-8 w-8" />
			<a href={`${env.PUBLIC_API_URL}/auth/logout`}>
				<LogOut size={20} />
			</a>
		{:else}
			<Button href={`${env.PUBLIC_API_URL}/auth/login`} size="sm" color="primary"
				>Login with osu!</Button
			>
		{/if}
	</div>
</Navbar>
