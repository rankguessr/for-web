<script lang="ts">
	import type { ModalProps } from '.';

	let { showModal = $bindable(), id, children }: ModalProps = $props();

	let dialog: HTMLDialogElement | undefined = $state();

	$effect(() => {
		if (showModal) dialog?.showModal();
		else dialog?.close();
	});
</script>

<dialog
	{id}
	class="modal"
	bind:this={dialog}
	onclose={() => (showModal = false)}
	onclick={(e) => {
		if (e.target === dialog) dialog.close();
	}}
>
	<div class="modal-box">
		{@render children?.()}
	</div>
</dialog>
