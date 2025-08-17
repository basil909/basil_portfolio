'use client';

import { useState, useEffect, useCallback } from 'react';

export function useTheme() {
  const [isDark, setIsDark] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Use a flag to track if component is mounted
    let isMounted = true;

    // Check current theme immediately
    const checkTheme = () => {
      if (!isMounted) return;
      
      const hasThemeInitialized = document.documentElement.classList.contains('theme-initialized');
      const hasDarkClass = document.documentElement.classList.contains('dark');
      
      if (hasThemeInitialized) {
        setIsDark(hasDarkClass);
        setIsInitialized(true);
      } else {
        // Fallback if theme script hasn't run yet
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
        
        setIsDark(shouldBeDark);
        setIsInitialized(true);
      }
    };

    // Check immediately
    checkTheme();

    // Also check after a microtask to ensure DOM is ready
    queueMicrotask(checkTheme);

    return () => {
      isMounted = false;
    };
  }, []);

  // Optimized theme toggle function
  const toggleTheme = useCallback(() => {
    const newTheme = !isDark;
    
    // Update state immediately for instant UI feedback
    setIsDark(newTheme);
    
    // Batch DOM operations for maximum performance
    const html = document.documentElement;
    
    // Disable all transitions and animations during switch
    html.classList.add('theme-switching');
    
    // Apply theme changes in a single batch
    if (newTheme) {
      html.classList.add('dark');
      html.style.colorScheme = 'dark';
    } else {
      html.classList.remove('dark');
      html.style.colorScheme = 'light';
    }
    
    // Force immediate style recalculation
    html.offsetHeight;
    
    // Use microtask for immediate execution of side effects
    queueMicrotask(() => {
      // Save preference
      localStorage.setItem('theme', newTheme ? 'dark' : 'light');
      
      // Dispatch event for other components
      document.dispatchEvent(new CustomEvent('themeToggle', { 
        detail: { theme: newTheme ? 'dark' : 'light' } 
      }));
    });
    
    // Remove switching class after one frame
    requestAnimationFrame(() => {
      html.classList.remove('theme-switching');
    });
  }, [isDark]);

  // Force theme without animation
  const setTheme = useCallback((theme: 'light' | 'dark') => {
    const shouldBeDark = theme === 'dark';
    const html = document.documentElement;
    
    // Add switching class
    html.classList.add('theme-switching');
    
    // Apply changes
    if (shouldBeDark) {
      html.classList.add('dark');
      html.style.colorScheme = 'dark';
    } else {
      html.classList.remove('dark');
      html.style.colorScheme = 'light';
    }
    
    setIsDark(shouldBeDark);
    
    // Save and cleanup
    queueMicrotask(() => {
      localStorage.setItem('theme', theme);
      setTimeout(() => {
        html.classList.remove('theme-switching');
      }, 16);
    });
  }, []);

  return {
    isDark,
    isInitialized,
    toggleTheme,
    setTheme,
    theme: isDark ? 'dark' : 'light'
  };
}