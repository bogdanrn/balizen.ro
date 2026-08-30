// CDN URL helpers for media served from the cdn.balizen.ro R2 public hostname.
export const CDN_BASE = 'https://cdn.balizen.ro'

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
  if (media.url) return media.url
  return `${CDN_BASE}/${media.filename}`
}
