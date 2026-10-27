import type { Metadata, Viewport } from 'next';
import '@fontsource/ibm-plex-sans-arabic/400.css';
import '@fontsource/ibm-plex-sans-arabic/500.css';
import '@fontsource/cormorant-garamond/latin-400.css';
import '@fontsource/cormorant-garamond/latin-400-italic.css';
import './globals.css';
import { brand, contact, site } from '@/content/site';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  keywords: [...site.keywords],
  applicationName: brand.nameAr,
  manifest: '/manifest.webmanifest',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'ar_PS',
    url: '/',
    siteName: `${brand.nameAr} — ${brand.nameEn}`,
    title: site.title,
    description: site.description,
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: `${brand.nameAr} — ${brand.campaign}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: site.title,
    description: site.description,
    images: ['/og.jpg'],
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: '#280D2E',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

// Only facts confirmed by the business belong here — no ratings or reviews.
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EventVenue',
  name: brand.nameAr,
  alternateName: brand.nameEn,
  url: site.url,
  telephone: contact.phoneHref.replace('tel:', ''),
  email: contact.email,
  logo: `${site.url}/brand/logo.png`,
  image: `${site.url}/og.jpg`,
  address: {
    '@type': 'PostalAddress',
    addressLocality: brand.cityEn,
    addressCountry: 'PS',
    ...(contact.address ? { streetAddress: contact.address } : {}),
  },
  sameAs: [contact.facebook],
};

// Runs before first paint: enables the motion layout only when the visitor
// has not asked for reduced motion. Without JS the site renders statically.
const bootScript = `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('motion-ok')}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <link rel="preload" href="/fonts/aref-ruqaa-arabic-400-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/media/photos/hall-wide-1920.webp" as="image" type="image/webp" fetchPriority="high" />
      </head>
      <body>
        <a className="skip-link" href="#main">
          تخطّي إلى المحتوى
        </a>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
