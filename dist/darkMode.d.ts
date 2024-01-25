type DarkModeCallback = () => void;
type DarkModeCallbackWithMode = (currentMode: string) => void;
interface DarkModeOptions {
    onChange?: DarkModeCallbackWithMode;
    onDark?: DarkModeCallback;
    onLight?: DarkModeCallback;
    rootElement?: HTMLElement;
    darkModeStorageKey?: string;
    darkModeMediaQueryKey?: string;
    rootElementDarkModeAttributeName?: string;
}

declare class DarkMode {
    private static instance;
    private static version;
    private darkModeToggleButton;
    private options;
    private defaults;
    private _onChange;
    private _onDark;
    private _onLight;
    private validColorModeKeys;
    private invertDarkModeObj;
    constructor(buttonSelector: string, options?: Partial<DarkModeOptions>);
    set onChange(callback: (currentMode: string) => void);
    set onDark(callback: () => void);
    set onLight(callback: () => void);
    /**
     * Initialization
     */
    init(element: Element, option: Partial<DarkModeOptions>): void;
    private setupDarkMode;
    private bindEvents;
    private getModeFromCSSMediaQuery;
    private resetRootDarkModeAttribute;
    private applyCustomDarkModeSettings;
    private toggleCustomDarkMode;
}

export { DarkMode as default };
