import type { CdnMedia } from '@/lib/cdn'
import { CDN_BASE, mediaUrl, mediaVariants } from '@/lib/cdn'

type Props = {
  media: CdnMedia | number | null | undefined
  alt?: string
  sizes?: string
  className?: string
  eager?: boolean
  widths?: number[]
}

// Plain <img> with a srcset built from the pre-sized webp variants stored on
// the media doc (next/image optimization is unavailable on Workers). Media
// uploaded at runtime has no variants and renders the original.
export default function CdnImage({ media, alt, sizes, className, eager = false, widths }: Props) {
  if (!media || typeof media === 'number') return null

  const variants = mediaVariants(media)
  const wanted = widths ? variants.filter((v) => widths.includes(v.width)) : variants
  const srcSet = wanted.map((v) => `${CDN_BASE}/${v.key} ${v.width}w`).join(', ')

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={mediaUrl(media)}
      srcSet={srcSet || undefined}
      sizes={sizes ?? (srcSet ? '100vw' : undefined)}
      alt={alt ?? media.alt ?? ''}
      width={media.width ?? undefined}
      height={media.height ?? undefined}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={eager ? 'high' : 'auto'}
      className={className}
    />
  )
}
