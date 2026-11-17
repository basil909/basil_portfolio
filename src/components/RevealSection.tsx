'use client';

import { useEffect, useRef } from 'react';
import type { ComponentPropsWithoutRef, CSSProperties } from 'react';

/**
 * Scroll reveal without an animation library.
 *
 * One IntersectionObserver flips `data-revealed` on the <section> once; every
 * descendant with the `.reveal` class then transitions in via CSS (rules live
 * in globals.css). The flag is written to the DOM node directly, so nothing
 * re-renders. Without JavaScript, with reduced motion, or in low-power mode the
 * content is simply visible.
 */
export default function RevealSection({ children, ...props }: ComponentPropsWithoutRef<'section'>) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (typeof IntersectionObserver === 'undefined') {
      el.dataset['revealed'] = 'true';
      return undefined;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        el.dataset['revealed'] = 'true';
        io.disconnect();
      },
      { threshold: 0.05, rootMargin: '0px 0px -10% 0px' },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} {...props}>
      {children}
    </section>
  );
}

/** Stagger helper for `.reveal` children. */
export const revealDelay = (seconds: number) => ({ '--reveal-delay': `${seconds}s` }) as CSSProperties;
