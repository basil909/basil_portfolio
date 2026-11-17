'use client';

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { useMotionReduced } from '../hooks/useMotionReduced';

/*
 * A vertical rail beside a list that fills as the reader scrolls past it; each
 * `.timeline-dot` inside lights up once the fill reaches it. One transform and
 * a few data-attribute writes per frame — no React re-renders.
 */
export default function TimelineRail({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const reduced = useMotionReduced();

  useEffect(() => {
    const root = rootRef.current;
    const fill = fillRef.current;
    if (!root || !fill) return undefined;
    const dots = [...root.querySelectorAll<HTMLElement>('.timeline-dot')];

    if (reduced) {
      fill.style.transform = 'scaleY(1)';
      dots.forEach((d) => (d.dataset['on'] = 'true'));
      return undefined;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = root.getBoundingClientRect();
      // Fill reaches whatever sits at 60% of the viewport height.
      const reach = window.innerHeight * 0.6 - rect.top;
      const progress = Math.min(1, Math.max(0, reach / rect.height));
      fill.style.transform = `scaleY(${progress})`;
      for (const d of dots) {
        const top = d.getBoundingClientRect().top - rect.top;
        d.dataset['on'] = String(top <= reach);
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [reduced]);

  return (
    <div ref={rootRef} className="relative pl-9 sm:pl-12">
      <span className="absolute bottom-0 left-[7px] top-0 w-px bg-[var(--line-strong)]" aria-hidden="true" />
      <span
        ref={fillRef}
        className="absolute bottom-0 left-[7px] top-0 w-px origin-top scale-y-0 bg-[var(--primary)]"
        aria-hidden="true"
      />
      {children}
    </div>
  );
}
