function reportError(...error) {
    console.error(...error);
}

function getElem(ele, mode, parent) {
    // Return generic Element type or NodeList
    if (typeof ele !== 'string') {
        return ele;
    }
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
    // Casting the result as E or NodeList
    return mode === 'all' ? searchContext.querySelectorAll(ele) : searchContext.querySelector(ele);
}
function isObject(item) {
    return typeof item === 'object' && item !== null && !isArray(item);
}
function isArray(item) {
    return Array.isArray(item);
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
                if (isObject(value) || isArray(value)) {
                    if (!target[targetKey] || typeof target[targetKey] !== 'object') {
                        target[targetKey] = isArray(value) ? [] : {};
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
    static version = '1.2.1';
    darkModeToggleButton;
    options;
    defaults = {
        buttonSelector: null,
        onChange: (currentMode) => { },
        onDark: () => { },
        onLight: () => { },
        autoDetect: true,
        preferSystem: false,
        rootElement: document.documentElement,
        darkModeStorageKey: 'user-color-scheme',
        darkModeMediaQueryKey: '--color-mode',
        rootElementDarkModeAttributeName: 'data-user-color-scheme'
    };
    // Methods for external use
    onChangeCallback = (currentMode) => { };
    onDarkCallback = () => { };
    onLightCallback = () => { };
    validColorModeKeys = {
        dark: true,
        light: true
    };
    invertDarkModeObj = {
        dark: 'light',
        light: 'dark'
    };
    constructor(options = {}) {
        if (DarkMode.instance) {
            return DarkMode.instance;
        }
        this.init(options);
        DarkMode.instance = this;
        Object.seal(this);
    }
    /**
     * Initialization
     */
    init(option) {
        const userOptions = deepMerge(this.defaults, option);
        const { buttonSelector } = userOptions;
        let buttonElement = null;
        if (buttonSelector !== null) {
            if (buttonSelector instanceof HTMLElement) {
                buttonElement = buttonSelector;
            }
            else {
                buttonElement = getElem(buttonSelector);
            }
            if (!buttonElement) {
                throw new Error('ToggleButton could not be found with the selector provided.');
            }
        }
        userOptions.autoDetect = !userOptions.preferSystem ? userOptions.autoDetect : true;
        this.options = userOptions;
        this.darkModeToggleButton = buttonElement;
        this.onChangeCallback = this.options.onChange || this.onChangeCallback;
        this.onDarkCallback = this.options.onDark || this.onDarkCallback;
        this.onLightCallback = this.options.onLight || this.onLightCallback;
        this.setupDarkMode();
        console.log(`DarkMode is loaded, version: ${DarkMode.version}`);
    }
    setupDarkMode() {
        if (this.options.preferSystem)
            this.resetRootDarkModeAttribute();
        let currentSetting = !this.options.preferSystem ? getLocalValue(this.options.darkModeStorageKey) : null;
        if (currentSetting === null && this.options.autoDetect) {
            currentSetting = this.getModeFromSystemPreference();
        }
        else if (currentSetting === null) {
            currentSetting = 'light';
        }
        this.applyCustomDarkModeSettings(currentSetting);
        if (currentSetting === 'dark') {
            this.onDarkCallback();
        }
        else {
            this.onLightCallback();
        }
        // Bind events
        this.bindEvents();
        // Listen to system dark mode change if autoDetect is enabled or preferSystem is true
        if (this.options.autoDetect || this.options.preferSystem)
            this.listenToSystemDarkModeChange();
    }
    bindEvents() {
        if (this.darkModeToggleButton === null)
            return;
        this.darkModeToggleButton.addEventListener('click', () => {
            const newSetting = this.toggleCustomDarkMode();
            this.applyCustomDarkModeSettings(newSetting);
            if (newSetting) {
                this.onChangeCallback(newSetting);
                if (newSetting === 'dark') {
                    this.onDarkCallback();
                }
                else if (newSetting === 'light') {
                    this.onLightCallback();
                }
            }
        });
    }
    getModeFromSystemPreference() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
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
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            const hasCustomSetting = getLocalValue(this.options.darkModeStorageKey);
            if (hasCustomSetting === null) {
                const newSetting = e.matches ? 'dark' : 'light';
                this.applyCustomDarkModeSettings(newSetting);
                this.onChangeCallback(newSetting);
                if (newSetting === 'dark') {
                    this.onDarkCallback();
                }
                else {
                    this.onLightCallback();
                }
            }
        });
    }
    // Public methods
    destroy() {
        this.resetRootDarkModeAttribute();
    }
    /**
     * Switch directly to a specified mode
     * @param mode The color mode to switch to ('dark' or 'light')
     */
    switchMode(mode) {
        if (!this.validColorModeKeys[mode])
            return;
        const updatedSetting = this.applyCustomDarkModeSettings(mode);
        if (updatedSetting) {
            this.onChangeCallback(updatedSetting);
            if (updatedSetting === 'dark') {
                this.onDarkCallback();
            }
            else {
                this.onLightCallback();
            }
            // Save the new setting to localStorage
            setLocalValue(this.options.darkModeStorageKey, updatedSetting);
        }
    }
    // Getters and setters
    set onChange(callback) {
        this.onChangeCallback = callback;
    }
    set onDark(callback) {
        this.onDarkCallback = callback;
    }
    set onLight(callback) {
        this.onLightCallback = callback;
    }
}

var interfaces = /*#__PURE__*/Object.freeze({
    __proto__: null
});

var types = /*#__PURE__*/Object.freeze({
    __proto__: null
});

export { DarkMode, interfaces as DarkModeInterface, types as DarkModeType };
