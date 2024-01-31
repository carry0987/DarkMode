function reportError(...error) {
    console.error(...error);
}

function getElem(ele, mode, parent) {
    if (typeof ele !== 'string')
        return ele;
    let searchContext = document;
    if (mode === null && parent) {
        searchContext = parent;
    }
    else if (mode && mode instanceof Node && 'querySelector' in mode) {
        searchContext = mode;
    }
    else if (parent && parent instanceof Node && 'querySelector' in parent) {
        searchContext = parent;
    }
    // If mode is 'all', search for all elements that match, otherwise, search for the first match
    return mode === 'all' ? searchContext.querySelectorAll(ele) : searchContext.querySelector(ele);
}
function isObject(item) {
    return typeof item === 'object' && item !== null && !Array.isArray(item);
}
function deepMerge(target, ...sources) {
    if (!sources.length)
        return target;
    const source = sources.shift();
    if (source) {
        for (const key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                const sourceKey = key;
                const value = source[sourceKey];
                const targetKey = key;
                if (isObject(value)) {
                    if (!target[targetKey] || typeof target[targetKey] !== 'object') {
                        target[targetKey] = {};
                    }
                    deepMerge(target[targetKey], value);
                }
                else {
                    target[targetKey] = value;
                }
            }
        }
    }
    return deepMerge(target, ...sources);
}

function setLocalValue(key, value, stringify = true) {
    if (stringify) {
        value = JSON.stringify(value);
    }
    window.localStorage.setItem(key, value);
}
function getLocalValue(key, parseJson = true) {
    let value = window.localStorage.getItem(key);
    if (parseJson) {
        try {
            value = JSON.parse(value);
        }
        catch (e) {
            reportError('Error while parsing stored json value: ', e);
        }
    }
    return value;
}
function removeLocalValue(key) {
    window.localStorage.removeItem(key);
}

class DarkMode {
    static instance = null;
    static version = '1.0.4';
    darkModeToggleButton;
    options;
    defaults = {
        onChange: (currentMode) => { },
        onDark: () => { },
        onLight: () => { },
        rootElement: document.documentElement,
        darkModeStorageKey: 'user-color-scheme',
        darkModeMediaQueryKey: '--color-mode',
        rootElementDarkModeAttributeName: 'data-user-color-scheme',
    };
    // Methods for external use
    _onChange = (currentMode) => { };
    _onDark = () => { };
    _onLight = () => { };
    validColorModeKeys = {
        dark: true,
        light: true,
    };
    invertDarkModeObj = {
        dark: 'light',
        light: 'dark',
    };
    constructor(buttonSelector, options = {}) {
        if (DarkMode.instance) {
            return DarkMode.instance;
        }
        const buttonElement = getElem(buttonSelector);
        if (!buttonElement) {
            throw new Error('ToggleButton could not be found with the selector provided.');
        }
        this.init(buttonElement, options);
        DarkMode.instance = this;
        Object.seal(this);
    }
    // Getters and setters
    set onChange(callback) {
        this._onChange = callback;
    }
    set onDark(callback) {
        this._onDark = callback;
    }
    set onLight(callback) {
        this._onLight = callback;
    }
    /**
     * Initialization
     */
    init(element, option) {
        const userOptions = deepMerge(this.defaults, option);
        this.options = userOptions;
        this.darkModeToggleButton = element;
        this._onChange = this.options.onChange || this._onChange;
        this._onDark = this.options.onDark || this._onDark;
        this._onLight = this.options.onLight || this._onLight;
        this.setupDarkMode();
        console.log(`DarkMode is loaded, version: ${DarkMode.version}`);
    }
    setupDarkMode() {
        let currentSetting = getLocalValue(this.options.darkModeStorageKey);
        if (currentSetting === null) {
            currentSetting = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        this.applyCustomDarkModeSettings(currentSetting);
        if (currentSetting === 'dark') {
            this._onDark();
        }
        else {
            this._onLight();
        }
        // Bind events
        this.bindEvents();
        // Listen to system dark mode change
        this.listenToSystemDarkModeChange();
    }
    bindEvents() {
        this.darkModeToggleButton.addEventListener('click', () => {
            const newSetting = this.toggleCustomDarkMode();
            this.applyCustomDarkModeSettings(newSetting);
            if (newSetting) {
                this._onChange(newSetting);
                if (newSetting === 'dark') {
                    this._onDark();
                }
                else if (newSetting === 'light') {
                    this._onLight();
                }
            }
        });
    }
    getModeFromCSSMediaQuery() {
        const res = getComputedStyle(this.options.rootElement).getPropertyValue(this.options.darkModeMediaQueryKey);
        if (res.length) {
            return res.replace(/\"/g, '').trim();
        }
        return res === 'dark' ? 'dark' : 'light';
    }
    resetRootDarkModeAttribute() {
        this.options.rootElement.removeAttribute(this.options.rootElementDarkModeAttributeName);
        removeLocalValue(this.options.darkModeStorageKey);
    }
    applyCustomDarkModeSettings(mode) {
        const currentSetting = mode || getLocalValue(this.options.darkModeStorageKey) || this.getModeFromCSSMediaQuery();
        if (this.validColorModeKeys[currentSetting]) {
            this.options.rootElement.setAttribute(this.options.rootElementDarkModeAttributeName, currentSetting);
        }
        else {
            this.resetRootDarkModeAttribute();
        }
        if (this.darkModeToggleButton && this.darkModeToggleButton instanceof Element) {
            this.darkModeToggleButton.classList.remove('dm-' + this.invertDarkModeObj[currentSetting]);
            this.darkModeToggleButton.classList.add('dm-' + currentSetting);
        }
        return currentSetting;
    }
    toggleCustomDarkMode() {
        let currentSetting = getLocalValue(this.options.darkModeStorageKey);
        if (this.validColorModeKeys[currentSetting]) {
            currentSetting = this.invertDarkModeObj[currentSetting];
        }
        else if (currentSetting === null) {
            currentSetting = this.invertDarkModeObj[this.getModeFromCSSMediaQuery()];
        }
        else {
            return;
        }
        // Save updated value to localStorage
        setLocalValue(this.options.darkModeStorageKey, currentSetting);
        return currentSetting;
    }
    listenToSystemDarkModeChange() {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            const hasCustomSetting = getLocalValue(this.options.darkModeStorageKey);
            if (hasCustomSetting === null) {
                const newSetting = e.matches ? 'dark' : 'light';
                this.applyCustomDarkModeSettings(newSetting);
                this._onChange(newSetting);
                if (newSetting === 'dark') {
                    this._onDark();
                }
                else {
                    this._onLight();
                }
            }
        });
    }
}

export { DarkMode as default };
