<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { getUserContext } from '$lib/context';
	import { formatNumber } from '$lib/utils';
	import { LogOut } from '@lucide/svelte';
	import Avatar from './ui/Avatar.svelte';
	import Button from './ui/Button.svelte';

	const user = getUserContext();
</script>

<div class="navbar bg-base-200 shadow-sm">
	<div class="navbar-start">
		<div class="dropdown">
			<div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h8m-8 6h16"
					/>
				</svg>
			</div>
			<ul
				tabindex="-1"
				class="dropdown-content menu z-1 mt-3 w-52 menu-md rounded-box bg-base-100 p-2 shadow"
			>
				<li><a href="/stats">statistics</a></li>
				<li><a href={env.PUBLIC_DISCORD_URL} target="_blank">discord</a></li>
				<li>
					<button>misc</button>
					<ul>
						<li><a href={env.PUBLIC_GITHUB_URL} target="_blank">source code</a></li>
						<li><a href={env.PUBLIC_DONATION_URL} target="_blank">support me</a></li>
					</ul>
				</li>
			</ul>
		</div>
		<a href="/" class="btn text-xl text-accent btn-ghost">rankguessr</a>
	</div>

	<div class="navbar-center hidden lg:flex">
		<ul class="menu menu-horizontal px-1">
			<li><a href="/stats">statistics</a></li>
			<li><a href={env.PUBLIC_DISCORD_URL} target="_blank">discord</a></li>
			<li>
				<details>
					<summary>misc</summary>
					<ul class="z-1 w-40 bg-base-100 p-2">
						<li><a href={env.PUBLIC_DONATION_URL} target="_blank">support me</a></li>
						<li><a href={env.PUBLIC_GITHUB_URL} target="_blank">github</a></li>
					</ul>
				</details>
			</li>
		</ul>
	</div>
	<div class="navbar-end">
		<div class="flex items-center gap-3 md:order-2">
			{#if $user}
				<div class="hidden text-right sm:block">
					<p class="text-xs font-medium sm:text-sm">{$user.username}</p>
					<p class="text-xs font-semibold">({formatNumber($user.elo)} elo)</p>
				</div>
				<Avatar src={$user.avatar_url} alt={$user.username} />
				<a href={`${env.PUBLIC_API_URL}/auth/logout`}>
					<LogOut size={20} />
				</a>
			{/if}
		</div>
	</div>
</div>
