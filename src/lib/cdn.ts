// URL helpers for uploaded media.
//
// Two shapes, decided by whether the R2 bucket has a public custom domain
// attached (R2_CUSTOM_CDN_DOMAIN, wired into storage-s3's generateFileURL in
// payload.config.ts):
//
//   with a CDN domain: https://cdn-balizen.chuckle-cloud.com/<key>, straight
//     from the bucket, this server never sees the request;
//   without one: /api/media/file/<key>, streamed out of the bucket by Payload's
//     file route on this domain and cached at the edge (next.config.ts).
//
// Variant keys (the pre-sized webp renditions) have no media doc of their own,
// so they cannot get a URL from Payload. They are built from whatever base the
// parent doc's `url` already uses, which keeps them correct in client
// components too, where the env var does not exist.
const MEDIA_ROUTE = '/api/media/file'

const CDN_HOST = process.env.R2_CUSTOM_CDN_DOMAIN?.replace(/^https?:\/\//, '').replace(/\/$/, '')

const SITE_ORIGIN = 'https://balizen.ro'

export const assetUrl = (key: string): string =>
  CDN_HOST ? `https://${CDN_HOST}/${key}` : `${MEDIA_ROUTE}/${key}`

// Absolute form, for JSON-LD and other places that must not emit a relative URL.
export const absoluteAssetUrl = (key: string): string =>
  CDN_HOST ? `https://${CDN_HOST}/${key}` : `${SITE_ORIGIN}${MEDIA_ROUTE}/${key}`

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
  // Payload already resolves `url` for the current environment; only synthesize
  // when it is absent.
  if (media.url) return media.url
  return media.filename ? assetUrl(media.filename) : ''
}

// URL for one variant key, on the same base as the parent doc's own URL.
export function variantUrl(media: CdnMedia, key: string): string {
  const url = media.url
  if (url) {
    const slash = url.lastIndexOf('/')
    if (slash > 0) return `${url.slice(0, slash)}/${key}`
  }
  return assetUrl(key)
}
