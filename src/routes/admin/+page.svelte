<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { client } from '$lib/client/index.js';
	import Avatar from '$lib/components/ui/Avatar.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import { toast } from '$lib/toasts/index.js';
	import { getCoverURL, timeSince } from '$lib/utils/index.js';

	const { data } = $props();

	let currentPage = $derived(data.page);
	let submissions = $derived(data.submissions);
	let accepted = $derived(data.accepted);

	async function refresh() {
		await invalidate('app:admin');
	}

	async function onPageChange(page: number) {
		if (page === currentPage) return;
		await goto(resolve(`/admin?page=${page}&accepted=${accepted}`));
	}

	async function acceptSubmission(submissionId: string) {
		try {
			await client.adminAcceptSubmission(submissionId);
			await refresh();
			toast.success('Submission accepted');
		} catch (e: unknown) {
			toast.error(
				`Failed to accept submission: ${e instanceof Error ? e.message : 'Unknown error'}`
			);
		}
	}

	async function deleteSubmission(submissionId: string) {
		try {
			await client.adminDeleteSubmission(submissionId);
			await refresh();
			toast.success('Submission deleted');
		} catch (e: unknown) {
			toast.error(
				`Failed to delete submission: ${e instanceof Error ? e.message : 'Unknown error'}`
			);
		}
	}

	async function toggleAccepted() {
		await goto(resolve(`/admin?accepted=${!accepted}&page=1`));
	}
</script>

<section class="flex min-w-full flex-1 flex-col items-center gap-6 py-8">
	<Card class="flex max-w-full flex-col items-center gap-2 p-4 py-5 md:w-xl">
		<div class="flex w-full items-center justify-between">
			<h2 class="text-xl font-semibold">Last submissions</h2>
			<Checkbox label="Accepted" checked={accepted} onchange={toggleAccepted} />
		</div>

		{#each submissions as submission (submission.id)}
			{@const user = submission.user}
			<div class="flex w-full flex-col items-start gap-2 rounded-md border p-2">
				<a
					class="flex h-22 max-h-30 w-full cursor-pointer justify-between rounded-md p-2"
					style={`
						background: 
							linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), 
							url(${getCoverURL(submission.beatmapset_id, submission.beatmap_id)}); 
						background-size: cover; 
						background-position: center;
					`}
					target="_blank"
					href={`https://osu.ppy.sh/scores/${submission.score_id}`}
				>
					<div class="flex flex-col justify-between">
						<div class="flex items-center gap-2">
							<Avatar src={user.avatar_url} alt="User avatar" />
							<p class="text-right text-sm font-semibold">{user.username}</p>
						</div>
						<p>
							Comment: {submission.comment || 'none'}
						</p>
					</div>
					<div class="flex flex-col items-end justify-between">
						<p class="text-xs text-gray-400">
							{timeSince(new Date(submission.created_at))}
						</p>
					</div>
				</a>
				<div class="flex w-full items-center justify-between">
					<div>
						<Button color="accent">Watch in JoSu!</Button>
					</div>
					{#if !submission.is_accepted}
						<div class="flex gap-1">
							<Button color="success" onclick={() => acceptSubmission(submission.id)}>Accept</Button
							>
							<Button color="error" onclick={() => deleteSubmission(submission.id)}>Delete</Button>
						</div>
					{/if}
				</div>
			</div>
		{/each}
		{#if submissions}
			<Pagination {onPageChange} {currentPage} totalPages={10} size="lg" />
		{/if}
	</Card>
</section>
