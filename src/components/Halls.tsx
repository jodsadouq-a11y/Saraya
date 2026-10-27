'use client';

import { useRef, useState } from 'react';
import { halls } from '@/content/site';
import { getGsap, MQ, useDeferredScene } from '@/lib/motion';
import Media from './Media';
import Lightbox from './Lightbox';

import { INQUIRE_EVENT } from '@/lib/events';

export default function Halls() {
  const root = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const hall = halls[current];

  useDeferredScene((mm) => {
    const { gsap } = getGsap();
    mm.add(MQ.motion, () => {
      gsap.fromTo(
        '.hall__media .media',
        { scale: 1.14, yPercent: -3 },
        { scale: 1, yPercent: 3, ease: 'none', scrollTrigger: { trigger: '.hall', start: 'top bottom', end: 'bottom top', scrub: true } },
      );
      gsap.fromTo('.hall__frame', { clipPath: 'inset(12% 8% 12% 8%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'power2.out', scrollTrigger: { trigger: '.hall', start: 'top 85%', end: 'top 30%', scrub: true } });
    }, root);
  }, [current]);

  const inquire = () => {
    window.dispatchEvent(new CustomEvent(INQUIRE_EVENT, { detail: { hall: hall.name } }));
    dialog.current?.close();
    document.getElementById('booking')?.scrollIntoView({ behavior: window.matchMedia(MQ.reduce).matches ? 'auto' : 'smooth' });
  };

  return (
    <section id="halls" ref={root} className="section section--ivory halls" aria-labelledby="halls-title">
      <div className="container">
        <header className="section-head" data-reveal>
          <p className="eyebrow">القاعات</p>
          <h2 id="halls-title" className="section-title display">اكتشفي مساحات الفرح في سرايا شيرين</h2>
        </header>

        {halls.length > 1 && (
          <div className="hall-tabs" role="tablist" aria-label="اختاري القاعة">
            {halls.map((h, i) => (
              <button
                key={h.id}
                role="tab"
                id={`hall-tab-${h.id}`}
                aria-selected={i === current}
                aria-controls={`hall-panel-${h.id}`}
                className="hall-tabs__tab"
                onClick={() => setCurrent(i)}
              >
                <span>{String(i + 1).padStart(2, '0')}</span>
                {h.name}
              </button>
            ))}
          </div>
        )}

        <article
          className="hall"
          key={hall.id}
          id={`hall-panel-${hall.id}`}
          role={halls.length > 1 ? 'tabpanel' : undefined}
          aria-labelledby={halls.length > 1 ? `hall-tab-${hall.id}` : undefined}
        >
          <div className="hall__media">
            <div className="hall__frame">
              <Media item={hall.cover} sizes="(min-width: 900px) 60vw, 100vw" />
            </div>
            <span className="hall__index" aria-hidden="true">
              {String(current + 1).padStart(2, '0')}
            </span>
          </div>

          <div className="hall__body" data-reveal>
            {hall.nameLatin && <p className="hall__latin latin">{hall.nameLatin}</p>}
            <h3 className="hall__name display">{hall.name}</h3>
            <p className="hall__desc">{hall.description}</p>

            <dl className="hall__facts">
              {hall.capacity ? (
                <div>
                  <dt>السعة</dt>
                  <dd>{hall.capacity}</dd>
                </div>
              ) : (
                <div>
                  <dt>السعة والتفاصيل</dt>
                  <dd>تواصلوا معنا لمعرفة السعة والخيارات المناسبة لمناسبتكم.</dd>
                </div>
              )}
              {hall.features.length > 0 && (
                <div>
                  <dt>المزايا</dt>
                  <dd>
                    <ul className="hall__features">
                      {hall.features.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
              )}
            </dl>

            <div className="hall__actions">
              <button type="button" className="btn btn--plum" onClick={() => dialog.current?.showModal()}>
                شاهدي التفاصيل
              </button>
              <button type="button" className="btn btn--line" onClick={inquire} data-magnetic>
                استفسري عن الحجز
              </button>
            </div>

            {hall.gallery.length > 0 && (
              <ul className="hall__thumbs" aria-label={`صور ${hall.name}`}>
                {hall.gallery.map((g, i) => (
                  <li key={g.id}>
                    <button type="button" onClick={() => setLightbox(i)} data-cursor="استكشف" aria-label={`عرض: ${g.alt}`}>
                      <Media item={g} badge={false} sizes="120px" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </article>
      </div>

      <dialog ref={dialog} className="hall-dialog" aria-labelledby="hall-dialog-title" onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}>
        <div className="hall-dialog__inner">
          <button type="button" className="hall-dialog__close" onClick={() => dialog.current?.close()} aria-label="إغلاق">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" /></svg>
          </button>
          <div className="hall-dialog__hero">
            <Media item={hall.cover} sizes="(min-width: 900px) 70vw, 100vw" />
          </div>
          <div className="hall-dialog__body">
            {hall.nameLatin && <p className="hall__latin latin">{hall.nameLatin}</p>}
            <h3 id="hall-dialog-title" className="display">{hall.name}</h3>
            <p>{hall.description}</p>
            {hall.capacity && <p className="hall-dialog__fact">السعة: {hall.capacity}</p>}
            {hall.features.length > 0 && (
              <ul className="hall__features">
                {hall.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            )}
            <div className="hall-dialog__grid">
              {hall.gallery.map((g, i) => (
                <button key={g.id} type="button" onClick={() => setLightbox(i)} aria-label={`عرض: ${g.alt}`}>
                  <Media item={g} badge={false} sizes="(min-width: 900px) 25vw, 50vw" />
                </button>
              ))}
            </div>
            <button type="button" className="btn btn--gold" onClick={inquire}>
              استفسري عن الحجز
            </button>
          </div>
        </div>
      </dialog>

      <Lightbox items={hall.gallery} index={lightbox} onClose={() => setLightbox(null)} onIndex={setLightbox} label={`صور ${hall.name}`} />
    </section>
  );
}
