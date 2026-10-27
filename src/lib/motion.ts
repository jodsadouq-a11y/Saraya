'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

let registered = false;
export function getGsap() {
  if (!registered && typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
    registered = true;
  }
  return { gsap, ScrollTrigger };
}

/** Media queries shared by every animated component. */
export const MQ = {
  motion: '(prefers-reduced-motion: no-preference)',
  reduce: '(prefers-reduced-motion: reduce)',
  desktop: '(min-width: 900px)',
  mobile: '(max-width: 899.98px)',
  finePointer: '(hover: hover) and (pointer: fine)',
} as const;

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia(MQ.reduce).matches;

export const hasFinePointer = () =>
  typeof window !== 'undefined' && window.matchMedia(MQ.finePointer).matches;

/**
 * Runs `fn` once the browser is idle (or after `timeout` ms), so heavy scene
 * setup never competes with first paint and hydration. Returns a canceller.
 */
export function whenIdle(fn: () => void, timeout = 1200): () => void {
  const w = window as Window & {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    cancelIdleCallback?: (id: number) => void;
  };
  if (w.requestIdleCallback) {
    const id = w.requestIdleCallback(fn, { timeout });
    return () => w.cancelIdleCallback?.(id);
  }
  const id = window.setTimeout(fn, 200);
  return () => window.clearTimeout(id);
}

/**
 * Sets up GSAP scenes for a component after idle time, with full cleanup.
 * `setup` receives the matchMedia instance; everything created in it is reverted on unmount.
 */
export function useDeferredScene(setup: (mm: gsap.MatchMedia) => void, deps: unknown[] = []) {
  useEffect(() => {
    const { gsap } = getGsap();
    const mm = gsap.matchMedia();
    const cancel = whenIdle(() => setup(mm));
    return () => {
      cancel();
      mm.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
