import {
    getElem,
    deepMerge,
    setLocalValue,
    getLocalValue,
    removeLocalValue,
} from '@carry0987/utils';
import { DarkModeOptions } from './interface/interfaces';

class DarkMode {
    private static instance: DarkMode | null = null;
    private static version: string = '__version__';

    private darkModeToggleButton!: Element;
    private options!: DarkModeOptions;
    private defaults: DarkModeOptions = {
        onChange: (currentMode: string) => {},
        onDark: () => {},
        onLight: () => {},
        autoDetect: true,
        rootElement: document.documentElement,
        darkModeStorageKey: 'user-color-scheme',
        darkModeMediaQueryKey: '--color-mode',
        rootElementDarkModeAttributeName: 'data-user-color-scheme',
    };

    // Methods for external use
    private onChangeCallback = (currentMode: string) => {};
    private onDarkCallback = () => {};
    private onLightCallback = () => {};

    private validColorModeKeys: { [key: string]: boolean } = {
        dark: true,
        light: true,
    };

    private invertDarkModeObj: { [key: string]: string } = {
        dark: 'light',
        light: 'dark',
    };

    constructor(
        buttonSelector: string,
        options: Partial<DarkModeOptions> = {}
    ) {
        if (DarkMode.instance) {
            return DarkMode.instance;
        }

        const buttonElement = getElem(buttonSelector) as Element | null;
        if (!buttonElement) {
            throw new Error('ToggleButton could not be found with the selector provided.');
        }

        this.init(buttonElement, options);
        DarkMode.instance = this;
        Object.seal(this);
    }

    // Getters and setters
    set onChange(callback: (currentMode: string) => void) {
        this.onChangeCallback = callback;
    }

    set onDark(callback: () => void) {
        this.onDarkCallback = callback;
    }

    set onLight(callback: () => void) {
        this.onLightCallback = callback;
    }

    /**
     * Initialization
     */
    init(element: Element, option: Partial<DarkModeOptions>): void {
        const userOptions = deepMerge(this.defaults, option);

        this.options = userOptions;
        this.darkModeToggleButton = element;
        this.onChangeCallback = this.options.onChange || this.onChangeCallback;
        this.onDarkCallback = this.options.onDark || this.onDarkCallback;
        this.onLightCallback = this.options.onLight || this.onLightCallback;
        this.setupDarkMode();

        console.log(`DarkMode is loaded, version: ${DarkMode.version}`);
    }

    private setupDarkMode() {
        let currentSetting = getLocalValue(this.options.darkModeStorageKey);
        if (currentSetting === null) {
            currentSetting = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        this.applyCustomDarkModeSettings(currentSetting);
        if (currentSetting === 'dark') {
            this.onDarkCallback();
        } else {
            this.onLightCallback();
        }

        // Bind events
        this.bindEvents();

        // Listen to system dark mode change
        this.listenToSystemDarkModeChange();
    }

    private bindEvents() {
        this.darkModeToggleButton.addEventListener('click', () => {
            const newSetting = this.toggleCustomDarkMode();
            this.applyCustomDarkModeSettings(newSetting);
            if (newSetting) {
                this.onChangeCallback(newSetting as string);
                if (newSetting === 'dark') {
                    this.onDarkCallback();
                } else if (newSetting === 'light') {
                    this.onLightCallback();
                }
            }
        });
    }

    private getModeFromCSSMediaQuery(): string {
        const res = getComputedStyle(this.options.rootElement).getPropertyValue(
            this.options.darkModeMediaQueryKey
        );
        if (res.length) {
            return res.replace(/\"/g, '').trim();
        }

        return res === 'dark' ? 'dark' : 'light';
    }

    private resetRootDarkModeAttribute(): void {
        this.options.rootElement.removeAttribute(this.options.rootElementDarkModeAttributeName);
        removeLocalValue(this.options.darkModeStorageKey);
    }

    private applyCustomDarkModeSettings(mode?: string): string {
        const currentSetting = mode || getLocalValue(this.options.darkModeStorageKey) || this.getModeFromCSSMediaQuery();

        if (this.validColorModeKeys[currentSetting]) {
            this.options.rootElement.setAttribute(
                this.options.rootElementDarkModeAttributeName,
                currentSetting
            );
        } else {
            this.resetRootDarkModeAttribute();
        }

        if (this.darkModeToggleButton && this.darkModeToggleButton instanceof Element) {
            this.darkModeToggleButton.classList.remove(
                'dm-' + this.invertDarkModeObj[currentSetting]
            );
            this.darkModeToggleButton.classList.add('dm-' + currentSetting);
        }

        return currentSetting;
    }

    private toggleCustomDarkMode(): string | undefined {
        let currentSetting = getLocalValue(this.options.darkModeStorageKey);

        if (this.validColorModeKeys[currentSetting]) {
            currentSetting = this.invertDarkModeObj[currentSetting];
        } else if (currentSetting === null) {
            currentSetting = this.invertDarkModeObj[this.getModeFromCSSMediaQuery()];
        } else {
            return;
        }

        // Save updated value to localStorage
        setLocalValue(this.options.darkModeStorageKey, currentSetting);

        return currentSetting;
    }

    private listenToSystemDarkModeChange() {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            const hasCustomSetting = getLocalValue(this.options.darkModeStorageKey);
            if (hasCustomSetting === null) {
                const newSetting = e.matches ? 'dark' : 'light';
                this.applyCustomDarkModeSettings(newSetting);
                this.onChangeCallback(newSetting);
                if (newSetting === 'dark') {
                    this.onDarkCallback();
                } else {
                    this.onLightCallback();
                }
            }
        });
    }
}

export default DarkMode;
