'use client';

import { useEffect, useRef, useState } from 'react';
import { brand, contact, nav, whatsappLink } from '@/content/site';
import AnimatedLogo from './AnimatedLogo';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('#top');
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Highlight the section currently in view.
  useEffect(() => {
    const ids = nav.map((n) => n.href.slice(1));
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(`#${e.target.id}`);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Mobile menu: lock background, close on Escape, move focus in and back out.
  useEffect(() => {
    const main = document.getElementById('main');
    const footer = document.querySelector('footer');
    if (open) {
      document.documentElement.classList.add('menu-open');
      main?.setAttribute('inert', '');
      footer?.setAttribute('inert', '');
      menuRef.current?.querySelector<HTMLElement>('a')?.focus();
      const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }
    document.documentElement.classList.remove('menu-open');
    main?.removeAttribute('inert');
    footer?.removeAttribute('inert');
  }, [open]);

  const close = () => {
    setOpen(false);
    toggleRef.current?.focus();
  };

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <div className="site-header__bar">
        <a href="#top" className="site-header__brand" aria-label={`${brand.nameAr} — الرئيسية`}>
          <AnimatedLogo size={88} compact />
          <span className="site-header__name">
            <span className="site-header__ar">{brand.nameAr}</span>
            <span className="site-header__en">{brand.nameEn}</span>
          </span>
        </a>

        <nav className="site-nav" aria-label="التنقّل الرئيسي">
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} aria-current={active === item.href ? 'true' : undefined}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a href="#booking" className="btn btn--gold btn--sm site-header__cta" data-magnetic>
          استفسري عن الحجز
        </a>

        <button
          ref={toggleRef}
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'إغلاق القائمة' : 'فتح القائمة'}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>

      <div id="mobile-menu" ref={menuRef} className="mobile-menu" hidden={!open}>
        <nav aria-label="قائمة الجوال">
          <ol>
            {nav.map((item, i) => (
              <li key={item.href} style={{ ['--i' as string]: i }}>
                <a href={item.href} onClick={close}>
                  <span className="mobile-menu__num">{String(i + 1).padStart(2, '0')}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="mobile-menu__foot">
          <a className="btn btn--gold" href="#booking" onClick={close}>
            استفسري عن الحجز
          </a>
          <a className="btn btn--ghost" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
            واتساب <span dir="ltr">{contact.phoneDisplay}</span>
          </a>
        </div>
      </div>
    </header>
  );
}
