'use client';

import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

function getSystemTheme(): Theme {
  if (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    return 'dark';
  }

  return 'light';
}

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'dark';
  }

  try {
    const savedTheme = localStorage.getItem(STORAGE_KEY);

    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
  } catch {
    // Ignore localStorage errors.
  }

  return getSystemTheme();
}

function applyTheme(theme: Theme) {
  const html = document.documentElement;

  /*
   * Dark is the default theme.
   * Light mode is represented by the `.light` class.
   */
  html.classList.toggle('light', theme === 'light');

  html.style.colorScheme = theme;
}

export function useTheme() {
  const [theme, setThemeState] =
    useState<Theme>(getInitialTheme);

  const [isInitialized, setIsInitialized] =
    useState(false);

  /*
   * Sync React state with the theme already applied
   * by the initialization script in layout.tsx.
   */
  useEffect(() => {
    const html = document.documentElement;

    const currentTheme: Theme =
      html.classList.contains('light')
        ? 'light'
        : 'dark';

    setThemeState(currentTheme);
    setIsInitialized(true);
  }, []);

  const setTheme = useCallback(
    (nextTheme: Theme) => {
      applyTheme(nextTheme);

      setThemeState(nextTheme);

      try {
        localStorage.setItem(
          STORAGE_KEY,
          nextTheme,
        );
      } catch {
        // Ignore localStorage errors.
      }

      window.dispatchEvent(
        new CustomEvent('themechange', {
          detail: {
            theme: nextTheme,
          },
        }),
      );
    },
    [],
  );

  const toggleTheme = useCallback(() => {
    setThemeState((currentTheme) => {
      const nextTheme: Theme =
        currentTheme === 'dark'
          ? 'light'
          : 'dark';

      applyTheme(nextTheme);

      try {
        localStorage.setItem(
          STORAGE_KEY,
          nextTheme,
        );
      } catch {
        // Ignore localStorage errors.
      }

      window.dispatchEvent(
        new CustomEvent('themechange', {
          detail: {
            theme: nextTheme,
          },
        }),
      );

      return nextTheme;
    });
  }, []);

  const isDark = theme === 'dark';
  const isLight = theme === 'light';

  return {
    theme,
    isDark,
    isLight,
    isInitialized,
    setTheme,
    toggleTheme,
  };
}