import { getFaqs, getLocations, getReviews, getServicesByCategory, getSiteConfig } from '@/lib/payload'
import { buildJsonLd } from '@/lib/schema'
import type { Lang } from '@/i18n'

// Emits the six JSON-LD blocks. Runs per request (force-dynamic), so ratings
// and content are always current.
export default async function JsonLd({ lang }: { lang: Lang }) {
  const [siteConfig, categories, reviews, faqs, locations] = await Promise.all([
    getSiteConfig(lang),
    getServicesByCategory(lang),
    getReviews(),
    getFaqs(lang),
    getLocations(lang),
  ])

  const schemas = buildJsonLd({ lang, siteConfig, categories, reviews, faqs, locations })

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={(schema as Record<string, unknown>)['@id'] as string ?? `${schema['@type']}-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  )
}
