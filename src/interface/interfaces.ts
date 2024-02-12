type DarkModeCallback = () => void;
type DarkModeCallbackWithMode = (currentMode: string) => void;

export interface DarkModeOptions {
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
