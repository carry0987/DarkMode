type DarkModeCallback = () => void;

export interface DarkModeOptions {
    onChange?: DarkModeCallback;
    onDark?: DarkModeCallback;
    onLight?: DarkModeCallback;
    rootElement?: HTMLElement;
    darkModeStorageKey?: string;
    darkModeMediaQueryKey?: string;
    rootElementDarkModeAttributeName?: string;
}
