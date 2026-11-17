'use client';

import { useEffect, useRef } from 'react';
import { useMotionReduced } from '../hooks/useMotionReduced';

/*
 * Two fixed, non-interactive layers over the whole page:
 * - film grain: a tiny SVG noise tile, so flat dark areas feel like a surface
 *   instead of a void;
 * - cursor light: a soft accent glow that follows the mouse. Its position is
 *   written to CSS variables once per frame — React never re-renders.
 * Both are skipped on touch devices, reduced motion and low-power mode.
 */

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export default function Ambient() {
  const reduced = useMotionReduced();
  const lightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const light = lightRef.current;
    if (!light || reduced || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;

    let frame = 0;
    let x = 0;
    let y = 0;
    const apply = () => {
      frame = 0;
      light.style.setProperty('--mx', `${x}px`);
      light.style.setProperty('--my', `${y}px`);
      light.style.opacity = '1';
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      x = e.clientX;
      y = e.clientY;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      light.style.opacity = '0';
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, [reduced]);

  return (
    <>
      <div
        ref={lightRef}
        className="ambient-light pointer-events-none fixed inset-0 z-[55] opacity-0 transition-opacity duration-500"
        aria-hidden="true"
      />
      <div
        className="ambient-grain pointer-events-none fixed inset-0 z-[56]"
        style={{ backgroundImage: GRAIN }}
        aria-hidden="true"
      />
    </>
  );
}
