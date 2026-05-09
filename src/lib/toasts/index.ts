import { add, clearTimeouts, dismiss } from './store';

export const toast = {
	dismiss: dismiss,
	clearTimeouts: clearTimeouts,
	error: (message: string, err?: unknown) => {
		const errorMessage =
			err instanceof Error ? `${message}: ${err.message}` : `${message}: Unknown error`;
		add(errorMessage, 'error');
	},
	success: (message: string) => add(message, 'success')
};

export { toasts } from './store';
