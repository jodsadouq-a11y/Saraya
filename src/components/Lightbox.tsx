'use client';

import { useEffect, useRef } from 'react';
import type { MediaItem } from '@/content/site';
import Media from './Media';

interface Props {
  items: MediaItem[];
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
  label?: string;
}

/** Full-screen viewer: keyboard (Esc, arrows), swipe, focus trap, focus restore. */
export default function Lightbox({ items, index, onClose, onIndex, label = 'معرض الصور' }: Props) {
  const dialog = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const open = index !== null;
  const n = items.length;
  const next = () => index !== null && onIndex((index + 1) % n);
  const prev = () => index !== null && onIndex((index - 1 + n) % n);

  useEffect(() => {
    if (!open) return;
    opener.current = document.activeElement as HTMLElement;
    document.documentElement.classList.add('lightbox-open');
    dialog.current?.querySelector<HTMLElement>('.lightbox__close')?.focus();
    return () => {
      document.documentElement.classList.remove('lightbox-open');
      opener.current?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      // RTL: the next image lies to the left.
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') next();
      else if (e.key === 'ArrowRight') prev();
      else if (e.key === 'Tab') {
        const f = dialog.current!.querySelectorAll<HTMLElement>('button');
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!open || index === null) return null;
  const item = items[index];

  return (
    <div
      ref={dialog}
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={label}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onTouchStart={(e) => (touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY })}
      onTouchEnd={(e) => {
        if (!touch.current) return;
        const dx = e.changedTouches[0].clientX - touch.current.x;
        const dy = e.changedTouches[0].clientY - touch.current.y;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) (dx > 0 ? next : prev)();
        touch.current = null;
      }}
    >
      <figure className="lightbox__figure" key={item.id}>
        <Media item={item} className="lightbox__media" sizes="90vw" />
        <figcaption>
          <span className="lightbox__count">
            {index + 1} / {n}
          </span>
          {item.caption && <span className="lightbox__caption">{item.caption}</span>}
          <span className="lightbox__alt">{item.alt}</span>
        </figcaption>
      </figure>
      <button type="button" className="lightbox__close" onClick={onClose} aria-label="إغلاق">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" /></svg>
      </button>
      {n > 1 && (
        <>
          <button type="button" className="lightbox__nav lightbox__nav--prev" onClick={prev} aria-label="الصورة السابقة">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
          </button>
          <button type="button" className="lightbox__nav lightbox__nav--next" onClick={next} aria-label="الصورة التالية">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
          </button>
        </>
      )}
    </div>
  );
}
