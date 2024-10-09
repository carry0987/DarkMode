type DarkModeCallback = () => void;
type DarkModeCallbackWithMode = (currentMode: string) => void;

type types_DarkModeCallback = DarkModeCallback;
type types_DarkModeCallbackWithMode = DarkModeCallbackWithMode;
declare namespace types {
  export type { types_DarkModeCallback as DarkModeCallback, types_DarkModeCallbackWithMode as DarkModeCallbackWithMode };
}

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

type interfaces_DarkModeOptions = DarkModeOptions;
declare namespace interfaces {
  export type { interfaces_DarkModeOptions as DarkModeOptions };
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

export { DarkMode, interfaces as DarkModeInterface, types as DarkModeType };
