// URL helpers for uploaded media.
//
// Every asset is served from this domain through Payload's own file route,
// which streams the object straight out of the R2 bucket by key (see the
// s3Storage block in payload.config.ts). Variant keys work the same way even
// though they have no media doc. Cloudflare caches the route at the edge
// (Cache-Control set in next.config.ts), so there is no separate CDN hostname.
const MEDIA_ROUTE = '/api/media/file'

export const assetUrl = (key: string): string => `${MEDIA_ROUTE}/${key}`

// Absolute form, for JSON-LD and other places that must not emit a relative URL.
export const absoluteAssetUrl = (key: string): string => `https://balizen.ro${assetUrl(key)}`

export type MediaVariant = { key: string; width: number; height: number }

export type CdnMedia = {
  filename?: string | null
  url?: string | null
  width?: number | null
  height?: number | null
  alt?: string | null
  variants?: unknown
}

export function mediaVariants(media: CdnMedia): MediaVariant[] {
  return Array.isArray(media.variants) ? (media.variants as MediaVariant[]) : []
}

export function mediaUrl(media: CdnMedia): string {
  // Payload already resolves `url` to the file route; only synthesize when
  // it is absent.
  if (media.url) return media.url
  return media.filename ? assetUrl(media.filename) : ''
}
