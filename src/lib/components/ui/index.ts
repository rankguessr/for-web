import type { Snippet } from 'svelte';
import type {
	HTMLAnchorAttributes,
	HTMLButtonAttributes,
	HTMLInputAttributes
} from 'svelte/elements';

export type AnchorButtonAttributes =
	| ({ href: string } & HTMLAnchorAttributes)
	| ({ href?: undefined } & HTMLButtonAttributes);

export type UISizes = 'sm' | 'md' | 'lg' | 'xl';
export type UIColors =
	| 'primary'
	| 'secondary'
	| 'success'
	| 'warning'
	| 'neutral'
	| 'error'
	| 'accent';

export type ButtonProps = AnchorButtonAttributes & {
	size?: UISizes;
	color?: UIColors;
	wide?: boolean;
	disabled?: boolean;
};

export interface PaginationProps {
	size?: UISizes;
	totalPages: number;
	currentPage: number;
	visiblePages?: number;
	onPageChange: (page: number) => void;
}

export interface BadgeProps {
	size?: UISizes;
	class?: string;
	soft?: boolean;
	color?: UIColors;
	children?: Snippet;
}

export interface ModalProps {
	id: string;
	children?: Snippet;
	showModal: boolean;
}

export interface InputProps extends HTMLInputAttributes {
	label: string;
	uisize?: UISizes;
}

export interface CheckboxProps extends HTMLInputAttributes {
	label: string;
	color?: UIColors;
	uisize?: UISizes;
}
