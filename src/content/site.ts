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
  /** Group name shown on the official Facebook cover. */
  group: 'مجموعة قاعات سرايا شيرين',
  /**
   * Official logo (cropped from the Facebook profile picture). Replace with the
   * original high-resolution file when available. `null` draws a stand-in emblem.
   */
  logoSrc: '/brand/logo.png' as string | null,
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
  /** As shown on the official Facebook page (October 2026). Update as they change. */
  facebookStats: { followers: '149 ألف', recommend: '86%', reviews: '1,716' },
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
  /**
   * Background music. Browsers only allow sound after the visitor's first tap,
   * click or key press, so playback starts then (or immediately where allowed).
   */
  music: { src: '/audio/saraya-theme.mp3', volume: 0.45 } as { src: string; volume: number } | null,
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
// Genuine Saraya Shereen photographs (resized by scripts/optimize-photos.py).
// `art` stays as the fallback illustration if a photo is ever removed.

const m = (item: MediaItem): MediaItem => item;

/** Builds a responsive photo entry from /public/media/photos/<name>-{960,1920}.webp. */
const photo = (name: string, w: number, h: number, item: Omit<MediaItem, 'src' | 'srcSet' | 'width' | 'height'>): MediaItem => ({
  ...item,
  src: `/media/photos/${name}-1920.webp`,
  srcSet: `/media/photos/${name}-960.webp 960w, /media/photos/${name}-1920.webp 1920w`,
  width: 1920,
  height: Math.round((1920 * h) / w),
});

export const photos = {
  hallWarm: photo('hall-warm', 4, 3, { id: 'hall-warm', art: 'hall', alt: 'القاعة الداخلية في سرايا شيرين بثريّاتها الذهبية وستائر الأضواء', caption: 'ضوء يصنع الأجواء', shape: 'square' }),
  hallBlue: photo('hall-blue', 4, 3, { id: 'hall-blue', art: 'hall-dark', alt: 'القاعة بإضاءة زرقاء هادئة وممرّ تحفّه الورود البيضاء', caption: 'قبل أن تبدأ الليلة', shape: 'square' }),
  hallTatreez: photo('hall-tatreez', 4, 3, { id: 'hall-tatreez', art: 'hall', alt: 'ممرّ بسجّاد مطرّز بالتطريز الفلسطيني تحت أقواس من الضوء وورود حمراء', caption: 'ممرّ الحكاية', shape: 'square', focal: '50% 55%' }),
  stageFlowers: photo('stage-flowers', 4, 3, { id: 'stage-flowers', art: 'stage', alt: 'منصة العروسين على درج رخامي تحيط بها جدران من الورود البيضاء', caption: 'منصّة الحكاية', shape: 'wide' }),
  stageStars: photo('stage-stars', 4, 3, { id: 'stage-stars', art: 'stage', alt: 'منصة خارجية بخلفية سماء مرصّعة بالنجوم وستائر بيضاء', caption: 'تحت سماء من نجوم', shape: 'tall', focal: '50% 60%' }),
  gardenArch: photo('garden-arch', 16, 9, { id: 'garden-arch', art: 'entrance', alt: 'أقواس ورود وردية وبيضاء تقود إلى درج مضيء في الحديقة', caption: 'أول خطوة', shape: 'tall', focal: '50% 50%' }),
  gardenTables: photo('garden-tables', 4, 3, { id: 'garden-tables', art: 'table', alt: 'طاولات الحديقة الخارجية بالورود والأضواء المعلّقة عند الغروب', caption: 'سهرة في الحديقة', shape: 'wide' }),
};

export const media = {
  heroHall: photos.hallWarm,
  /** Revealed behind the curtains (chapter 02). */
  hallLit: photos.stageStars,
  /** Entering the hall (chapter 03). */
  storyHall: photos.hallTatreez,
  stage: photos.stageFlowers,
  pause: photos.gardenTables,
};

/** Editorial gallery. */
export const gallery: MediaItem[] = [
  photos.stageFlowers,
  photos.gardenArch,
  photos.hallWarm,
  photos.hallTatreez,
  photos.gardenTables,
  photos.stageStars,
  photos.hallBlue,
];

/** Chapter 06 — horizontal detail sequence. */
export const storyDetails: MediaItem[] = [
  { ...photos.stageFlowers, caption: 'المنصّة', shape: 'wide' },
  { ...photos.gardenArch, caption: 'الحديقة', shape: 'tall' },
  { ...photos.hallWarm, caption: 'الثريّات', shape: 'tall' },
  { ...photos.hallTatreez, caption: 'الممرّ', shape: 'wide' },
  { ...photos.stageStars, caption: 'السماء', shape: 'tall' },
  { ...photos.gardenTables, caption: 'الطاولات', shape: 'tall' },
];

/** Chapter 04 — frames crossfaded with scroll (first = quiet hall, last = celebration). */
export const transformationFrames: MediaItem[] = [photos.hallBlue, photos.hallWarm];

// ─── Halls ───────────────────────────────────────────────────────────────────
/**
 * Two spaces appear in the venue's photographs: an indoor hall and an outdoor
 * garden. TODO(verify): official names and published capacities. Features below
 * are only what is visible in the photographs.
 */
export const halls: Hall[] = [
  {
    id: 'hall',
    name: 'القاعة الداخلية',
    nameLatin: 'The Grand Hall',
    description:
      'قاعة بيضاء تتلألأ فيها الثريّات الذهبية وستائر الأضواء فوق أرضية لامعة، بدرج مزدوج يطلّ من شرفة علوية، ومنصّة للعروسين على درج رخامي تحيط بها الورود.',
    capacity: undefined,
    features: ['ثريّات ذهبية', 'ستائر أضواء', 'درج مزدوج وشرفة علوية', 'منصّة عروسين رخامية', 'إضاءة مسرحية'],
    cover: photos.hallWarm,
    gallery: [photos.hallTatreez, photos.hallBlue, photos.stageFlowers, photos.hallWarm],
  },
  {
    id: 'garden',
    name: 'الحديقة الخارجية',
    nameLatin: 'The Garden',
    description:
      'سهرة في الهواء الطلق تحت أشجار الصفصاف والأضواء المعلّقة، على عشب أخضر وطاولات تزيّنها الورود، مع درج مضيء ومنصّة أمام واجهة السرايا.',
    capacity: undefined,
    features: ['أضواء معلّقة', 'أقواس ورود', 'درج مضيء', 'منصّة خارجية'],
    cover: photos.gardenTables,
    gallery: [photos.gardenArch, photos.stageStars, photos.gardenTables],
  },
];

// ─── Services ────────────────────────────────────────────────────────────────
/**
 * From the venue's Facebook page description: "مطعم وكافتيريا وصالات افراح
 * وتاجيرها وتقديم الخدمات الفندقية اللازمة والشاملة".
 */
export const services: Service[] = [
  {
    id: 'weddings',
    kicker: 'الأفراح',
    title: 'فرحتكم تستحق عناية بكل تفصيلة.',
    body: 'صالات أفراح تُفتح لليلتكم الكبيرة، بأجواء تُهيّأ لتليق بالمناسبة وبمن تحبّون.',
    media: photos.stageFlowers,
  },
  {
    id: 'restaurant',
    kicker: 'المطعم والكافتيريا',
    title: 'أجواء تُصنع لتناسب مناسبتكم.',
    body: 'في سرايا شيرين مطعم وكافتيريا وخدمات ضيافة متكاملة. استفسروا من فريقنا عن التفاصيل المتاحة لمناسبتكم.',
    media: photos.gardenTables,
  },
  {
    id: 'visit',
    kicker: 'زيارة شخصية',
    title: 'من التخطيط الأول… حتى اللحظة التي يبدأ فيها الاحتفال.',
    body: 'رتّبوا زيارة للمكان، وتحدّثوا مع فريقنا عن ليلتكم وما تتخيّلونه لها.',
    media: photos.gardenArch,
  },
];

export const whatsappLink = (text?: string) =>
  `https://wa.me/${contact.whatsappNumber}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
