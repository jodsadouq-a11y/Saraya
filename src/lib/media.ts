import type { MediaItem } from '@/content/site';

const WIDE = new Set(['hall', 'hall-dark', 'stage']);

export const isPlaceholder = (item: MediaItem) => !item.src;

const placeholderName = (item: MediaItem) => `/media/placeholders/${item.art}${item.seed ? `-${item.seed}` : ''}`;

export function mediaSrc(item: MediaItem) {
  if (item.src) return item.src;
  return `${placeholderName(item)}-${WIDE.has(item.art) ? 1920 : 1200}.jpg`;
}

export function mediaSrcSet(item: MediaItem) {
  if (item.src) return item.srcSet;
  const base = placeholderName(item);
  return WIDE.has(item.art) ? `${base}-960.jpg 960w, ${base}-1920.jpg 1920w` : `${base}-600.jpg 600w, ${base}-1200.jpg 1200w`;
}

export function mediaSize(item: MediaItem): [number, number] {
  if (item.src && item.width && item.height) return [item.width, item.height];
  return WIDE.has(item.art) ? [1920, 1080] : [1200, 1600];
}
