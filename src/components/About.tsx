import { brand, contact } from '@/content/site';
import AnimatedLogo from './AnimatedLogo';

export default function About() {
  return (
    <section id="about" className="section section--ivory about" aria-labelledby="about-title">
      <div className="container about__grid">
        <div className="about__mark" data-reveal aria-hidden="true">
          <svg className="about__orbit" viewBox="0 0 400 400">
            <circle cx="200" cy="200" r="190" />
            <circle cx="200" cy="200" r="160" strokeDasharray="2 8" />
            <path d="M200 10 L200 40 M200 360 L200 390 M10 200 L40 200 M360 200 L390 200" />
          </svg>
          <AnimatedLogo size={220} tilt />
        </div>
        <div className="about__body" data-reveal>
          <p className="eyebrow">عن سرايا شيرين</p>
          <h2 id="about-title" className="section-title display">{brand.campaign}</h2>
          <p className="about__lead">{brand.tagline}</p>
          <p>
            في قلب {brand.city}، تفتح {brand.group} أبوابها لليالي الفرح: قاعة داخلية تتلألأ بالثريّات، وحديقة خارجية تحت
            الأضواء المعلّقة، إلى جانب المطعم والكافتيريا وخدمات الضيافة. مكانٌ يحتضن مناسباتكم بأجواء دافئة وأنيقة، ويمنح
            كل حكاية المساحة التي تستحقها لتُروى.
          </p>
          <ul className="about__facts">
            <li>
              <span>المكان</span>
              {brand.city}، {brand.country}
            </li>
            <li>
              <span>القاعات</span>
              قاعة داخلية وحديقة خارجية
            </li>
            <li>
              <span>الضيافة</span>
              مطعم وكافتيريا
            </li>
          </ul>
          <a className="about__social" href={contact.facebook} target="_blank" rel="noopener noreferrer">
            <strong>{contact.facebookStats.recommend}</strong> يوصون بنا من {contact.facebookStats.reviews} مراجعة ·{' '}
            <strong>{contact.facebookStats.followers}</strong> متابع على فيسبوك
          </a>
          {contact.mapUrl && (
            <div style={{ marginTop: '1.5rem' }}>
              <a
                href={contact.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--gold"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <span>📍 موقعنا على خرائط Google</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
