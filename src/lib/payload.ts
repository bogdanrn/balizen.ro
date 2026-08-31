import { getPayload } from 'payload'
import config from '@payload-config'
import { cache } from 'react'

import type { Lang } from '@/i18n'

export const getPayloadClient = cache(async () => getPayload({ config }))

// Every query passes the route locale; missing translations fall back to ro.
export const getSiteConfig = cache(async (locale: Lang) => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-config', locale, fallbackLocale: 'ro' })
})

export const getAnnouncement = cache(async (locale: Lang) => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'announcement', locale, fallbackLocale: 'ro' })
})

export const getHomepage = cache(async (locale: Lang) => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'homepage', locale, fallbackLocale: 'ro' })
})

export const getServicesByCategory = cache(async (locale: Lang) => {
  const payload = await getPayloadClient()
  const categories = await payload.find({
    collection: 'service-categories',
    locale,
    fallbackLocale: 'ro',
    sort: '_order',
    limit: 100,
  })
  const services = await payload.find({
    collection: 'services',
    locale,
    fallbackLocale: 'ro',
    limit: 500,
    depth: 1,
  })

  return categories.docs.map((category) => ({
    ...category,
    services: services.docs
      .filter((service) => {
        const cat = service.category
        return (typeof cat === 'object' ? cat.id : cat) === category.id
      })
      // legacy sort: modifiedDate desc, then the admin drag order.
      // `_order` is Payload's fractional index (a base-36 string added by
      // `orderable: true`), so it compares lexicographically, not numerically.
      .sort((a, b) => {
        const dateDiff = new Date(b.modifiedDate).getTime() - new Date(a.modifiedDate).getTime()
        if (dateDiff !== 0) return dateDiff
        const aOrder = a._order ?? ''
        const bOrder = b._order ?? ''
        return aOrder < bOrder ? -1 : aOrder > bOrder ? 1 : 0
      }),
  }))
})

export const getReviews = cache(async () => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'reviews',
    sort: '-date',
    limit: 100,
  })
  return result.docs
})

export const getFaqs = cache(async (locale: Lang) => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'faqs',
    locale,
    fallbackLocale: 'ro',
    sort: '_order',
    limit: 100,
  })
  return result.docs
})

export const getSubscriptions = cache(async (locale: Lang) => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'subscriptions',
    locale,
    fallbackLocale: 'ro',
    sort: '_order',
    limit: 100,
    depth: 1,
  })
  return result.docs
})

export const getLocations = cache(async (locale: Lang) => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'locations',
    locale,
    fallbackLocale: 'ro',
    sort: '_order',
    limit: 100,
  })
  return result.docs
})

export const getExceptionalHours = cache(async (locale: Lang) => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'exceptional-hours',
    locale,
    fallbackLocale: 'ro',
    sort: 'date',
    limit: 100,
  })
  return result.docs
})

// A service is "New" for 2 months after its modifiedDate (CONTEXT.md).
export const isNewService = (modifiedDate: string, now = new Date()) => {
  const twoMonthsAgo = new Date(now)
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2)
  return new Date(modifiedDate) >= twoMonthsAgo
}
