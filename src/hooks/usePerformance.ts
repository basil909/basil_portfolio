'use client';

import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  fcp: number | null; // First Contentful Paint
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  ttfb: number | null; // Time to First Byte
}

interface WebVitals {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

export const usePerformance = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
  });

  const [webVitals, setWebVitals] = useState<WebVitals[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Track First Contentful Paint
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcpEntry = entries.find((entry) => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        setMetrics(prev => ({ ...prev, fcp: fcpEntry.startTime }));
      }
    });

    // Track Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lcpEntry = entries[entries.length - 1];
      if (lcpEntry) {
        setMetrics(prev => ({ ...prev, lcp: lcpEntry.startTime }));
      }
    });

    // Track First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fidEntry = entries[0];
      if (fidEntry) {
        setMetrics(prev => ({ ...prev, fid: fidEntry.processingStart - fidEntry.startTime }));
      }
    });

    // Track Cumulative Layout Shift
    const clsObserver = new PerformanceObserver((list) => {
      let clsValue = 0;
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      setMetrics(prev => ({ ...prev, cls: clsValue }));
    });

    try {
      fcpObserver.observe({ entryTypes: ['paint'] });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      fidObserver.observe({ entryTypes: ['first-input'] });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (error) {
      console.warn('Performance Observer not supported:', error);
    }

    // Track Time to First Byte
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      setMetrics(prev => ({ ...prev, ttfb: navigationEntry.responseStart - navigationEntry.requestStart }));
    }

    // Calculate Web Vitals ratings
    const calculateRating = (metric: string, value: number): 'good' | 'needs-improvement' | 'poor' => {
      const thresholds: Record<string, { good: number; poor: number }> = {
        fcp: { good: 1800, poor: 3000 },
        lcp: { good: 2500, poor: 4000 },
        fid: { good: 100, poor: 300 },
        cls: { good: 0.1, poor: 0.25 },
        ttfb: { good: 800, poor: 1800 },
      };

      const threshold = thresholds[metric];
      if (!threshold) return 'needs-improvement';

      if (value <= threshold.good) return 'good';
      if (value <= threshold.poor) return 'needs-improvement';
      return 'poor';
    };

    // Update web vitals when metrics change
    const updateWebVitals = () => {
      const vitals: WebVitals[] = [];
      
      if (metrics.fcp !== null) {
        vitals.push({
          name: 'FCP',
          value: metrics.fcp,
          rating: calculateRating('fcp', metrics.fcp),
        });
      }
      
      if (metrics.lcp !== null) {
        vitals.push({
          name: 'LCP',
          value: metrics.lcp,
          rating: calculateRating('lcp', metrics.lcp),
        });
      }
      
      if (metrics.fid !== null) {
        vitals.push({
          name: 'FID',
          value: metrics.fid,
          rating: calculateRating('fid', metrics.fid),
        });
      }
      
      if (metrics.cls !== null) {
        vitals.push({
          name: 'CLS',
          value: metrics.cls,
          rating: calculateRating('cls', metrics.cls),
        });
      }
      
      if (metrics.ttfb !== null) {
        vitals.push({
          name: 'TTFB',
          value: metrics.ttfb,
          rating: calculateRating('ttfb', metrics.ttfb),
        });
      }
      
      setWebVitals(vitals);
    };

    updateWebVitals();

    // Cleanup
    return () => {
      fcpObserver.disconnect();
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
    };
  }, [metrics]);

  // Send metrics to analytics (implement as needed)
  const sendToAnalytics = (metrics: PerformanceMetrics) => {
    // Example: Send to Google Analytics, Vercel Analytics, or custom endpoint
    if (process.env.NODE_ENV === 'production') {
      // gtag('event', 'web_vitals', metrics);
      console.log('Performance metrics:', metrics);
    }
  };

  useEffect(() => {
    if (Object.values(metrics).some(metric => metric !== null)) {
      sendToAnalytics(metrics);
    }
  }, [metrics]);

  return {
    metrics,
    webVitals,
    isReady: Object.values(metrics).some(metric => metric !== null),
  };
};

export default usePerformance;
