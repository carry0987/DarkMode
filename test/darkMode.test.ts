import { DarkMode } from '@/component/darkMode';
import { describe, it, expect, vi } from 'vitest';

// Mock necessary functions if they interact with DOM or Local Storage
vi.mock('@carry0987/utils', () => ({
    getElem: (selector: string) => document.querySelector(selector),
    deepMerge: (obj1: Record<string, any>, obj2: Record<string, any>) => ({ ...obj1, ...obj2 }),
    setLocalValue: vi.fn(),
    getLocalValue: vi.fn(),
    removeLocalValue: vi.fn()
}));

describe('DarkMode', () => {
    it('should initialize with the default light mode', () => {
        document.body.innerHTML = `
            <div>
                <button id="btn-toggle-dark"></button>
            </div>
        `;

        new DarkMode({
            buttonSelector: '#btn-toggle-dark',
            autoDetect: false,
            preferSystem: false
        });

        const rootElement = document.documentElement;
        expect(rootElement.getAttribute('data-user-color-scheme')).toBe('light');
    });

    it('should toggle dark mode on button click', () => {
        const button = document.createElement('button');
        button.id = 'btn-toggle-dark';
        document.body.appendChild(button);

        const darkmode = new DarkMode({
            buttonSelector: button,
            autoDetect: false,
            preferSystem: false
        });

        darkmode.switchMode('dark');

        // Expect the mode to be toggled to dark
        const rootElement = document.documentElement;
        expect(rootElement.getAttribute('data-user-color-scheme')).toBe('dark');
    });
});
