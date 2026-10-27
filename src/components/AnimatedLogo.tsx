'use client';

import { brand } from '@/content/site';
import Emblem from './Emblem';

// Twinkles placed over the gown, crown and edge of the official logo (percent of the disc).
const SPARKLES = [
  { x: 56, y: 15, s: 1, d: 0 },
  { x: 33, y: 70, s: 0.8, d: 0.9 },
  { x: 47, y: 80, s: 1.1, d: 1.7 },
  { x: 64, y: 72, s: 0.9, d: 0.4 },
  { x: 72, y: 84, s: 0.7, d: 2.3 },
  { x: 52, y: 60, s: 0.8, d: 1.3 },
  { x: 24, y: 40, s: 0.6, d: 2.8 },
  { x: 80, y: 34, s: 0.7, d: 2 },
];

interface Props {
  size?: number;
  className?: string;
  /** Compact version for small placements (header): shimmer only. */
  compact?: boolean;
  /** Follow the pointer with a gentle 3D tilt (desktop). */
  tilt?: boolean;
}

/**
 * The official logo, brought to life: a breathing golden halo, an orbiting
 * star on a turning ring, a gold shimmer that sweeps across the disc,
 * twinkling stars on the gown, a slow float and an optional pointer tilt.
 * All motion is transform/opacity only and stops for reduced-motion visitors.
 */
export default function AnimatedLogo({ size = 200, className = '', compact = false, tilt = false }: Props) {
  const onMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (!tilt || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    e.currentTarget.style.setProperty('--rx', `${(-y * 16).toFixed(2)}deg`);
    e.currentTarget.style.setProperty('--ry', `${(x * 16).toFixed(2)}deg`);
  };
  const onLeave = (e: React.PointerEvent<HTMLSpanElement>) => {
    e.currentTarget.style.setProperty('--rx', '0deg');
    e.currentTarget.style.setProperty('--ry', '0deg');
  };

  return (
    <span
      className={`alogo ${compact ? 'alogo--compact' : ''} ${className}`}
      onPointerMove={tilt ? onMove : undefined}
      onPointerLeave={tilt ? onLeave : undefined}
    >
      {!compact && (
        <>
          <span className="alogo__halo" aria-hidden="true" />
          <svg className="alogo__orbit" viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="49" />
          </svg>
          <span className="alogo__satellite" aria-hidden="true">
            <i />
          </span>
        </>
      )}
      <span className="alogo__tilt">
        <span className="alogo__float">
          <span className="alogo__disc">
            <Emblem size={size} title={`شعار ${brand.nameAr}`} />
            <span className="alogo__shine" aria-hidden="true" />
            {!compact && (
              <span className="alogo__sparkles" aria-hidden="true">
                {SPARKLES.map((p, i) => (
                  <i key={i} style={{ left: `${p.x}%`, top: `${p.y}%`, ['--s' as string]: p.s, animationDelay: `${p.d}s` }} />
                ))}
              </span>
            )}
          </span>
        </span>
      </span>
    </span>
  );
}
