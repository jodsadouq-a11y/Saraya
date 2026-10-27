'use client';

import { useRef } from 'react';
import { brand, contact, whatsappLink } from '@/content/site';
import { getGsap, MQ, useDeferredScene } from '@/lib/motion';
import Emblem from './Emblem';

const prng = (s: number) => () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
const STARS = (() => {
  const r = prng(29);
  return Array.from({ length: 40 }, (_, i) => {
    const a = (i / 40) * Math.PI * 2 - Math.PI / 2;
    return {
      x: 300 + Math.cos(a) * 214,
      y: 300 + Math.sin(a) * 214,
      fx: -200 + r() * 1000,
      fy: -160 + r() * 920,
      r: i % 5 === 0 ? 3 : 1.4 + r() * 0.8,
    };
  });
})();

export default function Footer() {
  const root = useRef<HTMLElement>(null);

  useDeferredScene((mm) => {
    const { gsap } = getGsap();
    mm.add(MQ.motion, () => {
      const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'center center', scrub: 1 } });
      tl.from('.finale__star', {
        attr: { cx: (i: number) => STARS[i].fx, cy: (i: number) => STARS[i].fy },
        opacity: 0.2,
        duration: 3,
        ease: 'power2.out',
        stagger: { each: 0.01, from: 'random' },
      }, 0)
        .from('.finale__ring', { opacity: 0, scale: 0.9, transformOrigin: '50% 50%', duration: 1 }, 2.4)
        .from('.finale__logo', { opacity: 0, scale: 0.8, duration: 1 }, 2.6)
        .from('.finale__line', { opacity: 0, y: 24, stagger: 0.5, duration: 1 }, 2.8);
    }, root);
  });

  const year = new Date().getFullYear();

  return (
    <footer ref={root} className="finale" aria-labelledby="finale-title">
      <div className="finale__scene">
        <div className="finale__mark">
          <svg className="finale__orbit" viewBox="0 0 600 600" aria-hidden="true">
            <defs>
              <path id="finale-orbit" d="M300 300 m -258 0 a 258 258 0 1 1 516 0 a 258 258 0 1 1 -516 0" />
            </defs>
            <text direction="ltr">
              <textPath href="#finale-orbit">
                {'SARAYA SHEREEN · TULKARM · PALESTINE · '.repeat(4)}
              </textPath>
            </text>
          </svg>
          <svg className="finale__sky" viewBox="0 0 600 600" aria-hidden="true">
            <circle className="finale__ring" cx="300" cy="300" r="214" />
            {STARS.map((s, i) => (
              <circle key={i} className="finale__star" cx={s.x.toFixed(1)} cy={s.y.toFixed(1)} r={s.r.toFixed(1)} />
            ))}
          </svg>
          <div className="finale__logo">
            <Emblem size={180} />
          </div>
        </div>

        <h2 id="finale-title" className="finale__text display">
          <span className="finale__line">بعض الأماكن تستضيف مناسباتكم…</span>
          <span className="finale__line">وسرايا شيرين تمنح حكاياتكم مساحة لتُروى.</span>
        </h2>

        <div className="finale__line finale__ctas">
          <a href="#booking" className="btn btn--gold btn--lg" data-magnetic>
            لنبدأ حكايتكم
          </a>
          <nav className="finale__links" aria-label="روابط سريعة">
            <a href="#booking">تواصلوا معنا</a>
            <a href="#halls">استكشفوا القاعات</a>
            <a href={contact.facebook} target="_blank" rel="noopener noreferrer">
              تابعونا على فيسبوك
            </a>
          </nav>
        </div>
      </div>

      <div className="finale__bar">
        <div className="container finale__bar-inner">
          <address className="finale__contact">
            <span>
              {brand.city}، {brand.country}
              {contact.address ? ` — ${contact.address}` : ''}
            </span>
            {contact.mapUrl && (
              <a href={contact.mapUrl} target="_blank" rel="noopener noreferrer">
                الاتجاهات على الخريطة
              </a>
            )}
            <a href={contact.phoneHref} dir="ltr">{contact.phoneDisplay}</a>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">واتساب</a>
            <a href={`mailto:${contact.email}`} dir="ltr">{contact.email}</a>
            <a href={contact.website} dir="ltr">sarayashereen.com</a>
          </address>
          <p className="finale__copy">
            © {year} {brand.nameAr} · <span className="latin">{brand.nameEn}</span>. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}
