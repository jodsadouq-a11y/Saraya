'use client';

import { useState } from 'react';
import { brand } from '@/content/site';

interface Reel {
  id: string;
  title: string;
  duration: string;
  views: string;
  coverSrc: string;
  category: string;
}

const REELS: Reel[] = [
  {
    id: 'r1',
    title: 'أجواء زفة العروس وتلألؤ الثريات في القاعة الداخلية',
    duration: '0:35',
    views: '12.4K',
    coverSrc: '/media/photos/hall-warm-960.webp',
    category: 'زفة ملكية',
  },
  {
    id: 'r2',
    title: 'سحر الإضاءة المسائية والورود في الحديقة الخارجية',
    duration: '0:42',
    views: '8.9K',
    coverSrc: '/media/photos/garden-arch-960.webp',
    category: 'الحديقة الخارجية',
  },
  {
    id: 'r3',
    title: 'تفاصيل كوشة العروس وديكورات الورود الطبيعية',
    duration: '0:28',
    views: '15.1K',
    coverSrc: '/media/photos/stage-flowers-960.webp',
    category: 'ديكور ومسرح',
  },
  {
    id: 'r4',
    title: 'تجهيزات طاولات الضيوف وأناقة الضيافة الراقية',
    duration: '0:45',
    views: '9.3K',
    coverSrc: '/media/photos/garden-tables-960.webp',
    category: 'خدمات الضيافة',
  },
];

export default function VideoReels() {
  const [activeReel, setActiveReel] = useState<Reel | null>(null);

  return (
    <section id="reels" className="section section--plum" aria-labelledby="reels-title">
      <div className="container">
        <header className="section-head" data-reveal>
          <p className="eyebrow">لحظات حية</p>
          <h2 id="reels-title" className="section-title display">
            شاهدي الفرح ينبض بالحياة
          </h2>
          <p className="section-lead">
            لقطات قصيرة من أبهى ليالي وأفراح {brand.nameAr}.
          </p>
        </header>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '1.5rem',
            marginTop: '2rem',
          }}
        >
          {REELS.map((reel) => (
            <div
              key={reel.id}
              onClick={() => setActiveReel(reel)}
              style={{
                position: 'relative',
                aspectRatio: '9/16',
                borderRadius: '16px',
                overflow: 'hidden',
                cursor: 'pointer',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
                transform: 'translateZ(0)',
                transition: 'transform 0.3s ease, border-color 0.3s ease',
              }}
              className="reel-card"
            >
              <img
                src={reel.coverSrc}
                alt={reel.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(20,5,25,0.92) 0%, rgba(20,5,25,0.2) 50%, rgba(20,5,25,0.4) 100%)',
                }}
              />

              {/* Play Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'rgba(212, 175, 55, 0.9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#1a051d',
                  boxShadow: '0 0 25px rgba(212,175,55,0.6)',
                }}
              >
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>

              {/* Category pill */}
              <div
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'rgba(20,5,25,0.7)',
                  backdropFilter: 'blur(6px)',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  color: '#D4AF37',
                  border: '1px solid rgba(212,175,55,0.3)',
                }}
              >
                {reel.category}
              </div>

              {/* Bottom Info */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '1rem',
                  right: '1rem',
                  left: '1rem',
                  color: '#fff',
                }}
              >
                <div style={{ fontSize: '0.8rem', opacity: 0.8, marginBottom: '0.25rem' }}>
                  <span>👁 {reel.views} مشاهدة</span> · <span>⏱ {reel.duration}</span>
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, lineHeight: 1.4, margin: 0 }}>
                  {reel.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reel Modal */}
      {activeReel && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveReel(null)}
          style={{ zIndex: 100 }}
        >
          <div className="lightbox__backdrop" />
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '90%',
              maxWidth: '400px',
              aspectRatio: '9/16',
              background: '#0e0211',
              borderRadius: '20px',
              overflow: 'hidden',
              border: '1px solid #D4AF37',
              boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <img
              src={activeReel.coverSrc}
              alt={activeReel.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(14,2,17,0.95) 0%, transparent 60%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '1.5rem',
                color: '#fff',
              }}
            >
              <span style={{ color: '#D4AF37', fontSize: '0.85rem' }}>{activeReel.category}</span>
              <h3 style={{ margin: '0.5rem 0', fontSize: '1.1rem' }}>{activeReel.title}</h3>
              <p style={{ fontSize: '0.85rem', opacity: 0.8, margin: 0 }}>
                لمشاهدة أحدث الفيديوهات كاملة ويوميات الأفراح، تفضلوا بزيارة صفحتنا الرسمية على فيسبوك وإنستغرام.
              </p>
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
                <a
                  href="https://www.facebook.com/share/16K7fgr2PgM/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--gold"
                  style={{ flex: 1, textAlign: 'center', fontSize: '0.85rem', padding: '0.6rem 1rem' }}
                >
                  مشاهدة على فيسبوك
                </a>
                <button
                  type="button"
                  onClick={() => setActiveReel(null)}
                  className="btn btn--line"
                  style={{ fontSize: '0.85rem', padding: '0.6rem 1rem' }}
                >
                  إغلاق
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveReel(null)}
              className="lightbox__btn"
              style={{ position: 'absolute', top: '1rem', right: '1rem' }}
              aria-label="إغلاق"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
