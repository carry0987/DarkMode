import { DarkModeCallback, DarkModeCallbackWithMode } from '@/type/types';

export interface DarkModeOptions {
    buttonSelector: string | HTMLElement | null;
    onChange: DarkModeCallbackWithMode;
    onDark: DarkModeCallback;
    onLight: DarkModeCallback;
    autoDetect: boolean;
    preferSystem: boolean;
    rootElement: HTMLElement;
    darkModeStorageKey: string;
    darkModeMediaQueryKey: string;
    rootElementDarkModeAttributeName: string;
}
