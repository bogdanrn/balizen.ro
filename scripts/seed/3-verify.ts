import { getSeedPayload, log } from './lib/context'

// Sanity checks after seeding: doc counts per collection and media URL shape.
// Matches payload.config.ts: a custom domain on the bucket means absolute CDN
// URLs, otherwise Payload's own file route.
const cdnHost = process.env.R2_CUSTOM_CDN_DOMAIN?.replace(/^https?:\/\//, '').replace(/\/$/, '')
const expectedUrlPrefix = cdnHost ? `https://${cdnHost}/` : '/api/media/file/'

async function main() {
  const payload = await getSeedPayload()

  for (const slug of ['media', 'service-categories', 'services', 'reviews', 'faqs', 'subscriptions', 'locations', 'exceptional-hours'] as const) {
    const ro = await payload.find({ collection: slug, locale: 'ro', limit: 0 })
    const en = await payload.find({ collection: slug, locale: 'en', limit: 0 })
    log(`${slug}: ro=${ro.totalDocs} en=${en.totalDocs}`)
  }

  const media = await payload.find({ collection: 'media', limit: 5 })
  for (const doc of media.docs) {
    if (!String(doc.url).startsWith(expectedUrlPrefix)) {
      throw new Error(`media ${doc.id} has unexpected url: ${doc.url}`)
    }
  }
  const withVariants = media.docs.filter((d: any) => Array.isArray(d.variants) && d.variants.length > 0).length
  log(`media url prefix ${expectedUrlPrefix} OK (sampled 5); with variants in sample: ${withVariants}`)

  const homepage = await payload.findGlobal({ slug: 'homepage', locale: 'ro' })
  const siteConfig = await payload.findGlobal({ slug: 'site-config', locale: 'ro' })
  if (!homepage.heroTitle || !siteConfig.phone) throw new Error('globals look empty')
  log('globals OK')

  log(`verify complete`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
