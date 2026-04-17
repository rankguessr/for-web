import { add, clearTimeouts, dismiss, type ToastType } from './store';

const createHandler = (type: ToastType) => (message: string) => {
	add(message, type);
};

export const toast = {
	dismiss: dismiss,
	clearTimeouts: clearTimeouts,
	error: createHandler('error'),
	success: createHandler('success')
};

export { toasts } from './store';
