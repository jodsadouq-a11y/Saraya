import { brand } from '@/content/site';

/**
 * Brand mark. Renders the official logo when `brand.logoSrc` is set.
 * Otherwise draws a stand-in emblem (circle, crown, flowing gown, stars)
 * that only echoes the logo's structure — replace it with the real file.
 */
export default function Emblem({ size = 120, className = '', title = brand.nameAr }: { size?: number; className?: string; title?: string }) {
  if (brand.logoSrc) {
    return <img src={brand.logoSrc} width={size} height={size} alt={title} className={`emblem ${className}`} />;
  }
  return (
    <svg className={`emblem ${className}`} width={size} height={size} viewBox="0 0 200 200" role="img" aria-label={title}>
      <defs>
        <radialGradient id="em-bg" cx=".5" cy=".42" r=".6">
          <stop offset="0" stopColor="#6B2A70" />
          <stop offset="1" stopColor="#3A1040" />
        </radialGradient>
        <linearGradient id="em-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F6E4B2" />
          <stop offset=".5" stopColor="#E8C36F" />
          <stop offset="1" stopColor="#B8914A" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="96" fill="url(#em-bg)" />
      <circle cx="100" cy="100" r="90" fill="none" stroke="url(#em-gold)" strokeWidth="2" />
      <circle cx="100" cy="100" r="84" fill="none" stroke="url(#em-gold)" strokeWidth=".6" strokeDasharray="1 4" />
      <g fill="none" stroke="url(#em-gold)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        {/* crown */}
        <path d="M86 50 L88 40 L94 46 L100 36 L106 46 L112 40 L114 50 Z" fill="url(#em-gold)" stroke="none" />
        {/* head + neck */}
        <circle cx="100" cy="60" r="8" fill="url(#em-gold)" stroke="none" />
        <path d="M100 68 L100 76" />
        {/* bodice */}
        <path d="M92 78 Q100 74 108 78 L104 98 Q100 100 96 98 Z" fill="url(#em-gold)" stroke="none" />
        {/* flowing gown */}
        <path d="M96 98 Q84 130 60 162" />
        <path d="M98 99 Q92 136 80 168" strokeWidth="1.4" />
        <path d="M100 100 Q100 140 100 172" strokeWidth="1.2" />
        <path d="M102 99 Q110 136 124 168" strokeWidth="1.4" />
        <path d="M104 98 Q122 128 150 156" />
        <path d="M60 162 Q100 182 150 156" strokeWidth="1.2" />
      </g>
      <g fill="#F6E4B2">
        <circle cx="62" cy="64" r="1.6" /><circle cx="140" cy="58" r="2" /><circle cx="148" cy="96" r="1.2" />
        <circle cx="54" cy="104" r="1.2" /><circle cx="132" cy="132" r="1.4" /><circle cx="70" cy="140" r="1" />
        <path d="M140 72 l1.6 4 4 1.6 -4 1.6 -1.6 4 -1.6 -4 -4 -1.6 4 -1.6z" />
        <path d="M58 82 l1 2.6 2.6 1 -2.6 1 -1 2.6 -1 -2.6 -2.6 -1 2.6 -1z" />
      </g>
    </svg>
  );
}
