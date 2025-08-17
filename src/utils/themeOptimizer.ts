// Theme optimization utilities for instant switching

export const preloadThemeStyles = () => {
  if (typeof window === 'undefined') return;

  // Force browser to compute and cache theme-related styles
  const testElement = document.createElement('div');
  testElement.className = 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100';
  testElement.style.position = 'absolute';
  testElement.style.visibility = 'hidden';
  testElement.style.pointerEvents = 'none';
  
  document.body.appendChild(testElement);
  
  // Force style computation
  window.getComputedStyle(testElement);
  
  // Toggle dark mode to precompute dark styles
  document.documentElement.classList.add('dark');
  window.getComputedStyle(testElement);
  
  // Restore original state
  const isDark = localStorage.getItem('theme') === 'dark' || 
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  if (!isDark) {
    document.documentElement.classList.remove('dark');
  }
  
  // Clean up
  document.body.removeChild(testElement);
};

export const optimizeThemeSwitch = () => {
  if (typeof window === 'undefined') return;

  // Disable smooth scrolling during theme switch
  const originalScrollBehavior = document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior = 'auto';
  
  // Re-enable after a frame
  requestAnimationFrame(() => {
    document.documentElement.style.scrollBehavior = originalScrollBehavior;
  });
};

export const batchThemeUpdate = (isDark: boolean) => {
  if (typeof window === 'undefined') return;

  // Use DocumentFragment for batched DOM updates
  const html = document.documentElement;
  
  // Batch all theme-related class changes
  html.classList.add('theme-switching');
  
  if (isDark) {
    html.classList.add('dark');
    html.style.colorScheme = 'dark';
  } else {
    html.classList.remove('dark');
    html.style.colorScheme = 'light';
  }
  
  // Force immediate style recalculation
  html.offsetHeight;
  
  // Clean up after minimal delay
  setTimeout(() => {
    html.classList.remove('theme-switching');
  }, 16); // One frame at 60fps
};