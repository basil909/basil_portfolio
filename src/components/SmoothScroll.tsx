'use client';

import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { ReactLenis, useLenis } from 'lenis/react';
import { useMotionReduced } from '../hooks/useMotionReduced';

const LENIS_OPTIONS = {
  autoRaf: true,
  lerp: 0.1,
  smoothWheel: true,
  syncTouch: false, // touch screens keep their native momentum scrolling
  anchors: true, // in-page #links glide instead of jumping
} as const;

/** Turns Lenis off for reduced-motion visitors and slow devices. */
function ReducedMotionGuard() {
  const lenis = useLenis();
  const reduced = useMotionReduced();

  useEffect(() => {
    if (lenis && reduced) lenis.destroy();
  }, [lenis, reduced]);

  return null;
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={LENIS_OPTIONS}>
      <ReducedMotionGuard />
      {children}
    </ReactLenis>
  );
}
