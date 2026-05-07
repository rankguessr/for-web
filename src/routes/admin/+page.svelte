<script lang="ts">
	import { client, type SubmissionExtended } from '$lib/client/index.js';
	import Avatar from '$lib/components/ui/Avatar.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import { toast } from '$lib/toasts/index.js';
	import { getCoverURL, timeSince } from '$lib/utils/index.js';

	let currentPage = $state(1);
	let loading = $state(true);
	let showAccepted = $state(false);
	let submissions = $state<SubmissionExtended[]>([]);

	$effect(() => {
		loadSubmissions(currentPage);
	});

	async function loadSubmissions(page: number) {
		try {
			loading = true;
			submissions = await client.adminGetSubmissions({ page, accepted: showAccepted });
			currentPage = page;
		} catch (e) {
			toast.error('Failed to load submissions');
		} finally {
			loading = false;
		}
	}

	async function onPageChange(page: number) {
		if (page === currentPage) return;
		await loadSubmissions(page);
	}

	async function acceptSubmission(submissionId: string) {
		try {
			await client.adminAcceptSubmission(submissionId);
			toast.success('Submission accepted');
			await loadSubmissions(currentPage);
		} catch (e) {
			toast.error('Failed to accept submission');
		}
	}

	async function deleteSubmission(submissionId: string) {
		try {
			await client.adminDeleteSubmission(submissionId);
			toast.success('Submission deleted');
			await loadSubmissions(currentPage);
		} catch (e) {
			toast.error('Failed to delete submission');
		}
	}
</script>

<section class="flex min-w-full flex-1 flex-col items-center gap-6 py-8">
	<Card class="flex max-w-full flex-col items-center gap-2 p-4 py-5 md:w-xl">
		<div class="flex w-full items-center justify-between">
			<div class="flex items-center gap-2">
				<h2 class="text-xl font-semibold">Last submissions</h2>
				<!-- <Toggle bind:checked={showAccepted}>Accepted</Toggle> -->
			</div>
		</div>

		{#if loading}
			<Spinner class="m-auto h-full" />
		{:else}
			{#each submissions as submission}
				{@const user = submission.user}
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

						{#if !submission.is_accepted}
							<div class="flex gap-1">
								<Button color="success" onclick={() => acceptSubmission(submission.id)}
									>Accept</Button
								>
								<Button color="error" onclick={() => deleteSubmission(submission.id)}>
									Delete
								</Button>
							</div>
						{/if}
					</div>
				</a>
			{/each}
		{/if}
		{#if submissions}
			<Pagination
				{onPageChange}
				{currentPage}
				totalPages={10}
				size="lg"
			/>
		{/if}
	</Card>
</section>
