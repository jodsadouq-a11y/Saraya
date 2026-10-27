'use client';

import { useState } from 'react';
import { halls } from '@/content/site';

interface EstimatorProps {
  onSelectHall?: (hallName: string, guests: number) => void;
}

export default function EventEstimator({ onSelectHall }: EstimatorProps) {
  const [guests, setGuests] = useState(350);
  const [eventType, setEventType] = useState('حفل زفاف');

  // Dynamic recommendation based on guest count and occasion
  const recommendedHall = guests > 450 ? 'القاعة الداخلية الفاخرة' : 'الحديقة الخارجية أو القاعة الداخلية';
  const estimatedStaff = Math.max(8, Math.round(guests / 35));
  const hospitalitySuggestion = guests > 400 ? 'بوفيه ملكي مفتوح + كافتيريا متكاملة' : 'ضيافة فاخرة متكاملة وطاولات VIP';

  const applyToBooking = () => {
    if (onSelectHall) {
      onSelectHall(recommendedHall, guests);
    }
    const bookingSection = document.getElementById('booking');
    bookingSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(40,13,46,0.95) 0%, rgba(20,5,25,0.98) 100%)',
        border: '1px solid rgba(212,175,55,0.3)',
        borderRadius: '20px',
        padding: '2rem',
        color: '#fff',
        boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
        marginTop: '2rem',
      }}
      className="event-estimator"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '1.5rem' }}>✨</span>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#D4AF37' }}>حاسبة ومستشار المناسبات الذكي</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.8 }}>
            حددي عدد الضيوف واكتشفي الترتيب المثالي لليلتك في ثوانٍ
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', alignItems: 'center' }}>
        {/* Sliders and Controls */}
        <div>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
              <span>عدد الضيوف المتوقع:</span>
              <strong style={{ color: '#D4AF37', fontSize: '1.1rem' }}>{guests} ضيف</strong>
            </label>
            <input
              type="range"
              min="100"
              max="1000"
              step="25"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              style={{
                width: '100%',
                accentColor: '#D4AF37',
                cursor: 'pointer',
                height: '6px',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', opacity: 0.6, marginTop: '0.25rem' }}>
              <span>100 ضيف</span>
              <span>500 ضيف</span>
              <span>1000+ ضيف</span>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.95rem' }}>نوع المناسبة:</label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['حفل زفاف', 'حفل خطوبة', 'سهرة حناء', 'مناسبة خاصة'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setEventType(type)}
                  style={{
                    padding: '0.45rem 0.9rem',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    background: eventType === type ? '#D4AF37' : 'rgba(255,255,255,0.08)',
                    color: eventType === type ? '#1a051d' : '#fff',
                    border: '1px solid ' + (eventType === type ? '#D4AF37' : 'rgba(255,255,255,0.15)'),
                    fontWeight: eventType === type ? 'bold' : 'normal',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div
          style={{
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '14px',
            padding: '1.25rem',
            border: '1px solid rgba(212,175,55,0.2)',
          }}
        >
          <div style={{ fontSize: '0.8rem', color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '1px' }}>
            التوصية المخصصة
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 'bold', margin: '0.35rem 0', color: '#fff' }}>
            {recommendedHall}
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0.75rem 0', fontSize: '0.85rem', lineHeight: '1.8' }}>
            <li>▫️ <strong>كادر الضيافة المقترح:</strong> ما يقارب {estimatedStaff} فرد لخدمة سلسة.</li>
            <li>▫️ <strong>نوع الترتيب:</strong> {hospitalitySuggestion}.</li>
            <li>▫️ <strong>موسم الأفراح:</strong> ننصح بتأكيد الموعد مسبقاً لضمان توفر التاريخ.</li>
          </ul>

          <button
            type="button"
            onClick={applyToBooking}
            className="btn btn--gold"
            style={{ width: '100%', textAlign: 'center', padding: '0.65rem 1rem', fontSize: '0.9rem' }}
          >
            اعتماد هذه التفاصيل وتعبئة الطلب
          </button>
        </div>
      </div>
    </div>
  );
}
