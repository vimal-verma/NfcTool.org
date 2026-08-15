'use client';

import React, { createContext, useContext, useCallback, useSyncExternalStore } from 'react';

const ThemeContext = createContext();

export function useTheme() {
    return useContext(ThemeContext);
}

/**
 * The <html class="dark"> attribute is the single source of truth for the theme.
 * It is set before first paint by the inline script in layout.js (so there is no
 * flash of the wrong theme), which means the DOM — not React state — holds the
 * value. We read it through useSyncExternalStore so hydration stays clean and we
 * never have to sync state inside an effect.
 */
const listeners = new Set();

const notify = () => {
    for (const listener of listeners) listener();
};

const subscribe = (listener) => {
    listeners.add(listener);

    // Follow the OS setting for as long as the visitor hasn't chosen a theme.
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onOsChange = (e) => {
        let stored = null;
        try {
            stored = localStorage.getItem('theme');
        } catch {
            // Storage unavailable — fall back to following the OS.
        }
        if (stored === 'light' || stored === 'dark') return;
        document.documentElement.classList.toggle('dark', e.matches);
        notify();
    };
    media.addEventListener('change', onOsChange);

    return () => {
        listeners.delete(listener);
        media.removeEventListener('change', onOsChange);
    };
};

const getSnapshot = () => (document.documentElement.classList.contains('dark') ? 'dark' : 'light');

// Matches the server render; the inline script corrects the DOM before paint.
const getServerSnapshot = () => 'light';

export function ThemeProvider({ children }) {
    const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    const toggleTheme = useCallback((newTheme) => {
        if (newTheme !== 'light' && newTheme !== 'dark') return;
        try {
            localStorage.setItem('theme', newTheme);
        } catch {
            // Private mode / storage disabled — the choice still applies this session.
        }
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
        notify();
    }, []);

    const value = { theme, toggleTheme };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
