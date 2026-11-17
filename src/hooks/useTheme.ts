'use client';

import { useCallback, useSyncExternalStore } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';
const CHANGE_EVENT = 'themechange';

/*
 * The source of truth is the `.light` class on <html>, set before first paint
 * by the inline script in layout.tsx. This hook only reads it.
 *
 * useSyncExternalStore renders the server snapshot ('dark', not initialized)
 * during hydration, so the markup always matches the server HTML, then
 * re-renders with the real theme straight after. No setState-in-effect, no
 * hydration mismatch for light-mode visitors.
 */

function readTheme(): Theme {
  return document.documentElement.classList.contains('light') ? 'light' : 'dark';
}

function subscribe(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    // Another tab changed the preference: apply it here too.
    if (event.key !== STORAGE_KEY) return;
    if (event.newValue === 'light' || event.newValue === 'dark') applyTheme(event.newValue);
    onChange();
  };

  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener('storage', onStorage);
  };
}

const noopSubscribe = () => () => {};

function applyTheme(theme: Theme) {
  const html = document.documentElement;

  // Dark is the default theme; light mode is represented by the `.light` class.
  html.classList.toggle('light', theme === 'light');
  html.style.colorScheme = theme;
}

export function useTheme() {
  const theme = useSyncExternalStore<Theme>(subscribe, readTheme, () => 'dark');
  const isInitialized = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  const setTheme = useCallback((nextTheme: Theme) => {
    applyTheme(nextTheme);

    try {
      localStorage.setItem(STORAGE_KEY, nextTheme);
    } catch {
      // Ignore localStorage errors (private mode, blocked storage).
    }

    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: { theme: nextTheme } }));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(readTheme() === 'dark' ? 'light' : 'dark');
  }, [setTheme]);

  return {
    theme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    isInitialized,
    setTheme,
    toggleTheme,
  };
}
