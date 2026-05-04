import { writable } from 'svelte/store';

// a lot of logic borrowed from https://github.com/kbrgl/svelte-french-toast

const TOAST_LIMIT = 4;
const TOAST_DISMISS_TIMEOUT = 3000;

export type ToastType = 'success' | 'error';

export type Toast = {
	id: string;
	message: string;
	visible: boolean;
	type: ToastType;
};

export const toasts = writable<Toast[]>([]);

const timeoutIds = new Map<string, ReturnType<typeof setTimeout>>();

const genId = (() => {
	let count = 0;

	return () => {
		count += 1;
		return count.toString();
	};
})();

export const remove = (toastId: string) => {
	toasts.update(($toasts) => {
		return $toasts.filter((t) => t.id !== toastId);
	});
};

export const add = (message: string, type: ToastType = 'success') => {
	toasts.update((currentToasts) => {
		const toast = { id: genId(), visible: true, message, type };
		const timeoutId = setTimeout(() => {
			dismiss(toast.id);
		}, 5000);
		timeoutIds.set(toast.id, timeoutId);

		return [...currentToasts, toast].slice(0, TOAST_LIMIT);
	});
};

export const dismiss = (id: string) => {
	toasts.update(($toasts) => {
		const toast = $toasts.find((t) => t.id === id);
		if (!toast) {
			return $toasts;
		}

		if (timeoutIds.has(id)) {
			clearTimeout(timeoutIds.get(id));
			timeoutIds.delete(id);
		}

		setTimeout(() => {
			remove(id);
		}, 300);

		return $toasts.map((t) => (t.id === id ? { ...t, visible: false } : t));
	});
};

export const clearTimeouts = () => {
	timeoutIds.forEach((timeoutId) => {
		clearTimeout(timeoutId);
	});
	timeoutIds.clear();
};
