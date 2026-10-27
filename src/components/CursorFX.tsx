'use client';

import { useEffect, useRef } from 'react';
import { MQ } from '@/lib/motion';

/**
 * A soft gold ring that trails the native cursor on desktop (the native cursor
 * stays visible). Over [data-cursor] elements it grows and shows a label.
 * Disabled for touch devices and reduced-motion preferences.
 */
export default function CursorFX() {
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia(MQ.finePointer).matches || !window.matchMedia(MQ.motion).matches) return;
    const el = ring.current!;
    document.documentElement.classList.add('has-cursor');
    let x = -100, y = -100, cx = -100, cy = -100, raf = 0, visible = false;

    const tick = () => {
      cx += (x - cx) * 0.2;
      cy += (y - cy) * 0.2;
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = Math.abs(x - cx) + Math.abs(y - cy) > 0.1 ? requestAnimationFrame(tick) : 0;
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      x = e.clientX;
      y = e.clientY;
      if (!visible) {
        visible = true;
        cx = x;
        cy = y;
        el.classList.add('is-visible');
      }
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const over = (e: Event) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>('[data-cursor], a, button, [role="button"], input, select, textarea');
      const text = t?.dataset.cursor ?? '';
      el.classList.toggle('is-hover', !!t);
      el.classList.toggle('is-label', !!text);
      if (label.current) label.current.textContent = text;
    };
    const leave = () => {
      visible = false;
      el.classList.remove('is-visible');
    };
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over);
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      document.documentElement.removeEventListener('pointerleave', leave);
      document.documentElement.classList.remove('has-cursor');
    };
  }, []);

  return (
    <div ref={ring} className="cursor" aria-hidden="true">
      <span ref={label} className="cursor__label" />
    </div>
  );
}
