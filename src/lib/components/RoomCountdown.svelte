<script lang="ts">
	import { Badge } from 'flowbite-svelte';

	let { closesAt, onClose }: { closesAt: Date; onClose?: () => void } = $props();

	let closesIn = $state<number>(getClosesIn());

	let intervalId = setInterval(() => {
		closesIn = getClosesIn();
	}, 1000);

	function getClosesIn(): number {
		const now = new Date();
		const diff = new Date(closesAt).getTime() - now.getTime();

		if (diff <= 0) {
			clearInterval(intervalId);
			onClose?.();
			return 0;
		}

		return diff;
	}

	function formatMillis(millis: number) {
		const totalSeconds = Math.floor(millis / 1000);
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = totalSeconds % 60;

		return `${minutes}:${seconds.toString().padStart(2, '0')}`;
	}
</script>

<Badge color="gray">{formatMillis(closesIn)}</Badge>
