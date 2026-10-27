/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  SARAYA SHEREEN — single source of truth for all business content.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  Everything a non-developer may need to change lives in this file.
 *
 *  CONTENT INTEGRITY RULES
 *  - Only publish facts confirmed by Saraya Shereen (official site, official
 *    Facebook page, or the business itself).
 *  - Fields marked `TODO(verify)` are deliberately empty or generic until the
 *    business confirms them. Do not fill them with guesses.
 *  - Media items without `src` render an illustrated placeholder that is clearly
 *    labelled as such. Replace them with genuine venue photographs (see README).
 */

export type ArtVariant =
  | 'hall'
  | 'hall-dark'
  | 'stage'
  | 'table'
  | 'chandelier'
  | 'floral'
  | 'entrance';

export interface MediaItem {
  id: string;
  /** Path under /public, e.g. '/media/hall-wide.webp'. Leave undefined to show the illustrated placeholder. */
  src?: string;
  /** Optional responsive sources, e.g. '/media/hall-800.webp 800w, /media/hall-1600.webp 1600w'. */
  srcSet?: string;
  /** Intrinsic size of the real photo (prevents layout shift). */
  width?: number;
  height?: number;
  /** CSS object-position focal point, e.g. '50% 40%'. */
  focal?: string;
  alt: string;
  caption?: string;
  /** Placeholder illustration used until a real photo is supplied. */
  art: ArtVariant;
  /** Alternate placeholder illustration (only 'table' and 'floral' have a 2). */
  seed?: 2;
  /** Layout hint for the editorial gallery grid. */
  shape?: 'wide' | 'tall' | 'square';
}

export interface Hall {
  id: string;
  /** TODO(verify): official hall name. */
  name: string;
  nameLatin?: string;
  description: string;
  /** TODO(verify): only fill with the officially published capacity, e.g. 'حتى ٥٠٠ ضيف'. */
  capacity?: string;
  /** TODO(verify): only confirmed features. */
  features: string[];
  cover: MediaItem;
  gallery: MediaItem[];
}

export interface Service {
  id: string;
  title: string;
  kicker: string;
  body: string;
  media: MediaItem;
}

// ─── Brand & contact ─────────────────────────────────────────────────────────

export const brand = {
  nameAr: 'سرايا شيرين',
  nameEn: 'SARAYA SHEREEN',
  city: 'طولكرم',
  cityEn: 'Tulkarm',
  country: 'فلسطين',
  countryEn: 'Palestine',
  /**
   * Official logo. Drop the supplied file at /public/brand/logo.png (or .svg / .webp)
   * and set the path here. While `null`, a stand-in emblem is drawn instead.
   */
  logoSrc: null as string | null,
  campaign: 'لكل حكاية حب… سرايا تليق بها',
  tagline: 'هناك ليالٍ تمرّ… وهناك ليلة تبقى في الذاكرة إلى الأبد.',
} as const;

export const contact = {
  /** As supplied by the business reference. Verify before deployment. */
  phoneDisplay: '0599 251 251',
  phoneHref: 'tel:+972599251251',
  whatsappNumber: '972599251251',
  email: 'info@sarayashereen.com',
  website: 'https://www.sarayashereen.com/',
  facebook: 'https://www.facebook.com/share/16K7fgr2PgM/',
  /**
   * TODO(verify): paste the official Google Maps link of the venue here.
   * The directions button stays hidden until this is set.
   */
  mapUrl: null as string | null,
  /** TODO(verify): street address as published by the venue. */
  address: null as string | null,
} as const;

export const site = {
  url: 'https://www.sarayashereen.com',
  title: 'سرايا شيرين | قاعات أفراح ومناسبات في طولكرم',
  description:
    'سرايا شيرين في طولكرم — قاعات أفراح ومناسبات تحتضن ليلتكم بأجواء ملكية. اكتشفوا القاعات وتواصلوا معنا لحجز زيارة.',
  keywords: [
    'سرايا شيرين',
    'قاعات أفراح في طولكرم',
    'قاعات زفاف في طولكرم',
    'قاعات مناسبات في طولكرم',
    'حجز قاعات أفراح',
    'Saraya Shereen',
    'Tulkarm wedding hall',
  ],
  /** Show the small "illustration" badge on placeholder media. Keep true until real photos are in. */
  showPlaceholderBadges: true,
} as const;

// ─── Navigation ──────────────────────────────────────────────────────────────

export const nav = [
  { href: '#top', label: 'الرئيسية' },
  { href: '#halls', label: 'القاعات' },
  { href: '#gallery', label: 'معرض الصور' },
  { href: '#services', label: 'خدماتنا' },
  { href: '#about', label: 'عن سرايا شيرين' },
  { href: '#booking', label: 'تواصل معنا' },
] as const;

// ─── Booking form options ────────────────────────────────────────────────────

/**
 * TODO(verify): extend only with occasion types the venue confirms it hosts
 * (e.g. 'حفل خطوبة', 'مناسبة عائلية'). Wedding halls are confirmed by the
 * venue's public page description.
 */
export const eventTypes = ['حفل زفاف', 'مناسبة أخرى'] as const;

// ─── Media library ───────────────────────────────────────────────────────────
// Replace `src` (and width/height) with genuine Saraya Shereen photographs.

const m = (item: MediaItem): MediaItem => item;

export const media = {
  heroHall: m({ id: 'hero-hall', art: 'hall', alt: 'قاعة الأفراح في سرايا شيرين بإضاءتها الدافئة', shape: 'wide' }),
  storyHall: m({ id: 'story-hall', art: 'hall', alt: 'منظر بانورامي لقاعة الأفراح', shape: 'wide' }),
  hallDark: m({ id: 'hall-dark', art: 'hall-dark', alt: 'القاعة قبل أن تُضاء', shape: 'wide' }),
  hallLit: m({ id: 'hall-lit', art: 'hall', alt: 'القاعة مضاءة وجاهزة للاحتفال', shape: 'wide' }),
  stage: m({ id: 'stage', art: 'stage', alt: 'منصة العروسين المزيّنة', shape: 'wide' }),
  pause: m({ id: 'pause', art: 'chandelier', alt: 'ثريا مضيئة في القاعة', shape: 'tall' }),
};

/** Chapter 06 sequence + editorial gallery. */
export const gallery: MediaItem[] = [
  { id: 'g1', art: 'stage', alt: 'منصة العروسين', caption: 'منصة الحكاية', shape: 'wide' },
  { id: 'g2', art: 'floral', alt: 'تنسيق زهور', caption: 'زهور تكمّل المشهد', shape: 'tall' },
  { id: 'g3', art: 'table', alt: 'طاولة ضيوف مجهّزة', caption: 'تفاصيل الطاولة', shape: 'tall' },
  { id: 'g4', art: 'chandelier', alt: 'ثريا القاعة', caption: 'ضوء يصنع الأجواء', shape: 'square' },
  { id: 'g5', art: 'hall', alt: 'القاعة بكامل إضاءتها', caption: 'مساحة تحتضن فرحتكم', shape: 'wide' },
  { id: 'g6', art: 'entrance', alt: 'مدخل القاعة', caption: 'أول خطوة', shape: 'tall' },
  { id: 'g7', art: 'floral', seed: 2, alt: 'تفاصيل زهرية قرب المنصة', caption: 'لمسات ناعمة', shape: 'square' },
  { id: 'g8', art: 'table', seed: 2, alt: 'إعداد طاولة احتفالية', caption: 'لكل ضيف مكانه', shape: 'square' },
];

/** Chapter 06 — horizontal detail sequence (stages, florals, tables, chandeliers…). */
export const storyDetails: MediaItem[] = [
  { id: 'd1', art: 'stage', alt: 'منصة العروسين بإضاءتها', caption: 'المنصّة', shape: 'wide' },
  { id: 'd2', art: 'floral', seed: 2, alt: 'تنسيق زهور ناعم', caption: 'الزهور', shape: 'tall' },
  { id: 'd3', art: 'table', alt: 'طاولة ضيوف مجهّزة بالشموع', caption: 'الطاولات', shape: 'tall' },
  { id: 'd4', art: 'chandelier', alt: 'ثريا ذهبية مضيئة', caption: 'الثريات', shape: 'tall' },
  { id: 'd5', art: 'hall', alt: 'القاعة بكامل تجهيزها', caption: 'المساحة', shape: 'wide' },
  { id: 'd6', art: 'entrance', alt: 'مدخل مزيّن بالزهور', caption: 'المدخل', shape: 'tall' },
];

/** Chapter 04 — frames crossfaded with scroll (first = quiet hall, last = celebration). */
export const transformationFrames: MediaItem[] = [media.hallDark, media.hallLit];

// ─── Halls ───────────────────────────────────────────────────────────────────
/**
 * TODO(verify): the venue's public page refers to wedding halls ("صالات أفراح").
 * Add one entry per official hall with its real name, published capacity and
 * confirmed features. With more than one entry, a hall selector appears.
 */
export const halls: Hall[] = [
  {
    id: 'main',
    name: 'صالات الأفراح',
    nameLatin: 'The Wedding Halls',
    description:
      'مساحة صُمّمت لتحتضن فرحتكم؛ ضوء دافئ، تفاصيل أنيقة، ومكان يليق بأن تبدأ فيه حكايتكم. زورونا لتشعروا بالأجواء عن قرب قبل أن تقرّروا.',
    capacity: undefined,
    features: [],
    cover: media.storyHall,
    gallery: [gallery[0], gallery[3], gallery[2], gallery[5]],
  },
];

// ─── Services ────────────────────────────────────────────────────────────────
/**
 * Based on the venue's public page description ("صالات أفراح وتأجيرها",
 * "مطعم وكافتيريا"). TODO(verify) details with the business before launch.
 */
export const services: Service[] = [
  {
    id: 'weddings',
    kicker: 'الأفراح',
    title: 'فرحتكم تستحق عناية بكل تفصيلة.',
    body: 'صالات أفراح تُفتح لليلتكم الكبيرة، بأجواء تُهيّأ لتليق بالمناسبة وبمن تحبّون.',
    media: gallery[0],
  },
  {
    id: 'restaurant',
    kicker: 'المطعم والكافتيريا',
    title: 'أجواء تُصنع لتناسب مناسبتكم.',
    body: 'في سرايا شيرين مطعم وكافتيريا. استفسروا من فريقنا عن التفاصيل المتاحة لمناسبتكم.',
    media: gallery[2],
  },
  {
    id: 'visit',
    kicker: 'زيارة شخصية',
    title: 'من التخطيط الأول… حتى اللحظة التي يبدأ فيها الاحتفال.',
    body: 'رتّبوا زيارة للمكان، وتحدّثوا مع فريقنا عن ليلتكم وما تتخيّلونه لها.',
    media: gallery[5],
  },
];

export const whatsappLink = (text?: string) =>
  `https://wa.me/${contact.whatsappNumber}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
