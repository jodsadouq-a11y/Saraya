'use client';

import { useState } from 'react';
import { gallery } from '@/content/site';
import Media from './Media';
import Lightbox from './Lightbox';

export default function Gallery() {
  const [index, setIndex] = useState<number | null>(null);
  return (
    <section id="gallery" className="section section--warm gallery" aria-labelledby="gallery-title">
      <div className="container">
        <header className="section-head section-head--split" data-reveal>
          <div>
            <p className="eyebrow">معرض الصور</p>
            <h2 id="gallery-title" className="section-title display">لحظات من حكاياتنا</h2>
          </div>
          <p className="section-lead">
            مختارات من أجواء سرايا شيرين — اضغطوا على أي صورة لعرضها بالحجم الكامل.
          </p>
        </header>

        <ul className="gallery__grid">
          {gallery.map((item, i) => (
            <li key={item.id} className={`gallery__item gallery__item--${item.shape ?? 'square'}`} data-reveal style={{ ['--d' as string]: `${(i % 3) * 80}ms` }}>
              <button type="button" onClick={() => setIndex(i)} data-cursor="استكشف" aria-label={`عرض الصورة: ${item.alt}`}>
                <Media item={item} sizes="(min-width: 900px) 33vw, 50vw" />
                {item.caption && <span className="gallery__caption">{item.caption}</span>}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <Lightbox items={gallery} index={index} onClose={() => setIndex(null)} onIndex={setIndex} label="لحظات من حكاياتنا" />
    </section>
  );
}
