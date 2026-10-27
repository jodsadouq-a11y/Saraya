'use client';

import { useRef } from 'react';
import { media } from '@/content/site';
import { getGsap, MQ, useDeferredScene } from '@/lib/motion';
import Media from './Media';

const LINES = [
  'بعد سنوات… قد تنسون بعض التفاصيل.',
  'لكنكم ستتذكرون دائمًا كيف شعرتم في تلك الليلة.',
  'دعوا البداية تكون في المكان المناسب.',
];

export default function Pause() {
  const root = useRef<HTMLElement>(null);

  useDeferredScene((mm) => {
    const { gsap } = getGsap();
    mm.add(MQ.motion, () => {
      const line = root.current!.querySelector<SVGPathElement>('.pause__line path')!;
      const len = line.getTotalLength();
      const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 1 } });
      tl.fromTo('.pause__bg .media', { scale: 1.15 }, { scale: 1, duration: 10 }, 0)
        .fromTo(line, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 9 }, 0.5);
      gsap.utils.toArray<HTMLElement>('.pause__text p').forEach((p, i) => {
        tl.fromTo(p, { opacity: 0, y: 24, filter: 'blur(6px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.4, ease: 'power2.out' }, 0.8 + i * 3);
        if (i < LINES.length - 1) tl.to(p, { opacity: 0.28, duration: 1 }, 0.8 + (i + 1) * 3 - 0.4);
      });
    }, root);
  });

  return (
    <section ref={root} className="pause" aria-label="لحظة">
      <div className="pause__stage">
        <div className="pause__bg">
          <Media item={media.pause} sizes="100vw" badge={false} />
        </div>
        <div className="pause__veil" aria-hidden="true" />
        <svg className="pause__line" viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden="true">
          <path d="M-20 620 C 300 520 520 700 820 600 S 1300 460 1620 560" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="pause__text">
          {LINES.map((l) => (
            <p key={l} className="display">
              {l}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
