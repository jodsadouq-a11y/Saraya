'use client';

import { useEffect, useRef, useState } from 'react';
import { media, storyDetails, transformationFrames } from '@/content/site';
import { getGsap, MQ, useDeferredScene, whenIdle } from '@/lib/motion';
import Media from './Media';
import Lightbox from './Lightbox';

/* ─── Static geometry (deterministic, so server and client markup match) ─── */

const prng = (s: number) => () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;

const SKY = (() => {
  const r = prng(17);
  return Array.from({ length: 80 }, () => ({ x: r() * 1600, y: r() * 620, s: 0.5 + r() * 1.4, o: (0.15 + r() * 0.65).toFixed(2) }));
})();

// A crown-shaped constellation that grows out of the first star at (800, 245).
const STAR_ORIGIN = { x: 800, y: 245 };
const CONSTELLATION = [
  { x: 560, y: 300 }, { x: 640, y: 196 }, { x: 728, y: 262 }, { x: 800, y: 140 },
  { x: 872, y: 262 }, { x: 960, y: 196 }, { x: 1040, y: 300 }, { x: 800, y: 330 },
];
const C_LINES = `M560 300 L640 196 L728 262 L800 140 L872 262 L960 196 L1040 300 Q 800 352 560 300`;
const TRAIL = 'M800 140 C 1180 210 1240 470 960 540 S 740 600 800 700';

// Palace-inspired entrance silhouette rising from the bottom edge.
const PALACE = [
  'M300 900 L300 700 L360 700 L360 640 Q390 600 420 640 L420 700 L480 700 L480 900',
  'M1300 900 L1300 700 L1240 700 L1240 640 Q1210 600 1180 640 L1180 700 L1120 700 L1120 900',
  'M480 900 L480 720 L640 720 L640 600 Q800 430 960 600 L960 720 L1120 720 L1120 900',
  'M690 900 L690 690 Q800 560 910 690 L910 900',
  'M690 600 Q700 470 800 420 Q900 470 910 600',
  'M800 420 L800 386',
  'M520 900 L520 790 Q550 750 580 790 L580 900 M1020 900 L1020 790 Q1050 750 1080 790 L1080 900',
];

// Abstract gown: lines sweep up from the hem and gather at the waist.
const GOWN = Array.from({ length: 13 }, (_, i) => {
  const t = (i / 12) * 2 - 1;
  const hx = 500 + t * 400 * (0.75 + 0.25 * Math.abs(t));
  const hy = 975 - Math.abs(t) * 46;
  const sway = Math.sin(i * 1.7) * 26;
  return `M${hx.toFixed(1)} ${hy.toFixed(1)} C ${(500 + t * 300 + sway).toFixed(1)} 800 ${(500 + t * 70).toFixed(1)} 560 ${(500 + t * 16).toFixed(1)} 385`;
});
const BODICE = ['M484 385 C 478 340 486 300 500 282', 'M516 385 C 522 340 514 300 500 282', 'M478 386 Q500 396 522 386'];

const CHAPTERS = [
  { id: 'ch-wish', num: '01', title: 'أمنية تصبح حلمًا' },
  { id: 'ch-invite', num: '02', title: 'الدعوة الذهبية' },
  { id: 'ch-enter', num: '03', title: 'ادخلوا السرايا' },
  { id: 'ch-transform', num: '04', title: 'التحوّل' },
  { id: 'ch-dress', num: '05', title: 'فستان من ضوء' },
  { id: 'ch-details', num: '06', title: 'حكايتكم، ليلتكم' },
];

const STEPS = ['تُضاء الأنوار', 'تتوهّج الثريّات', 'تكتمل الطاولات', 'تبدأ الليلة'];

function ChapterHead({ n, label }: { n: number; label: string }) {
  const c = CHAPTERS[n];
  return (
    <p className="chapter__head">
      <span className="chapter__num">{c.num}</span>
      <span className="chapter__rule" aria-hidden="true" />
      <span className="chapter__label">
        {label} — {c.title}
      </span>
    </p>
  );
}

export default function Story() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(-1);
  const [step, setStep] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  // Chapter index (works with or without motion).
  useEffect(() => {
    const els = CHAPTERS.map((c) => document.getElementById(c.id)!);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const i = els.indexOf(e.target as HTMLElement);
          if (e.isIntersecting) setActive(i);
          else setActive((a) => (a === i && (i === 0 || i === els.length - 1) ? -1 : a));
        }
      },
      { rootMargin: '-50% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useDeferredScene((mm) => {
    const el = root.current;
    if (!el) return;
    const { gsap, ScrollTrigger } = getGsap();

    mm.add({ motion: MQ.motion, desktop: MQ.desktop }, (ctx) => {
      const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean };
      if (!motion) return;

      const scrub = desktop ? 0.8 : 0.5;
      const st = (id: string) => ({ trigger: `#${id}`, start: 'top top', end: 'bottom bottom', scrub });
      const scenes: Array<() => void> = [];
      let cleanupDetails: (() => void) | undefined;
      const draw = (sel: string | Element | Element[]) => {
        gsap.utils.toArray<SVGGeometryElement>(sel).forEach((p) => {
          const l = p.getTotalLength();
          gsap.set(p, { strokeDasharray: l, strokeDashoffset: l });
        });
      };

      /* 01 — A wish becomes a dream */
      scenes.push(() => {
        const q = gsap.utils.selector('#ch-wish');
        draw(q('.ch1__lines, .ch1__trail, .ch1__palace path'));
        const trail = el.querySelector<SVGPathElement>('.ch1__trail')!;
        const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: st('ch-wish') });
        tl.from(q('.ch1__first'), { scale: 0, opacity: 0, transformOrigin: '50% 50%', duration: 0.8, ease: 'back.out(2)' }, 0)
          .from(q('.ch1__text--a'), { opacity: 0, y: 30, duration: 0.8 }, 0.4)
          .from(q('.ch1__point'), {
            x: (i: number) => STAR_ORIGIN.x - CONSTELLATION[i].x,
            y: (i: number) => STAR_ORIGIN.y - CONSTELLATION[i].y,
            opacity: 0,
            stagger: 0.08,
            duration: 1.4,
            ease: 'power2.out',
          }, 0.6)
          .to(q('.ch1__first'), { opacity: 0, scale: 0.4, duration: 0.6 }, 1.4)
          .to(q('.ch1__lines'), { strokeDashoffset: 0, duration: 1.6 }, 1.6)
          .to(q('.ch1__text--a'), { opacity: 0, y: -30, duration: 0.6 }, 3)
          .from(q('.ch1__text--b'), { opacity: 0, y: 30, duration: 0.8 }, 3.5)
          .from(q('.ch1__traveler'), { opacity: 0, duration: 0.3 }, 3.8)
          .to(q('.ch1__traveler'), { motionPath: { path: trail, align: trail, alignOrigin: [0.5, 0.5] }, duration: 3, ease: 'power1.inOut' }, 3.8)
          .to(q('.ch1__trail'), { strokeDashoffset: 0, duration: 3, ease: 'power1.inOut' }, 3.8)
          .to(q('.ch1__constellation'), { opacity: 0.45, duration: 1.5 }, 4)
          .from(q('.ch1__palace'), { y: 140, opacity: 0, duration: 2.2, ease: 'power2.out' }, 4.6)
          .to(q('.ch1__palace path'), { strokeDashoffset: 0, stagger: 0.12, duration: 1.6 }, 4.8)
          .from(q('.ch1__door'), { opacity: 0, duration: 1 }, 6.4)
          .to({}, { duration: 0.8 });
      });

      /* 02 — The golden invitation (curtains) */
      scenes.push(() => {
        const q = gsap.utils.selector('#ch-invite');
        const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: st('ch-invite') });
        tl.to(q('.ch2__seam'), { opacity: 0, duration: 0.5 }, 0.6)
          .fromTo(q('.curtain--left'), { x: 0, xPercent: 0, scaleX: 1, skewY: 0 }, { x: 0, xPercent: -86, scaleX: 0.55, skewY: -1.2, duration: 3, ease: 'power2.inOut' }, 0.6)
          .fromTo(q('.curtain--right'), { x: 0, xPercent: 0, scaleX: 1, skewY: 0 }, { x: 0, xPercent: 86, scaleX: 0.55, skewY: 1.2, duration: 3, ease: 'power2.inOut' }, 0.6)
          .fromTo(q('.ch2__scene'), { scale: 1.2 }, { scale: 1, duration: 3.6, ease: 'power2.out' }, 0.6)
          .fromTo(q('.ch2__dark'), { opacity: 0.92 }, { opacity: 0.25, duration: 3 }, 0.8)
          .fromTo(q('.ch2__warm'), { opacity: 0 }, { opacity: 1, duration: 2.4 }, 1.6)
          .fromTo(q('.ch2__beam'), { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1.2, duration: 2.4 }, 1)
          .from(q('.ch2__title .line > span'), { yPercent: 110, opacity: 0, stagger: 0.25, duration: 1, ease: 'power3.out' }, 3)
          .to({}, { duration: 1 });
      });

      /* 03 — Enter the palace */
      scenes.push(() => {
        const q = gsap.utils.selector('#ch-enter');
        draw(q('.ch3__lines path'));
        const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: st('ch-enter') });
        tl.fromTo(q('.ch3__cam'), { scale: 1 }, { scale: desktop ? 1.5 : 1.35, duration: 10 }, 0)
          .to(q('.ch3__lines path'), { strokeDashoffset: 0, stagger: 0.25, duration: 2.4, ease: 'power2.inOut' }, 0.6)
          .to(q('.ch3__lines'), { opacity: 0, duration: 1.4 }, 5.4)
          .from(q('.ch3__label'), { opacity: 0, y: 14, stagger: 0.7, duration: 0.8, ease: 'power2.out' }, 2.2)
          .to(q('.ch3__label'), { opacity: 0, duration: 0.8 }, 6.2)
          .from(q('.ch3__copy > *'), { opacity: 0, y: 30, stagger: 0.3, duration: 1.2, ease: 'power2.out' }, 6.6)
          .fromTo(q('.ch3__vignette'), { opacity: 0.4 }, { opacity: 1, duration: 2 }, 6.2);
      });

      /* 04 — The transformation */
      scenes.push(() => {
        const q = gsap.utils.selector('#ch-transform');
        const frames = q('.ch4__frame');
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { ...st('ch-transform'), onUpdate: (s) => setStep(Math.min(STEPS.length, Math.floor(s.progress * (STEPS.length + 0.6)))) },
        });
        frames.slice(1).forEach((f, i) => tl.fromTo(f, { opacity: 0 }, { opacity: 1, duration: 4 / (frames.length - 1) }, 0.8 + i * (4 / (frames.length - 1))));
        tl.fromTo(q('.ch4__glow'), { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, stagger: 0.4, duration: 1.6, ease: 'power2.out' }, 1.8)
          .fromTo(q('.ch4__sweep'), { xPercent: 130 }, { xPercent: -130, duration: 2.4, ease: 'power1.inOut' }, 3.6)
          .fromTo(q('.ch4__dim'), { opacity: 0.75 }, { opacity: 0, duration: 4 }, 0.6)
          .from(q('.ch4__copy .line > span'), { yPercent: 110, opacity: 0, stagger: 0.3, duration: 1.2, ease: 'power3.out' }, 0.2)
          .to({}, { duration: 1 });
      });

      /* 05 — A dress made of light */
      scenes.push(() => {
        const q = gsap.utils.selector('#ch-dress');
        const paths = Array.from(el.querySelectorAll<SVGPathElement>('.ch5__gown path'));
        draw(paths);
        // Sample stars along every gown line; they appear as the lines dissolve.
        const svgNS = 'http://www.w3.org/2000/svg';
        const g = el.querySelector<SVGGElement>('.ch5__stars')!;
        g.replaceChildren();
        const r = prng(9);
        paths.forEach((p) => {
          const L = p.getTotalLength();
          for (let k = 1; k <= 10; k++) {
            const pt = p.getPointAtLength((L * k) / 11);
            const c = document.createElementNS(svgNS, 'circle');
            c.setAttribute('cx', pt.x.toFixed(1));
            c.setAttribute('cy', pt.y.toFixed(1));
            c.setAttribute('r', (c.dataset.r = (0.8 + r() * 2.2).toFixed(1)));
            g.appendChild(c);
          }
        });
        const stars = g.querySelectorAll('circle');
        const order = (i: number) => Math.abs(i - (GOWN.length - 1) / 2);
        const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: st('ch-dress') });
        tl.from(q('.ch5__title .line > span'), { yPercent: 110, opacity: 0, stagger: 0.3, duration: 1, ease: 'power3.out' }, 0.2)
          .to(q('.ch5__gown .gown-line'), { strokeDashoffset: 0, duration: 2.6, ease: 'power2.inOut', stagger: (i: number) => order(i) * 0.12 }, 0.4)
          .to(q('.ch5__gown .bodice'), { strokeDashoffset: 0, duration: 1.2 }, 2.4)
          .from(q('.ch5__spark'), { scale: 0, opacity: 0, transformOrigin: '50% 50%', duration: 0.8, ease: 'back.out(2)' }, 3.2)
          .to(q('.ch5__gown'), { opacity: 0, duration: 1.6 }, 4.4)
          // Attribute tweens only: no per-star bounding-box measurement.
          .fromTo(stars, { opacity: 0, attr: { r: 0 } }, { opacity: 1, attr: { r: (_: number, c: SVGCircleElement) => c.dataset.r! }, duration: 0.8, stagger: { each: 0.004, from: 'random' } }, 4.2)
          .to(stars, { attr: { cy: () => `-=${40 + r() * 160}`, cx: () => `+=${(r() - 0.5) * 80}` }, opacity: () => 0.2 + r() * 0.6, duration: 2.6, ease: 'power1.out' }, 5.2)
          .fromTo(q('.ch5__reveal'), { clipPath: 'circle(0% at 50% 62%)' }, { clipPath: 'circle(75% at 50% 50%)', duration: 2.6, ease: 'power2.inOut' }, 5.6)
          .fromTo(q('.ch5__reveal .media'), { scale: 1.25 }, { scale: 1, duration: 3, ease: 'power2.out' }, 5.6)
          .to({}, { duration: 0.8 });
      });

      /* 06 — Horizontal details (desktop) */
      if (desktop) scenes.push(() => {
        const wrap = el.querySelector<HTMLElement>('#ch-details')!;
        const track = wrap.querySelector<HTMLElement>('.ch6__track')!;
        wrap.classList.add('is-horizontal');
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 96);
        const setHeight = () => (wrap.style.height = `${distance() + window.innerHeight * 1.2}px`);
        setHeight();
        ScrollTrigger.addEventListener('refreshInit', setHeight);
        gsap.to(track, {
          x: () => distance(),
          ease: 'none',
          scrollTrigger: { trigger: wrap, start: 'top top', end: 'bottom bottom', scrub: 0.6, invalidateOnRefresh: true },
        });
        gsap.utils.toArray<HTMLElement>(track.querySelectorAll('.ch6__item img')).forEach((img) => {
          gsap.fromTo(img, { xPercent: 6 }, { xPercent: -6, ease: 'none', scrollTrigger: { trigger: wrap, start: 'top top', end: 'bottom bottom', scrub: true } });
        });
        cleanupDetails = () => {
          ScrollTrigger.removeEventListener('refreshInit', setHeight);
          wrap.classList.remove('is-horizontal');
          wrap.style.height = '';
        };
      });

      // Build one chapter per idle slot so no single task blocks the page.
      const cancels: Array<() => void> = [];
      const next = (i: number) => {
        if (i >= scenes.length) return void ScrollTrigger.refresh();
        cancels.push(whenIdle(() => {
          ctx.add(scenes[i]);
          next(i + 1);
        }, 800));
      };
      next(0);
      return () => {
        cancels.forEach((c) => c());
        cleanupDetails?.();
      };
    }, el);
  });

  return (
    <section id="story" ref={root} className="story" aria-label="حكاية سرايا شيرين">
      <a href="#halls" className="story__skip">
        تخطّي الحكاية إلى القاعات
      </a>

      <nav className={`story-index ${active >= 0 ? 'is-visible' : ''}`} aria-label="فصول الحكاية">
        <ol>
          {CHAPTERS.map((c, i) => (
            <li key={c.id} className={i === active ? 'is-active' : ''}>
              <a href={`#${c.id}`} aria-current={i === active ? 'step' : undefined}>
                <span className="story-index__num">{c.num}</span>
                <span className="story-index__title">{c.title}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* 01 ───────────────────────────────────────────── */}
      <div id="ch-wish" className="chapter ch1">
        <div className="chapter__stage">
          <svg className="ch1__sky" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <defs>
              <radialGradient id="ch1-star">
                <stop offset="0" stopColor="#FFF9F0" />
                <stop offset=".3" stopColor="#F6E4B2" stopOpacity=".8" />
                <stop offset="1" stopColor="#E8C36F" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="ch1-palace" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#280D2E" />
                <stop offset="1" stopColor="#180B20" />
              </linearGradient>
              <radialGradient id="ch1-door" cx=".5" cy=".8" r=".7">
                <stop offset="0" stopColor="#F6E4B2" stopOpacity=".9" />
                <stop offset="1" stopColor="#E8C36F" stopOpacity="0" />
              </radialGradient>
            </defs>
            <g className="ch1__dust">
              {SKY.map((s, i) => (
                <circle key={i} cx={s.x.toFixed(1)} cy={s.y.toFixed(1)} r={s.s.toFixed(2)} opacity={s.o} />
              ))}
            </g>
            <g className="ch1__constellation">
              <path className="ch1__lines" d={C_LINES} />
              {CONSTELLATION.map((p, i) => (
                <g key={i} className="ch1__point">
                  <circle cx={p.x} cy={p.y} r="16" fill="url(#ch1-star)" />
                  <circle cx={p.x} cy={p.y} r="2.6" className="ch1__core" />
                </g>
              ))}
            </g>
            <g className="ch1__first">
              <circle cx={STAR_ORIGIN.x} cy={STAR_ORIGIN.y} r="60" fill="url(#ch1-star)" />
              <path className="ch1__sparkle" d={`M${STAR_ORIGIN.x} ${STAR_ORIGIN.y - 26} L${STAR_ORIGIN.x + 5} ${STAR_ORIGIN.y - 5} L${STAR_ORIGIN.x + 26} ${STAR_ORIGIN.y} L${STAR_ORIGIN.x + 5} ${STAR_ORIGIN.y + 5} L${STAR_ORIGIN.x} ${STAR_ORIGIN.y + 26} L${STAR_ORIGIN.x - 5} ${STAR_ORIGIN.y + 5} L${STAR_ORIGIN.x - 26} ${STAR_ORIGIN.y} L${STAR_ORIGIN.x - 5} ${STAR_ORIGIN.y - 5} Z`} />
            </g>
            <path className="ch1__trail" d={TRAIL} />
            <g className="ch1__palace">
              <rect className="ch1__door" x="690" y="600" width="220" height="300" fill="url(#ch1-door)" />
              {PALACE.map((d, i) => (
                <path key={i} d={d} />
              ))}
              <circle className="ch1__finial" cx="800" cy="380" r="5" />
            </g>
            <g className="ch1__traveler" transform="translate(800 700)">
              <circle r="34" fill="url(#ch1-star)" />
              <path className="ch1__sparkle" d="M0 -16 L3 -3 L16 0 L3 3 L0 16 L-3 3 L-16 0 L-3 -3 Z" />
            </g>
          </svg>
          <div className="chapter__copy ch1__copy">
            <ChapterHead n={0} label="الفصل الأول" />
            <div className="ch1__texts">
              <h2 className="ch1__text ch1__text--a display">كل حكاية جميلة تبدأ بحلم…</h2>
              <p className="ch1__text ch1__text--b">وحين يأتي اليوم المنتظر، تستحق أن يبدأ بطريقة مختلفة.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 02 ───────────────────────────────────────────── */}
      <div id="ch-invite" className="chapter ch2">
        <div className="chapter__stage">
          <div className="ch2__scene">
            <Media item={media.hallLit} sizes="100vw" />
          </div>
          <div className="ch2__dark" aria-hidden="true" />
          <div className="ch2__warm" aria-hidden="true" />
          <div className="ch2__beam" aria-hidden="true" />
          <div className="curtain curtain--left" aria-hidden="true" />
          <div className="curtain curtain--right" aria-hidden="true" />
          <svg className="ch2__valance" viewBox="0 0 1600 120" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="valance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#2a0a30" />
                <stop offset="1" stopColor="#5e1f66" />
              </linearGradient>
            </defs>
            <path d="M0 0 H1600 V40 Q1500 110 1400 50 Q1300 110 1200 50 Q1100 110 1000 50 Q900 110 800 50 Q700 110 600 50 Q500 110 400 50 Q300 110 200 50 Q100 110 0 50 Z" fill="url(#valance)" />
            <path d="M0 50 Q100 110 200 50 Q300 110 400 50 Q500 110 600 50 Q700 110 800 50 Q900 110 1000 50 Q1100 110 1200 50 Q1300 110 1400 50 Q1500 110 1600 40" fill="none" stroke="#E8C36F" strokeWidth="3" vectorEffect="non-scaling-stroke" />
          </svg>
          <div className="ch2__seam">
            <ChapterHead n={1} label="الفصل الثاني" />
          </div>
          <h2 className="ch2__title display">
            <span className="line"><span>من أول نظرة…</span></span>{' '}
            <span className="line"><span>تبدأ الحكاية.</span></span>
          </h2>
        </div>
      </div>

      {/* 03 ───────────────────────────────────────────── */}
      <div id="ch-enter" className="chapter ch3">
        <div className="chapter__stage">
          <div className="ch3__cam">
            <Media item={media.storyHall} sizes="100vw" />
            <svg className="ch3__lines" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <path d="M600 560 L600 330 Q800 160 1000 330 L1000 560" />
              <path d="M560 600 L560 300 Q800 110 1040 300 L1040 600" />
              <path d="M0 900 L560 560" />
              <path d="M1600 900 L1040 560" />
              <path d="M0 0 L560 230" />
              <path d="M1600 0 L1040 230" />
            </svg>
            <ul className="ch3__labels">
              <li className="ch3__label" style={{ insetInlineStart: '50%', top: '18%' }}>إضاءة تصنع الأجواء</li>
              <li className="ch3__label" style={{ insetInlineStart: '64%', top: '64%' }}>تفاصيل تكمّل الجمال</li>
              <li className="ch3__label" style={{ insetInlineStart: '36%', top: '44%' }}>مساحة تحتضن فرحتكم</li>
            </ul>
          </div>
          <div className="ch3__vignette" aria-hidden="true" />
          <div className="chapter__copy ch3__copy">
            <ChapterHead n={2} label="الفصل الثالث" />
            <h2 className="display">المكان ليس مجرد قاعة… بل بداية لذكرى ستبقى معكم.</h2>
          </div>
        </div>
      </div>

      {/* 04 ───────────────────────────────────────────── */}
      <div id="ch-transform" className="chapter ch4">
        <div className="chapter__stage">
          <div className="ch4__frames">
            {transformationFrames.map((f) => (
              <div key={f.id} className="ch4__frame">
                <Media item={f} sizes="100vw" />
              </div>
            ))}
          </div>
          <div className="ch4__dim" aria-hidden="true" />
          <div className="ch4__glows" aria-hidden="true">
            <span className="ch4__glow" style={{ left: '50%', top: '8%' }} />
            <span className="ch4__glow" style={{ left: '24%', top: '10%' }} />
            <span className="ch4__glow" style={{ left: '76%', top: '10%' }} />
          </div>
          <div className="ch4__sweep" aria-hidden="true" />
          <div className="chapter__copy ch4__copy">
            <ChapterHead n={3} label="الفصل الرابع" />
            <h2 className="display">
              <span className="line"><span>من مساحة جميلة…</span></span>{' '}
              <span className="line"><span>إلى ليلة لا تُنسى.</span></span>
            </h2>
            <ol className="ch4__steps" aria-label="مراحل التحوّل">
              {STEPS.map((s, i) => (
                <li key={s} className={i < step ? 'is-on' : ''}>
                  {s}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* 05 ───────────────────────────────────────────── */}
      <div id="ch-dress" className="chapter ch5">
        <div className="chapter__stage">
          <div className="ch5__reveal">
            <Media item={media.stage} sizes="100vw" />
            <div className="ch5__shade" aria-hidden="true" />
          </div>
          <svg className="ch5__art" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
            <defs>
              <linearGradient id="gown-grad" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0" stopColor="#F6E4B2" />
                <stop offset="1" stopColor="#E8C36F" />
              </linearGradient>
            </defs>
            <g className="ch5__gown">
              {GOWN.map((d, i) => (
                <path key={i} className="gown-line" d={d} />
              ))}
              {BODICE.map((d, i) => (
                <path key={i} className="bodice" d={d} />
              ))}
            </g>
            <path className="ch5__spark" d="M500 236 L506 256 L526 262 L506 268 L500 288 L494 268 L474 262 L494 256 Z" />
            <g className="ch5__stars" />
          </svg>
          <div className="chapter__copy ch5__copy">
            <ChapterHead n={4} label="الفصل الخامس" />
            <h2 className="ch5__title display">
              <span className="line"><span>لأن التفاصيل الصغيرة…</span></span>{' '}
              <span className="line"><span>تصنع الفرق الكبير.</span></span>
            </h2>
          </div>
        </div>
      </div>

      {/* 06 ───────────────────────────────────────────── */}
      <div id="ch-details" className="chapter ch6">
        <div className="chapter__stage ch6__stage">
          <div className="ch6__head">
            <ChapterHead n={5} label="الفصل السادس" />
            <h2 className="display">لكل فرحة تفاصيلها… ولكل حكاية طابعها الخاص.</h2>
          </div>
          <ul className="ch6__track">
            {storyDetails.map((item, i) => (
              <li key={item.id} className={`ch6__item ch6__item--${item.shape ?? 'tall'}`}>
                <button type="button" onClick={() => setLightbox(i)} data-cursor="استكشف" aria-label={`عرض الصورة: ${item.alt}`}>
                  <Media item={item} sizes="(min-width: 900px) 40vw, 50vw" />
                </button>
                <p className="ch6__caption">
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  {item.caption}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Lightbox items={storyDetails} index={lightbox} onClose={() => setLightbox(null)} onIndex={setLightbox} label="تفاصيل الحكاية" />
    </section>
  );
}
