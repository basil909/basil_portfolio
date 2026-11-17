'use client';

import type { ReactNode } from 'react';
import { ReactLenis } from 'lenis/react';
import type { LenisOptions } from 'lenis';
import { useMotionReduced } from '../hooks/useMotionReduced';

const BASE_OPTIONS = {
  autoRaf: true,
  lerp: 0.1,
  syncTouch: false, // touch screens keep their native momentum scrolling
} as const satisfies LenisOptions;

// Two stable objects, so <ReactLenis> only rebuilds its instance when the mode flips.
const SMOOTH_OPTIONS: LenisOptions = { ...BASE_OPTIONS, smoothWheel: true, anchors: true };
const PLAIN_OPTIONS: LenisOptions = { ...BASE_OPTIONS, smoothWheel: false, anchors: { immediate: true } };

/**
 * Lenis smooth scrolling. Reduced-motion visitors and slow devices get native
 * wheel scrolling and instant anchor jumps. ReactLenis recreates its instance
 * when the options change, so the mode follows the OS setting both ways.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useMotionReduced();

  return (
    <ReactLenis root options={reduced ? PLAIN_OPTIONS : SMOOTH_OPTIONS}>
      {children}
    </ReactLenis>
  );
}
