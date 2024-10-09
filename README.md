# DarkMode
[![version](https://img.shields.io/npm/v/@carry0987/darkmode.svg)](https://www.npmjs.com/package/@carry0987/darkmode)
![CI](https://github.com/carry0987/DarkMode/actions/workflows/ci.yml/badge.svg)  
A simple DarkMode switcher, written in TypeScript

## Installation
```bash
pnpm i @carry0987/darkmode
```

## Usage
Here is a simple example to use DarkMode

#### UMD
```html
<div class="container py-5">
    <div id="app" class="d-flex flex-column justify-content-center align-items-center">
        <h1 class="mb-4">DarkMode</h1>
        <button id="btn-toggle-dark" class="darkmode-switch">Toggle Dark Mode</button>
    </div>
</div>
<script src="dist/darkMode.min.js"></script>
<script type="text/javascript">
document.addEventListener('DOMContentLoaded', () => {
    let darkmode = new darkModejs.DarkMode({
        buttonSelector: '#btn-toggle-dark',
        autoDetect: true,
        preferSystem: false,
        rootElement: document.documentElement,
        darkModeStorageKey: 'user-color-scheme',
        darkModeMediaQueryKey: '--color-mode',
        rootElementDarkModeAttributeName: 'data-user-color-scheme',
        onChange: () => {
            console.log('onChange');
        },
        onDark() {
            console.log('onDark');
        },
        onLight() {
            console.log('onLight');
        }
    });
    darkmode.onChange = (currentMode) => {
        console.log('onChange, current mode: ' + currentMode);
    };
});
</script>
```

#### ES Module
```ts
import { DarkMode } from '@carry0987/darkmode';

let darkmode = new DarkMode({
    //...
});
```
