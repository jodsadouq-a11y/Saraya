'use client';

import { useEffect, useState } from 'react';
import { brand, whatsappLink } from '@/content/site';

/** Persistent WhatsApp shortcut, shown once the visitor has left the hero. */
export default function FloatingWhatsApp() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <a
      className={`fab-wa ${show ? 'is-visible' : ''}`}
      href={whatsappLink(`مرحبًا ${brand.nameAr}، أودّ الاستفسار عن حجز مناسبة.`)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصلوا معنا عبر واتساب"
      tabIndex={show ? 0 : -1}
    >
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3zm0 23.7a10.7 10.7 0 0 1-5.5-1.5l-.4-.2-3.9 1 1-3.8-.2-.4A10.7 10.7 0 1 1 16 26.7zm5.9-8c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7 0a8.8 8.8 0 0 1-4.4-3.8c-.3-.6.3-.5 1-1.7.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.9.4 3.6 3.6 0 0 0-1.1 2.7 6.3 6.3 0 0 0 1.3 3.3 14.4 14.4 0 0 0 5.5 4.9c2 .9 2.8 1 3.9.8a3.3 3.3 0 0 0 2.1-1.5 2.7 2.7 0 0 0 .2-1.5c-.1-.1-.3-.2-.6-.3z" />
      </svg>
      <span>واتساب</span>
    </a>
  );
}
