# سرايا شيرين — SARAYA SHEREEN

A cinematic, scroll-driven website for **Saraya Shereen**, wedding halls and celebrations in Tulkarm, Palestine.

The visitor moves from a royal-purple night sky through golden curtains into the hall. They can then explore the halls, the gallery and the services, and send a booking inquiry through WhatsApp.

- **Stack:** Next.js 15 (static export) · React 19 · TypeScript · GSAP + ScrollTrigger · plain CSS design system
- **Language:** Arabic first, right to left. Fonts: Aref Ruqaa (display), IBM Plex Sans Arabic (body), Cormorant Garamond (Latin accents)
- **Output:** a static site in `out/` that can be hosted anywhere (Netlify, Vercel, cPanel, S3, …)

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export → out/
npm run serve      # serve the built site locally
npm run typecheck
```

---

## Content status

All business content lives in **`src/content/site.ts`**. Items still marked `TODO(verify)` need the venue's confirmation.

| What | Where | State |
| --- | --- | --- |
| **Logo** | `public/brand/logo.png` (`brand.logoSrc`) | Cropped from the Facebook profile picture (512px). Replace it with the original high-resolution file when available |
| **Venue photos** | `public/media/photos/` (`photos` in `site.ts`) | 7 genuine photos as responsive WebP (960w and 1920w), with metadata stripped. Add more with `python3 scripts/optimize-photos.py <photo.jpg> <name>` |
| **Halls** | `halls` | «القاعة الداخلية» and «الحديقة الخارجية» are descriptive names taken from the photos. Features list only what the photos show. Official names and capacities are still `TODO(verify)` |
| **Facebook facts** | `contact.facebookStats`, `brand.group` | 149 ألف followers, 86% recommend from 1,716 reviews, and «مجموعة قاعات سرايا شيرين», as shown on the page in October 2026. Update them as they change |
| **Services** | `services` | From the Facebook description: wedding halls and rental, restaurant and cafeteria, hospitality services |
| **Occasion types (form)** | `eventTypes` | «حفل زفاف» and «مناسبة أخرى». Add others once the venue confirms them |
| **Map / address** | `contact.mapUrl`, `contact.address` | Hidden until set |
| **Phone / WhatsApp / email** | `contact` | `0599 251 251` (shown on the Facebook page) · `+972599251251` · `info@sarayashereen.com` |

The illustrated placeholders in `public/media/placeholders/` remain as fallbacks. Any media item without `src` uses them.

## Background music

`public/audio/saraya-theme.mp3` (128 kbps, about 1.7 MB) plays on a loop. The player is `src/components/BackgroundMusic.tsx` and the setting is `site.music`; set it to `null` to remove the music.

- Every modern browser (Chrome, Safari, Firefox, iPhone and Android) blocks sound until the visitor interacts with the page. The music therefore starts immediately where the browser allows it, and otherwise on the visitor's **first tap, click or key press anywhere**. Scrolling alone does not count as a gesture in browsers.
- A gold button in the bottom corner turns the music on and off. While playback is waiting for a gesture, the button shows the hint «اضغطوا لتشغيل الموسيقى».
- The visitor's on/off choice is remembered. Playback pauses while the tab is hidden and resumes on return.
- Make sure you hold the rights to use the song publicly on the website.

## How the experience is built

| Section | File | Notes |
| --- | --- | --- |
| Opening scene | `Hero.tsx` | The intro is pure CSS, so it starts on first paint, and it can be skipped (button, wheel, touch or key). Gold dust runs on a lightweight canvas (`Particles.tsx`) |
| Scroll story, chapters 01–06 | `Story.tsx` | Tall wrappers with CSS `position: sticky` stages and GSAP timelines scrubbed by scroll. Nothing is pinned or scroll-jacked, so native scrolling always works. A "skip the story" link and a chapter index are provided |
| Halls | `Halls.tsx` | Editorial layout with a parallax image, a details `<dialog>` and an inquiry button that preselects the hall in the form |
| Gallery and lightbox | `Gallery.tsx`, `Lightbox.tsx` | Editorial grid. The lightbox supports keyboard (Esc and arrows), swipe, a focus trap and focus restore |
| Services | `Services.tsx` | Large editorial panels with masked reveals |
| About, Pause | `About.tsx`, `Pause.tsx` | |
| Booking | `Booking.tsx` | Validated form → an editable, prefilled WhatsApp message (`wa.me`), with an email fallback. **No booking is confirmed and no availability is claimed** |
| Finale footer | `Footer.tsx` | Stars gather into the logo ring as you scroll |

Motion principles:

- Visitors who prefer reduced motion get a calm, static layout. JavaScript-free visitors get the same layout: `html.motion-ok` is only set when motion is welcome.
- Every scene's resting CSS state is fully readable. Animations only add the initial states, so a failed animation never hides content.
- Heavy scene setup is deferred to idle time, one chapter per idle slot (`useDeferredScene`, `whenIdle` in `src/lib/motion.ts`).
- The custom cursor, magnetic buttons and the cursor glow are enabled only for fine pointers. Phones get a lighter story (shorter scenes, a vertical gallery, a 30fps particle field).

## SEO and sharing

- Arabic title and description, Open Graph and Twitter cards with `public/og.jpg`, canonical URL, `sitemap.xml` and `robots.txt`.
- `EventVenue` structured data, built only from confirmed fields. It has no ratings or reviews.
- To regenerate the sharing image: `node scripts/og.cjs`. To regenerate the placeholder art: `node scripts/gen-placeholders.mjs && node scripts/rasterize-placeholders.cjs`. Both need Playwright.

## Measured (Lighthouse 12, simulated mobile, placeholder art)

| Category | Score |
| --- | --- |
| Performance | ~74–76 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

Lab metrics: CLS 0.007, TBT ≈ 300 ms, LCP ≈ 4.0 s under Lighthouse's throttled 4G and 4× CPU. These are lab numbers from a local server. Re-measure on the production host with the real photos, and check real-user Core Web Vitals after launch.
