// URL helpers for uploaded media.
//
// In production the R2 bucket is exposed on the cdn.balizen.ro custom hostname
// (payload.config.ts wires the same base into storage-r2's generateFileURL).
// That hostname only attaches at cutover, so in dev/preview nothing resolves
// there — Payload's own file route serves both originals and the pre-sized
// webp variant keys, so every asset URL has to go through assetUrl().
export const CDN_BASE = 'https://cdn.balizen.ro'

// Payload's local file route. Keys are the stored filenames, variants included
// (e.g. "4_maini_1-640.webp").
const LOCAL_MEDIA_ROUTE = '/api/media/file'

const useCdn = process.env.NODE_ENV === 'production'

export const assetUrl = (key: string): string =>
  useCdn ? `${CDN_BASE}/${key}` : `${LOCAL_MEDIA_ROUTE}/${key}`

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
  // Payload already resolves `url` per environment (CDN in prod via
  // generateFileURL, the local route in dev); only synthesize when it is absent.
  if (media.url) return media.url
  return media.filename ? assetUrl(media.filename) : ''
}
