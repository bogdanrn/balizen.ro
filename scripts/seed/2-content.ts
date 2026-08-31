import fs from 'fs'
import path from 'path'
import { getSeedPayload, isRemote, LEGACY_DIR, log, OUT_DIR } from './lib/context'
import { seedGlobals, seedSubscriptions, setImageMap } from './lib/seed-globals'

// Imports the legacy JSON content (ro + en) into D1 via the Payload local API.
// Run 1-images.ts first: image references resolve through out/image-map.json.

const readJson = (rel: string) => JSON.parse(fs.readFileSync(path.join(LEGACY_DIR, rel), 'utf8'))
const imageMap = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'image-map.json'), 'utf8'))

const mediaId = (src?: string): number | undefined => {
  if (!src) return undefined
  const entry = imageMap[path.basename(src)]
  if (!entry) throw new Error(`image not migrated: ${src}`)
  return Number(entry.id)
}

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

// FAQ content previously hardcoded in SchemaMarkup.astro (5 RO, 3 EN).
const FAQS_RO = [
  {
    question: 'Care este programul de funcționare Bali Zen?',
    answer: 'Locația noastră (Str. Gh Gr Cantacuzino 190 1B) este deschisă Luni - Duminică: 10:00 - 21:00.',
  },
  {
    question: 'Cum pot face o programare pentru masaj?',
    answer:
      'Puteți face o programare online pe programari.balizen.ro, prin telefon la 0733-211-325, prin WhatsApp sau prin email la contact@balizen.ro.',
  },
  {
    question: 'Ce tipuri de masaj oferă Bali Zen?',
    answer:
      'Oferim o gamă variată de masaje: Autentic Balinez, Bali Zen Signature, LOMI LOMI, Thai, Deep Tissue, Hot Stone, Aroma Therapy, Anticelulitic, masaj prenatal (Mom To Be), și masaje locale pentru spate, umeri, cap și picioare.',
  },
  {
    question: 'Cât costă un masaj la Bali Zen?',
    answer:
      'Prețurile variază în funcție de tipul și durata masajului. Masajele locale încep de la 110 RON (30 min), iar masajele full body de la 200 RON (60 min). Consultați lista noastră completă de servicii pentru detalii.',
  },
  {
    question: 'Bali Zen oferă carduri cadou?',
    answer:
      'Da, oferim carduri cadou pentru orice tip de masaj sau valoare. Cardurile cadou sunt perfecte pentru a oferi o experiență de relaxare celor dragi.',
  },
]
const FAQS_EN = [
  {
    question: 'What are Bali Zen opening hours?',
    answer: 'Our location (Str. Gh Gr Cantacuzino 190 1B) is open Monday - Sunday: 10:00 - 21:00.',
  },
  {
    question: 'How can I book a massage?',
    answer:
      'You can book online at programari.balizen.ro, by phone at +40 733 211 325, via WhatsApp, or by email at contact@balizen.ro.',
  },
  {
    question: 'What types of massage does Bali Zen offer?',
    answer:
      'We offer a wide range of massages: Authentic Balinese, Bali Zen Signature, LOMI LOMI, Thai, Deep Tissue, Hot Stone, Aroma Therapy, Anti-cellulite, prenatal massage (Mom To Be), and local massages for back, shoulders, head, and feet.',
  },
]

async function main() {
  const payload = await getSeedPayload()

  const siteRo = readJson('src/data/site.json')
  const siteEn = readJson('src/data/en/site.json')
  const homeRo = readJson('src/data/homepage.json')
  const homeEn = readJson('src/data/en/homepage.json')
  const servicesRo = readJson('src/data/services.json')
  const servicesEn = readJson('src/data/en/services.json')
  const reviews = readJson('src/data/reviews.json')

  // --- admin user (optional, env-driven) ---
  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    await payload.create({
      collection: 'users',
      data: { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD },
    })
    log('admin user created:', process.env.ADMIN_EMAIL)
  }

  // --- service categories + services ---
  const roCategories = Object.keys(servicesRo)
  const enCategories = Object.keys(servicesEn)
  for (let i = 0; i < roCategories.length; i++) {
    const category = await payload.create({
      collection: 'service-categories',
      data: { name: roCategories[i] },
    })
    await payload.update({
      collection: 'service-categories',
      id: category.id,
      locale: 'en',
      data: { name: enCategories[i] },
    })

    const roItems = [...servicesRo[roCategories[i]]].sort((a: any, b: any) => a.order - b.order)
    const enItems = [...servicesEn[enCategories[i]]].sort((a: any, b: any) => a.order - b.order)
    for (let j = 0; j < roItems.length; j++) {
      const ro = roItems[j]
      const en = enItems[j]
      const service = await payload.create({
        collection: 'services',
        data: {
          title: ro.title,
          description: ro.description,
          category: category.id,
          pricing: ro.pricing.map((p: any) => ({ price: String(p.price), duration: p.duration })),
          image: mediaId(ro.image?.src),
          modifiedDate: ro.modifiedDate ? new Date(ro.modifiedDate).toISOString() : undefined,
        },
      })
      await payload.update({
        collection: 'services',
        id: service.id,
        locale: 'en',
        data: { title: en.title, description: en.description },
      })
      // carry the JSON alt text onto the media doc
      if (ro.image?.src && ro.image?.alt) {
        const id = mediaId(ro.image.src)!
        await payload.update({ collection: 'media', id, data: { alt: ro.image.alt } })
        if (en.image?.alt) await payload.update({ collection: 'media', id, locale: 'en', data: { alt: en.image.alt } })
      }
    }
    log(`category ${roCategories[i]}: ${roItems.length} services`)
  }

  // --- reviews ---
  for (const r of reviews) {
    await payload.create({
      collection: 'reviews',
      data: { author: r.author, text: r.text, rating: r.rating, date: new Date(r.date).toISOString() },
    })
  }
  log(`reviews: ${reviews.length}`)

  // --- faqs ---
  for (let i = 0; i < FAQS_RO.length; i++) {
    const faq = await payload.create({
      collection: 'faqs',
      data: { question: FAQS_RO[i].question, answer: FAQS_RO[i].answer },
    })
    if (FAQS_EN[i]) {
      await payload.update({
        collection: 'faqs',
        id: faq.id,
        locale: 'en',
        data: { question: FAQS_EN[i].question, answer: FAQS_EN[i].answer },
      })
    }
  }
  log(`faqs: ${FAQS_RO.length}`)

  // --- subscriptions: id-preserving per-locale writer (localized array children) ---
  setImageMap(imageMap)
  await seedSubscriptions(payload, log)

  // --- locations ---
  for (let i = 0; i < homeRo.location.locations.length; i++) {
    const ro = homeRo.location.locations[i]
    const en = homeEn.location.locations[i] ?? {}
    const loc = await payload.create({
      collection: 'locations',
      data: {
        name: ro.name,
        address: ro.address,
        schedule: ro.schedule,
        phone: ro.phone,
        phoneHref: ro.phoneHref,
        email: homeRo.location.email,
        mapsUrl: ro.mapsUrl,
        mapsEmbedUrl: ro.mapsEmbedUrl,
        geoLat: 44.9364,
        geoLng: 26.0325,
        primary: i === 0,
      },
    })
    await payload.update({
      collection: 'locations',
      id: loc.id,
      locale: 'en',
      data: {
        address: en.address ?? ro.address,
        schedule: en.schedule ?? ro.schedule,
        mapsEmbedUrl: en.mapsEmbedUrl ?? ro.mapsEmbedUrl,
      },
    })
  }
  log(`locations: ${homeRo.location.locations.length}`)

  // --- globals (site-config, homepage): id-preserving per-locale writer ---
  setImageMap(imageMap)
  await seedGlobals(payload, log)

  // carry hero/about/giftCard alt texts onto media docs (ro + en)
  for (const pair of [
    [homeRo.hero.image, homeEn.hero.image],
    [homeRo.about.image, homeEn.about.image],
    [homeRo.giftCard.image, homeEn.giftCard.image],
  ] as const) {
    const [ro, en] = pair as unknown as any[]
    if (ro?.src && ro?.alt) {
      const id = mediaId(ro.src)!
      await payload.update({ collection: 'media', id, data: { alt: ro.alt } })
      if (en?.alt) await payload.update({ collection: 'media', id, locale: 'en', data: { alt: en.alt } })
    }
  }

  log(`content seed complete. remote=${isRemote}`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
