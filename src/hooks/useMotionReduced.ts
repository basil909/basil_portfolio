'use client';

import { useSyncExternalStore } from 'react';

const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';

function subscribeReduced(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

const getReduced = () => window.matchMedia(REDUCED_QUERY).matches;

const noopSubscribe = () => () => {};
const getLowPower = () => document.documentElement.dataset['perf'] === 'low';
const getFalse = () => false;

/** True while the OS asks for reduced motion (live: follows setting changes). */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribeReduced, getReduced, getFalse);
}

/** True when the document was flagged low-power by the head script in layout.tsx. */
export function useLowPower(): boolean {
  return useSyncExternalStore(noopSubscribe, getLowPower, getFalse);
}

/** Reduced motion OR a slow device/connection. */
export function useMotionReduced(): boolean {
  const reduced = usePrefersReducedMotion();
  const lowPower = useLowPower();
  return reduced || lowPower;
}
