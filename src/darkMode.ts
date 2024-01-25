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
        onChange: () => {},
        onDark: () => {},
        onLight: () => {},
        rootElement: document.documentElement,
        darkModeStorageKey: 'user-color-scheme',
        darkModeMediaQueryKey: '--color-mode',
        rootElementDarkModeAttributeName: 'data-user-color-scheme',
    };

    // Methods for external use
    private _onChange = () => {};
    private _onDark = () => {};
    private _onLight = () => {};

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
    set onChange(callback: () => void) {
        this._onChange = callback;
    }

    set onDark(callback: () => void) {
        this._onDark = callback;
    }

    set onLight(callback: () => void) {
        this._onLight = callback;
    }

    /**
     * Initialization
     */
    init(element: Element, option: Partial<DarkModeOptions>): void {
        const userOptions = deepMerge(this.defaults, option);

        this.options = userOptions as DarkModeOptions;
        this.darkModeToggleButton = element;
        this._onChange = this.options.onChange || this._onChange;
        this._onDark = this.options.onDark || this._onDark;
        this._onLight = this.options.onLight || this._onLight;
        this.setupDarkMode();

        console.log(`DarkMode is loaded, version: ${DarkMode.version}`);
    }

    private setupDarkMode() {
        this.applyCustomDarkModeSettings();
        this.bindEvents();
    }

    private bindEvents() {
        this.darkModeToggleButton.addEventListener('click', () => {
            const newSetting = this.toggleCustomDarkMode();
            this.applyCustomDarkModeSettings(newSetting);
            if (newSetting) {
                this._onChange();
                if (newSetting === 'dark') {
                    this._onDark();
                } else if (newSetting === 'light') {
                    this._onLight();
                }
            }
        });
    }

    private getModeFromCSSMediaQuery(): string {
        const res = getComputedStyle(this.options.rootElement!).getPropertyValue(
            this.options.darkModeMediaQueryKey!
        );
        if (res.length) {
            return res.replace(/\"/g, '').trim();
        }
        return res === 'dark' ? 'dark' : 'light';
    }

    private resetRootDarkModeAttributeAndLS(): void {
        this.options.rootElement!.removeAttribute(this.options.rootElementDarkModeAttributeName!);
        removeLocalValue(this.options.darkModeStorageKey!);
    }

    private applyCustomDarkModeSettings(mode?: string): void {
        const currentSetting = mode || getLocalValue(this.options.darkModeStorageKey!);

        if (currentSetting === this.getModeFromCSSMediaQuery()) {
            this.resetRootDarkModeAttributeAndLS();
        } else if (this.validColorModeKeys[currentSetting]) {
            this.options.rootElement!.setAttribute(
                this.options.rootElementDarkModeAttributeName!,
                currentSetting
            );
        } else {
            this.resetRootDarkModeAttributeAndLS();
        }

        if (
            this.darkModeToggleButton &&
            this.darkModeToggleButton instanceof Element
        ) {
            this.darkModeToggleButton.classList.remove(
                'dm-' + this.invertDarkModeObj[currentSetting]
            );
            this.darkModeToggleButton.classList.add('dm-' + currentSetting);
        }
    }

    private toggleCustomDarkMode(): string | undefined {
        let currentSetting = getLocalValue(this.options.darkModeStorageKey!);

        if (this.validColorModeKeys[currentSetting]) {
            currentSetting = this.invertDarkModeObj[currentSetting];
        } else if (currentSetting === null) {
            currentSetting =
                this.invertDarkModeObj[this.getModeFromCSSMediaQuery()];
        } else {
            return;
        }

        setLocalValue(this.options.darkModeStorageKey!, currentSetting);
        return currentSetting;
    }
}

export default DarkMode;
