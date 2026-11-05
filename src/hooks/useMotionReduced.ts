'use client';

import { useSyncExternalStore } from 'react';
import { useReducedMotion } from 'framer-motion';

const noopSubscribe = () => () => {};
const getSnapshot = () => document.documentElement.dataset['perf'] === 'low';
const getServerSnapshot = () => false;

/** True when the document was flagged low-power by the head script in layout.tsx. */
export function useLowPower(): boolean {
  return useSyncExternalStore(noopSubscribe, getSnapshot, getServerSnapshot);
}

/** Drop-in for `useReducedMotion()`: also true on slow devices and connections. */
export function useMotionReduced(): boolean {
  const reduced = useReducedMotion() ?? false;
  const lowPower = useLowPower();
  return reduced || lowPower;
}
