import { getExceptionalHours, getFaqs, getLocations, getReviews, getServicesByCategory, getSiteConfig } from '@/lib/payload'
import { buildJsonLd } from '@/lib/schema'
import type { Lang } from '@/i18n'

// Emits the six JSON-LD blocks. Runs per request (force-dynamic), so ratings
// and content are always current.
export default async function JsonLd({ lang }: { lang: Lang }) {
  const [siteConfig, categories, reviews, faqs, locations, exceptionalHours] = await Promise.all([
    getSiteConfig(lang),
    getServicesByCategory(lang),
    getReviews(),
    getFaqs(lang),
    getLocations(lang),
    getExceptionalHours(lang),
  ])

  const schemas = buildJsonLd({ lang, siteConfig, categories, reviews, faqs, locations, exceptionalHours })

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={(schema as Record<string, unknown>)['@id'] as string ?? `${schema['@type']}-${index}`}
          type="application/ld+json"
          // "<" escaped per the Next JSON-LD guide so CMS text can never close
          // the script tag and inject markup.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
        />
      ))}
    </>
  )
}
