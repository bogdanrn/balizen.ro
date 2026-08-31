import type { MetadataRoute } from 'next'

import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

const SITE_URL = 'https://balizen.ro'
const LEGAL = ['privacy-policy', 'terms-policy', 'return-policy', 'cancellation-policy']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()
  const services = await payload.find({ collection: 'services', sort: '-updatedAt', limit: 1 })
  const lastmod = services.docs[0]?.updatedAt ?? new Date().toISOString()

  const urls = ['', ...LEGAL.map((slug) => `/${slug}`)]

  // Both locales get their own <url> entry; the hreflang alternates cluster is
  // identical on each so Google pairs them either way it crawls in.
  return urls.flatMap((path) => {
    const alternates = {
      languages: {
        ro: `${SITE_URL}${path || '/'}`,
        en: `${SITE_URL}/en${path}`,
        'x-default': `${SITE_URL}${path || '/'}`,
      },
    }
    return [
      { url: `${SITE_URL}${path || '/'}`, lastModified: lastmod, alternates },
      { url: `${SITE_URL}/en${path}`, lastModified: lastmod, alternates },
    ]
  })
}
