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

## ⚠️ Before launch: replace placeholders with verified content

The official website and Facebook page could not be opened from the build environment, so **nothing has been invented**. Everything that needs confirming lives in one file: **`src/content/site.ts`**. Look for `TODO(verify)` there.

| What | Where | Current state |
| --- | --- | --- |
| **Official logo** | `brand.logoSrc` → put the file in `public/brand/` | A stand-in emblem is drawn until the real logo is added |
| **Venue photos** | `media`, `gallery`, `storyDetails`, `halls[].cover/gallery` → set `src`, `width`, `height` (and optionally `srcSet`, `focal`) | Gold line-art **illustrations**, labelled «رسم توضيحي مؤقت» on the page |
| **Hall names, capacities, features** | `halls` | One generic entry, «صالات الأفراح», with no capacity or features. Add one entry per official hall; a hall selector appears automatically when there are two or more |
| **Occasion types (form)** | `eventTypes` | «حفل زفاف» and «مناسبة أخرى». Add others only once the venue confirms them |
| **Services** | `services` | Based on the public page description (wedding halls, restaurant and cafeteria) |
| **Map / address** | `contact.mapUrl`, `contact.address` | Hidden until set. The footer then shows a «الاتجاهات على الخريطة» link |
| **Phone / WhatsApp / email** | `contact` | `0599 251 251` · `+972599251251` · `info@sarayashereen.com`, as supplied. Verify before going live |

When all real photos are in, set `site.showPlaceholderBadges = false`.

### Adding real photos

1. Export each photo as WebP, about 1920px wide for wide scenes and 1200px for portraits. A second size at half the width is recommended for phones.
2. Put the files in `public/media/`.
3. Point the media item at them:

```ts
heroHall: m({
  id: 'hero-hall', art: 'hall', shape: 'wide',
  src: '/media/hall-1920.webp',
  srcSet: '/media/hall-960.webp 960w, /media/hall-1920.webp 1920w',
  width: 1920, height: 1080,
  focal: '50% 45%',
  alt: 'قاعة الأفراح في سرايا شيرين بإضاءتها الدافئة',
}),
```

- Chapter 04 («التحوّل») crossfades through `transformationFrames`, from the quiet hall to the celebration. Two or more real photos of the same space work best.
- The labels in Chapter 03 are positioned in `Story.tsx` (`.ch3__label` inline styles). Adjust them to the real photo.

---

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
