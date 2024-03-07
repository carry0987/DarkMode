type DarkModeCallback = () => void;
type DarkModeCallbackWithMode = (currentMode: string) => void;
interface DarkModeOptions {
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
    constructor(options?: Partial<DarkModeOptions>);
    /**
     * Initialization
     */
    private init;
    private setupDarkMode;
    private bindEvents;
    private getModeFromSystemPreference;
    private getModeFromCSSMediaQuery;
    private resetRootDarkModeAttribute;
    private applyCustomDarkModeSettings;
    private toggleCustomDarkMode;
    private listenToSystemDarkModeChange;
    destroy(): void;
    /**
     * Switch directly to a specified mode
     * @param mode The color mode to switch to ('dark' or 'light')
     */
    switchMode(mode: string): void;
    set onChange(callback: (currentMode: string) => void);
    set onDark(callback: () => void);
    set onLight(callback: () => void);
}

export { type DarkModeOptions, DarkMode as default };
