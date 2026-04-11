import type { User } from '$lib/client';
import { createContext } from 'svelte';
import type { Writable } from 'svelte/store';

export const [getUserContext, setUserContext] = createContext<Writable<User | null>>();
