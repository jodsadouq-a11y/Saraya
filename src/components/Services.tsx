'use client';

import { useRef } from 'react';
import { services } from '@/content/site';
import { getGsap, MQ, useDeferredScene } from '@/lib/motion';
import Media from './Media';

export default function Services() {
  const root = useRef<HTMLElement>(null);

  useDeferredScene((mm) => {
    const { gsap } = getGsap();
    mm.add(MQ.motion, () => {
      gsap.utils.toArray<HTMLElement>('.service').forEach((panel, i) => {
        const media = panel.querySelector('.service__media');
        const card = panel.querySelector('.service__card');
        gsap.fromTo(
          media,
          { clipPath: i % 2 ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)' },
          { clipPath: 'inset(0 0% 0 0%)', ease: 'power3.inOut', duration: 1.4, scrollTrigger: { trigger: panel, start: 'top 75%', toggleActions: 'play none none reverse' } },
        );
        gsap.fromTo(panel.querySelector('.service__media .media'), { scale: 1.2 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: panel, start: 'top bottom', end: 'bottom top', scrub: true } });
        gsap.fromTo(card, { yPercent: 18 }, { yPercent: -12, ease: 'none', scrollTrigger: { trigger: panel, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
    }, root);
  });

  return (
    <section id="services" ref={root} className="section section--plum services" aria-labelledby="services-title">
      <div className="container">
        <header className="section-head" data-reveal>
          <p className="eyebrow eyebrow--gold">خدماتنا</p>
          <h2 id="services-title" className="section-title display">كل ما يجعل يومكم أقرب إلى الصورة التي تحلمون بها</h2>
        </header>

        <div className="services__list">
          {services.map((s, i) => (
            <article key={s.id} className={`service ${i % 2 ? 'service--flip' : ''}`}>
              <div className="service__media">
                <Media item={s.media} sizes="(min-width: 900px) 60vw, 100vw" />
              </div>
              <div className="service__card" data-reveal>
                <p className="service__num latin">{String(i + 1).padStart(2, '0')}</p>
                <p className="service__kicker">{s.kicker}</p>
                <h3 className="service__title display">{s.title}</h3>
                <p className="service__body">{s.body}</p>
                <a href="#booking" className="link-arrow">
                  استفسروا عن التفاصيل
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
