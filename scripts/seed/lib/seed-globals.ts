import fs from 'fs'
import path from 'path'
import type { Payload } from 'payload'

import { LEGACY_DIR } from './context'

// Seeds the site-config and homepage globals.
//
// IMPORTANT: Payload array fields with localized children must be written
// ro-first, then en with the ro row ids attached. A plain second
// updateGlobal(locale: 'en') with full arrays replaces the child rows and
// wipes the ro values (observed 2026-08-30 on local + remote D1).
const readJson = (rel: string) => JSON.parse(fs.readFileSync(path.join(LEGACY_DIR, rel), 'utf8'))

const stripIcon = (icon?: string) => icon?.replace(/^tabler:/, '')

const mapAction = (a: any) =>
  a
    ? {
        label: a.label as string,
        href: a.href as string,
        variant: (a.variant === 'secondary' ? 'secondary' : 'primary') as 'primary' | 'secondary',
        icon: stripIcon(a.icon),
        target: (a.target === '_blank' ? '_blank' : '_self') as '_blank' | '_self',
        className: a.class as string | undefined,
      }
    : undefined

const mapActions = (arr?: any[]) => (arr ?? []).map(mapAction)
const lines = (arr?: string[]) => (arr ?? []).map((line) => ({ line }))

// Zip en arrays onto ro row ids so the en update patches values in place.
const withIds = (roRows: any[] | undefined, enRows: any[]) =>
  (roRows ?? []).map((row: any, i: number) => ({ id: row.id, ...enRows[i] }))

export async function seedGlobals(payload: Payload, log: (...args: any[]) => void = console.log) {
  const siteRo = readJson('src/data/site.json')
  const siteEn = readJson('src/data/en/site.json')
  const homeRo = readJson('src/data/homepage.json')
  const homeEn = readJson('src/data/en/homepage.json')

  // --- site-config ---
  const telHref = `tel:${siteRo.contact.phone.replace(/[^+\d]/g, '')}`
  await payload.updateGlobal({
    slug: 'site-config',
    locale: 'ro',
    data: {
      name: siteRo.brand.name,
      tagline: siteRo.brand.tagline,
      legalName: siteRo.brand.legalName,
      description: siteRo.brand.description,
      copyright: siteRo.brand.copyright,
      phone: siteRo.contact.phone,
      phoneHref: telHref,
      whatsappUrl: siteRo.contact.whatsapp,
      email: siteRo.contact.email,
      bookingUrl: siteRo.contact.bookingUrl,
      googleReviewsUrl: siteRo.contact.googleReviewsUrl,
      headerLinks: siteRo.header.links.map((l: any) => ({ label: l.label, href: l.href, className: l.class })),
      primaryAction: { label: siteRo.header.primaryAction.label, href: siteRo.header.primaryAction.href },
      footerColumns: siteRo.footer.columns.map((c: any) => ({
        title: c.title,
        links: c.links.map((l: any) => ({ text: l.text, href: l.href, className: l.class })),
      })),
      socialLinks: siteRo.footer.socialLinks.map((s: any) => ({ label: s.label, icon: stripIcon(s.icon), href: s.href })),
      announcementEnabled: false,
    },
  })
  const scRo = await payload.findGlobal({ slug: 'site-config', locale: 'ro' })
  await payload.updateGlobal({
    slug: 'site-config',
    locale: 'en',
    data: {
      tagline: siteEn.brand.tagline,
      description: siteEn.brand.description,
      copyright: siteEn.brand.copyright,
      headerLinks: withIds(
        scRo.headerLinks,
        siteEn.header.links.map((l: any) => ({ label: l.label, href: l.href, className: l.class })),
      ),
      primaryAction: { label: siteEn.header.primaryAction.label, href: siteEn.header.primaryAction.href },
      footerColumns: withIds(
        scRo.footerColumns,
        siteEn.footer.columns.map((c: any, i: number) => ({
          title: c.title,
          links: (scRo.footerColumns?.[i]?.links ?? []).map((row: any, j: number) => ({
            id: row.id,
            text: c.links[j]?.text,
            href: c.links[j]?.href,
            className: c.links[j]?.class,
          })),
        })),
      ).map((col: any, i: number) => ({ ...col, links: col.links ?? siteEn.footer.columns[i].links })),
    },
  })
  log('site-config global done')

  // --- homepage ---
  await payload.updateGlobal({
    slug: 'homepage',
    locale: 'ro',
    data: {
      heroTitle: homeRo.hero.title,
      heroSubtitle: lines(homeRo.hero.subtitle),
      heroText: homeRo.hero.heroText,
      heroActions: mapActions([...homeRo.hero.primaryActions, ...(homeRo.hero.secondaryActions ?? [])]),
      heroImage: mediaIdFor(homeRo.hero.image?.src),
      aboutTagline: homeRo.about.tagline,
      aboutTitle: homeRo.about.title,
      aboutIntro: homeRo.about.intro,
      aboutBullets: homeRo.about.bullets.map((b: any) => ({ title: b.title, description: b.description })),
      aboutCta: mapAction(homeRo.about.cta),
      aboutImage: mediaIdFor(homeRo.about.image?.src),
      servicesTitle: homeRo.services.title,
      servicesDescription: homeRo.services.description,
      servicesCta: mapAction(homeRo.services.cta),
      subscriptionAction: mapAction(homeRo.subscriptionAction),
      subscriptionDisclaimer: lines(homeRo.subscriptionDisclaimer),
      giftCardTitle: homeRo.giftCard.title,
      giftCardDescription: (homeRo.giftCard.description ?? []).map((paragraph: string) => ({ paragraph })),
      giftCardFeatures: homeRo.giftCard.features.map((f: any) => ({
        icon: stripIcon(f.icon),
        title: f.title,
        description: f.description,
      })),
      giftCardCta: mapAction(homeRo.giftCard.cta),
      giftCardImage: mediaIdFor(homeRo.giftCard.image?.src),
      giftCardDisclaimer: lines(homeRo.giftCard.disclaimer),
      socialTitle: homeRo.social.title,
      socialSubtitle: homeRo.social.subtitle,
      socialLinks: homeRo.social.links.map((s: any) => ({ label: s.label, handle: s.handle, href: s.href, icon: stripIcon(s.icon) })),
      ctaTitle: homeRo.callToAction.title,
      ctaSubtitle: homeRo.callToAction.subtitle,
      ctaButton: mapAction(homeRo.callToAction.cta),
      locationTitle: homeRo.location.title,
      locationEmail: homeRo.location.email,
    },
  })
  const hpRo = await payload.findGlobal({ slug: 'homepage', locale: 'ro' })
  await payload.updateGlobal({
    slug: 'homepage',
    locale: 'en',
    data: {
      heroTitle: homeEn.hero.title,
      heroSubtitle: withIds(hpRo.heroSubtitle, lines(homeEn.hero.subtitle)),
      heroText: homeEn.hero.heroText,
      heroActions: withIds(hpRo.heroActions, mapActions([...homeEn.hero.primaryActions, ...(homeEn.hero.secondaryActions ?? [])])),
      aboutTagline: homeEn.about.tagline,
      aboutTitle: homeEn.about.title,
      aboutIntro: homeEn.about.intro,
      aboutBullets: withIds(hpRo.aboutBullets, homeEn.about.bullets.map((b: any) => ({ title: b.title, description: b.description }))),
      aboutCta: mapAction(homeEn.about.cta),
      servicesTitle: homeEn.services.title,
      servicesDescription: homeEn.services.description,
      servicesCta: mapAction(homeEn.services.cta),
      subscriptionAction: mapAction(homeEn.subscriptionAction),
      subscriptionDisclaimer: withIds(hpRo.subscriptionDisclaimer, lines(homeEn.subscriptionDisclaimer)),
      giftCardTitle: homeEn.giftCard.title,
      giftCardDescription: withIds(hpRo.giftCardDescription, (homeEn.giftCard.description ?? []).map((paragraph: string) => ({ paragraph }))),
      giftCardFeatures: withIds(hpRo.giftCardFeatures, homeEn.giftCard.features.map((f: any) => ({
        icon: stripIcon(f.icon),
        title: f.title,
        description: f.description,
      }))),
      giftCardCta: mapAction(homeEn.giftCard.cta),
      giftCardDisclaimer: withIds(hpRo.giftCardDisclaimer, lines(homeEn.giftCard.disclaimer)),
      socialTitle: homeEn.social.title,
      socialSubtitle: homeEn.social.subtitle,
      socialLinks: withIds(hpRo.socialLinks, homeEn.social.links.map((s: any) => ({ label: s.label, handle: s.handle, href: s.href, icon: stripIcon(s.icon) }))),
      ctaTitle: homeEn.callToAction.title,
      ctaSubtitle: homeEn.callToAction.subtitle,
      ctaButton: mapAction(homeEn.callToAction.cta),
      locationTitle: homeEn.location.title,
    },
  })
  log('homepage global done')
}

// Same id-preserving pattern for Subscriptions: highlights[] has localized
// children, so the en update must reference the ro row ids.
export async function seedSubscriptions(payload: Payload, log: (...args: any[]) => void = console.log) {
  const homeRo = readJson('src/data/homepage.json')
  const homeEn = readJson('src/data/en/homepage.json')

  for (let i = 0; i < homeRo.subscriptions.length; i++) {
    const ro = homeRo.subscriptions[i]
    const en = homeEn.subscriptions[i]
    const sub = await payload.create({
      collection: 'subscriptions',
      data: {
        title: ro.title,
        summary: ro.summary,
        highlights: ro.highlights.map((text: string) => ({ text })),
        image: mediaIdFor(ro.image?.src),
      },
    })
    await payload.update({
      collection: 'subscriptions',
      id: sub.id,
      locale: 'en',
      data: {
        title: en.title,
        summary: en.summary,
        highlights: (sub.highlights ?? []).map((row: any, j: number) => ({ id: row.id, text: en.highlights[j] })),
      },
    })
  }
  log(`subscriptions: ${homeRo.subscriptions.length}`)
}

// Repairs EXISTING subscription docs (no duplicates): rewrites highlights
// ro-first, then patches en values onto the same row ids. Needed after the
// original seed wiped ro array values with a plain en update.
export async function repairSubscriptions(payload: Payload, log: (...args: any[]) => void = console.log) {
  const homeRo = readJson('src/data/homepage.json')
  const homeEn = readJson('src/data/en/homepage.json')
  const existing = await payload.find({ collection: 'subscriptions', sort: '_order', locale: 'ro', limit: 50 })

  for (let i = 0; i < existing.docs.length; i++) {
    const doc = existing.docs[i]
    const ro = homeRo.subscriptions[i]
    const en = homeEn.subscriptions[i]
    if (!ro || !en) continue
    await payload.update({
      collection: 'subscriptions',
      id: doc.id,
      locale: 'ro',
      data: {
        title: ro.title,
        summary: ro.summary,
        highlights: ro.highlights.map((text: string) => ({ text })),
      },
    })
    const fresh = await payload.findByID({ collection: 'subscriptions', id: doc.id, locale: 'ro' })
    await payload.update({
      collection: 'subscriptions',
      id: doc.id,
      locale: 'en',
      data: {
        title: en.title,
        summary: en.summary,
        highlights: (fresh.highlights ?? []).map((row: any, j: number) => ({ id: row.id, text: en.highlights[j] })),
      },
    })
  }
  log(`subscriptions repaired: ${existing.docs.length}`)
}

// Resolved lazily by 2-content.ts which owns the image map import.
let imageMap: Record<string, { id: string | number }> = {}
export function setImageMap(map: Record<string, { id: string | number }>) {
  imageMap = map
}
function mediaIdFor(src?: string): number | undefined {
  if (!src) return undefined
  const entry = imageMap[path.basename(src)]
  return entry ? Number(entry.id) : undefined
}
