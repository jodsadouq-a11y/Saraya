'use client';

import { useEffect, useRef } from 'react';
import { MQ, whenIdle } from '@/lib/motion';

interface Props {
  /** Particles per 10,000 px² of canvas (capped). */
  density?: number;
  max?: number;
  className?: string;
}

interface P { x: number; y: number; z: number; r: number; vy: number; vx: number; tw: number; ts: number }

/**
 * Lightweight 2D-canvas star dust with depth parallax. Pauses when off-screen
 * or the tab is hidden; draws a single still frame for reduced motion.
 */
export default function Particles({ density = 0.9, max = 140, className = '' }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduce = window.matchMedia(MQ.reduce).matches;
    const mobile = window.matchMedia(MQ.mobile).matches;
    const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.5);
    let w = 0, h = 0, parts: P[] = [], raf = 0, running = false, mx = 0, my = 0, pmx = 0, pmy = 0;

    const seed = () => {
      const n = Math.min(max * (mobile ? 0.5 : 1), Math.round(((w * h) / 10000) * density * (mobile ? 0.6 : 1)));
      parts = Array.from({ length: n }, () => {
        const z = 0.25 + Math.random() * 0.75;
        return { x: Math.random() * w, y: Math.random() * h, z, r: 0.4 + z * 1.6, vy: -(0.04 + z * 0.18), vx: (Math.random() - 0.5) * 0.06, tw: Math.random() * Math.PI * 2, ts: 0.006 + Math.random() * 0.02 };
      });
    };
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      if (!running) draw(false);
    };
    const draw = (step: boolean) => {
      ctx.clearRect(0, 0, w, h);
      pmx += (mx - pmx) * 0.05;
      pmy += (my - pmy) * 0.05;
      for (const p of parts) {
        if (step) {
          p.y += p.vy;
          p.x += p.vx;
          p.tw += p.ts;
          if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
          if (p.x < -10) p.x = w + 10; else if (p.x > w + 10) p.x = -10;
        }
        const a = (0.35 + 0.65 * Math.abs(Math.sin(p.tw))) * p.z;
        const px = p.x + pmx * p.z * 18;
        const py = p.y + pmy * p.z * 18;
        ctx.globalAlpha = a;
        ctx.fillStyle = p.z > 0.8 ? '#FFF9F0' : '#F6E4B2';
        ctx.beginPath();
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fill();
        if (p.z > 0.85) {
          ctx.globalAlpha = a * 0.18;
          ctx.fillStyle = '#E8C36F';
          ctx.beginPath();
          ctx.arc(px, py, p.r * 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };
    // ~30fps on phones to save battery; full rate on desktop.
    let frame = 0;
    const loop = () => {
      if (!mobile || (frame++ & 1) === 0) draw(true);
      raf = requestAnimationFrame(loop);
    };
    let ready = false;
    const start = () => {
      if (!ready || running || reduce || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    let inView = true;
    const io = new IntersectionObserver(([e]) => ((inView = e.isIntersecting) ? start() : stop()));
    io.observe(canvas);
    // Animate only once the page has settled; the first frame is drawn immediately.
    const cancelIdle = whenIdle(() => {
      ready = true;
      if (inView) start();
    }, 2000);
    const vis = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', vis);
    const pm = (e: PointerEvent) => {
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
    };
    if (!mobile) window.addEventListener('pointermove', pm, { passive: true });

    return () => {
      stop();
      cancelIdle();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', vis);
      window.removeEventListener('pointermove', pm);
    };
  }, [density, max]);

  return <canvas ref={ref} className={`particles ${className}`} aria-hidden="true" />;
}
