'use client';

import { useEffect, useRef } from 'react';
import { useMotionReduced } from '../hooks/useMotionReduced';

/*
 * Renders the final number on the server (correct without JS), then counts up
 * from zero the first time it scrolls into view. Writes textContent directly,
 * so the count never re-renders React.
 */
export default function CountUp({
  value,
  decimals = 0,
  suffix = '',
  duration = 1200,
}: {
  value: number;
  decimals?: number | undefined;
  suffix?: string | undefined;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useMotionReduced();
  const final = `${value.toFixed(decimals)}${suffix}`;

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || typeof IntersectionObserver === 'undefined') return undefined;

    let frame = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - (1 - t) ** 3; // ease-out cubic
          el.textContent = `${(value * eased).toFixed(decimals)}${suffix}`;
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [value, decimals, suffix, duration, reduced]);

  return (
    <span ref={ref} className="tabular-nums">
      {final}
    </span>
  );
}
