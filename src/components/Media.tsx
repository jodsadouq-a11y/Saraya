import type { CSSProperties } from 'react';
import type { MediaItem } from '@/content/site';
import { site } from '@/content/site';
import { isPlaceholder, mediaSize, mediaSrc, mediaSrcSet } from '@/lib/media';

interface Props {
  item: MediaItem;
  className?: string;
  /** Above-the-fold images load eagerly with high priority. */
  priority?: boolean;
  sizes?: string;
  badge?: boolean;
  style?: CSSProperties;
}

/**
 * Renders a genuine photo when `item.src` is set; otherwise the illustrated
 * placeholder, labelled so it is never mistaken for a photo of the venue.
 */
export default function Media({ item, className, priority, sizes = '100vw', badge = true, style }: Props) {
  const [w, h] = mediaSize(item);
  const placeholder = isPlaceholder(item);
  const srcSet = mediaSrcSet(item);
  return (
    <span className={`media ${className ?? ''}`} style={style} data-placeholder={placeholder || undefined}>
      <img
        src={mediaSrc(item)}
        srcSet={srcSet}
        sizes={srcSet ? sizes : undefined}
        width={w}
        height={h}
        alt={item.alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : undefined}
        style={{ objectPosition: item.focal ?? '50% 50%' }}
        draggable={false}
      />
      {placeholder && badge && site.showPlaceholderBadges && (
        <span className="media__badge" aria-hidden="true">
          رسم توضيحي مؤقت
        </span>
      )}
    </span>
  );
}
