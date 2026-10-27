'use client';

import { useEffect } from 'react';
import { getGsap, hasFinePointer, prefersReducedMotion } from '@/lib/motion';

/**
 * Global, lightweight motion wiring:
 *  - [data-reveal] elements fade/rise in once via IntersectionObserver
 *  - [data-magnetic] buttons follow the pointer slightly (fine pointers only)
 *  - ScrollTrigger recalculates after fonts, images and orientation changes
 */
export default function MotionRoot() {
  useEffect(() => {
    const { gsap, ScrollTrigger } = getGsap();
    const root = document.documentElement;
    root.classList.add('js-ready');

    // Reveal on enter
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
    );
    const observeAll = () => document.querySelectorAll('[data-reveal]:not(.is-in)').forEach((el) => io.observe(el));
    observeAll();

    // Magnetic buttons
    const cleanups: Array<() => void> = [];
    if (hasFinePointer() && !prefersReducedMotion()) {
      document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
        const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
        const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          xTo((e.clientX - (r.left + r.width / 2)) * 0.22);
          yTo((e.clientY - (r.top + r.height / 2)) * 0.32);
        };
        const leave = () => {
          gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.45)' });
        };
        el.addEventListener('pointermove', move);
        el.addEventListener('pointerleave', leave);
        cleanups.push(() => {
          el.removeEventListener('pointermove', move);
          el.removeEventListener('pointerleave', leave);
        });
      });
    }

    // Keep scroll-linked scenes accurate as layout settles.
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh).catch(() => {});
    window.addEventListener('load', refresh);
    window.addEventListener('orientationchange', refresh);

    return () => {
      io.disconnect();
      cleanups.forEach((c) => c());
      window.removeEventListener('load', refresh);
      window.removeEventListener('orientationchange', refresh);
    };
  }, []);
  return null;
}
