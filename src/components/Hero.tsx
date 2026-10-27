'use client';

import { useEffect, useState } from 'react';
import { brand, media } from '@/content/site';
import { getGsap, MQ, useDeferredScene } from '@/lib/motion';
import Media from './Media';
import AnimatedLogo from './AnimatedLogo';
import Particles from './Particles';

export default function Hero() {
  const [introDone, setIntroDone] = useState(false);
  const [skipped, setSkipped] = useState(false);

  // The intro itself is pure CSS (it starts with first paint, not after hydration).
  useEffect(() => {
    if (!window.matchMedia(MQ.motion).matches) return setIntroDone(true);
    const t = window.setTimeout(() => setIntroDone(true), 2600);
    const skip = () => setSkipped(true);
    window.addEventListener('wheel', skip, { passive: true, once: true });
    window.addEventListener('touchmove', skip, { passive: true, once: true });
    window.addEventListener('keydown', skip, { once: true });
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('wheel', skip);
      window.removeEventListener('touchmove', skip);
      window.removeEventListener('keydown', skip);
    };
  }, []);

  // Leaving the hero: the composition drifts back and fades a touch.
  useDeferredScene((mm) => {
    const { gsap } = getGsap();
    mm.add(MQ.motion, () => {
      const st = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
      gsap.to('.hero__inner', { yPercent: -12, opacity: 0.2, ease: 'none', scrollTrigger: st });
      gsap.to('.hero__bg', { yPercent: 10, ease: 'none', scrollTrigger: st });
    });
  });

  // Cursor-following golden glow (desktop only).
  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--gx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--gy', `${e.clientY - r.top}px`);
  };

  const dots = Array.from({ length: 24 }, (_, i) => {
    const a = (i / 24) * Math.PI * 2;
    return { cx: 160 + Math.cos(a) * 148, cy: 160 + Math.sin(a) * 148, r: i % 6 === 0 ? 2.4 : 1.1 };
  });

  return (
    <section id="top" className={`hero ${skipped || introDone ? 'intro-done' : ''} ${skipped ? 'intro-skip' : ''}`} onPointerMove={onPointerMove} aria-labelledby="hero-title">
      <div className="hero__bg">
        <Media item={media.heroHall} priority className="hero__media" />
      </div>
      <div className="hero__veil" aria-hidden="true" />
      <Particles className="hero__particles" density={1} max={150} />
      <div className="hero__glow" aria-hidden="true" />

      <div className="hero__inner">
        <div className="hero__mark">
          <svg className="hero__ring" viewBox="0 0 320 320" aria-hidden="true">
            <circle className="hero__ring-line" cx="160" cy="160" r="148" pathLength={1} />
            <circle className="hero__ring-inner" cx="160" cy="160" r="136" />
            <g className="hero__ring-dots">
              {dots.map((d, i) => (
                <circle key={i} cx={d.cx} cy={d.cy} r={d.r} />
              ))}
            </g>
          </svg>
          <div className="hero__logo">
            <AnimatedLogo size={240} tilt />
          </div>
        </div>

        <div className="hero__wordmark" aria-hidden="true">
          <span className="hero__wordmark-ar">{brand.nameAr}</span>
          <span className="hero__wordmark-en">{brand.nameEn}</span>
        </div>

        <h1 id="hero-title" className="hero__title">
          <span className="sr-only">{brand.nameAr} — قاعات أفراح في {brand.city}: </span>
          <span className="line"><span>ليلتكِ…</span></span>{' '}
          <span className="line"><span>تستحق أن تكون استثنائية</span></span>
        </h1>
        <p className="hero__lead">اكتشفي سرايا شيرين، حيث تتحوّل اللحظات الجميلة إلى ذكريات لا تُنسى.</p>
        <div className="hero__ctas">
          <a href="#story" className="btn btn--gold" data-magnetic>
            اكتشفي الحكاية
          </a>
          <a href="#booking" className="btn btn--ghost" data-magnetic>
            احجزي زيارة
          </a>
        </div>
      </div>

      {!introDone && !skipped && (
        <button type="button" className="hero__skip" onClick={() => setSkipped(true)}>
          تخطّي المقدّمة
        </button>
      )}

      <a href="#story" className="hero__scroll" aria-label="انتقلي إلى الحكاية">
        <span>مرّري للأسفل</span>
        <i aria-hidden="true" />
      </a>
    </section>
  );
}
