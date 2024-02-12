type DarkModeCallback = () => void;
type DarkModeCallbackWithMode = (currentMode: string) => void;
interface DarkModeOptions {
    onChange: DarkModeCallbackWithMode;
    onDark: DarkModeCallback;
    onLight: DarkModeCallback;
    autoDetect: boolean;
    rootElement: HTMLElement;
    darkModeStorageKey: string;
    darkModeMediaQueryKey: string;
    rootElementDarkModeAttributeName: string;
}

declare class DarkMode {
    private static instance;
    private static version;
    private darkModeToggleButton;
    private options;
    private defaults;
    private onChangeCallback;
    private onDarkCallback;
    private onLightCallback;
    private readonly validColorModeKeys;
    private readonly invertDarkModeObj;
    constructor(buttonSelector: string, options?: Partial<DarkModeOptions>);
    /**
     * Initialization
     */
    private init;
    private setupDarkMode;
    private bindEvents;
    private getModeFromCSSMediaQuery;
    private resetRootDarkModeAttribute;
    private applyCustomDarkModeSettings;
    private toggleCustomDarkMode;
    private listenToSystemDarkModeChange;
    destroy(): void;
    set onChange(callback: (currentMode: string) => void);
    set onDark(callback: () => void);
    set onLight(callback: () => void);
}

export { DarkMode as default };
