import type { Faq, Location, Review, Service, ServiceCategory, SiteConfig } from '@/payload-types'

import { CDN_BASE } from './cdn'

const SITE_URL = 'https://balizen.ro'
const SOCIAL_SAME_AS = [
  'https://www.instagram.com/balizen.ro',
  'https://www.facebook.com/balizen.ro',
  'https://tiktok.com/@balizen.ro',
]

type Args = {
  lang: 'ro' | 'en'
  siteConfig: SiteConfig
  categories: (ServiceCategory & { services: Service[] })[]
  reviews: Review[]
  faqs: Faq[]
  locations: Location[]
}

// Builds the six JSON-LD blocks the legacy SchemaMarkup.astro emitted, now
// sourced from the CMS. Address/geo/opening hours come from the primary
// location; aggregate rating is computed per request (legacy froze it at
// build time). Fixes the legacy broken /images/logo.png and balizen_1.jpg refs.
export function buildJsonLd({ lang, siteConfig, categories, reviews, faqs, locations }: Args) {
  const primary = locations.find((l) => l.primary) ?? locations[0]
  const allServices = categories.flatMap((c) => c.services)

  const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0)
  const avgRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : undefined

  // Schedule is free text ("Luni - Duminică: 10:00 - 21:00"); extract the
  // hours for the machine-readable spec, falling back to the known schedule.
  const hoursMatch = primary?.schedule?.match(/(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/)
  const openingHoursSpecification = [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: hoursMatch?.[1] ?? '10:00',
      closes: hoursMatch?.[2] ?? '21:00',
    },
  ]

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'HealthAndBeautyBusiness',
    '@id': `${SITE_URL}/#business`,
    name: siteConfig.name,
    alternateName: 'Bali Zen Massage Studio',
    legalName: siteConfig.legalName,
    description: siteConfig.description,
    url: SITE_URL,
    logo: `${SITE_URL}/images/balizen_logo_color.png`,
    // JSON-LD must carry absolute production URLs in every environment, so this
    // deliberately uses CDN_BASE directly rather than the env-aware assetUrl().
    image: [`${SITE_URL}/images/balizen_50.jpg`, `${CDN_BASE}/balizen_1.jpg`],
    telephone: siteConfig.phone,
    email: siteConfig.email,
    priceRange: '$$',
    currenciesAccepted: 'RON',
    paymentAccepted: 'Cash, Card',
    address: {
      '@type': 'PostalAddress',
      streetAddress: primary?.address,
      addressLocality: 'Ploiești',
      addressRegion: 'Prahova',
      postalCode: '100000',
      addressCountry: 'RO',
    },
    geo:
      primary?.geoLat && primary?.geoLng
        ? { '@type': 'GeoCoordinates', latitude: primary.geoLat, longitude: primary.geoLng }
        : undefined,
    openingHoursSpecification,
    aggregateRating: avgRating
      ? {
          '@type': 'AggregateRating',
          ratingValue: avgRating,
          reviewCount: reviews.length,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined,
    review: reviews.slice(0, 5).map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.author },
      reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5, worstRating: 1 },
      reviewBody: r.text,
      datePublished: r.date,
    })),
    sameAs: SOCIAL_SAME_AS,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: lang === 'ro' ? 'Servicii de Masaj' : 'Massage Services',
      itemListElement: allServices.slice(0, 10).map((service, index) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: service.title, description: service.description },
        price: service.pricing[0]?.price,
        priceCurrency: 'RON',
        availability: 'https://schema.org/InStock',
        url: `${SITE_URL}/#servicii`,
        position: index + 1,
      })),
    },
    areaServed: {
      '@type': 'City',
      name: 'Ploiești',
      containedInPlace: { '@type': 'AdministrativeArea', name: 'Prahova' },
    },
    knowsLanguage: ['ro', 'en'],
    slogan: siteConfig.tagline,
  }

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/images/balizen_logo_color.png`,
      width: 512,
      height: 512,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: siteConfig.phone,
      contactType: 'customer service',
      availableLanguage: ['Romanian', 'English'],
      areaServed: 'RO',
    },
    sameAs: SOCIAL_SAME_AS,
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: siteConfig.name,
    description: siteConfig.description,
    publisher: { '@id': `${SITE_URL}/#organization` },
    inLanguage: lang === 'ro' ? 'ro-RO' : 'en-US',
    potentialAction: {
      '@type': 'ReserveAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: siteConfig.bookingUrl,
        actionPlatform: ['http://schema.org/DesktopWebPlatform', 'http://schema.org/MobileWebPlatform'],
      },
      result: { '@type': 'Reservation', name: lang === 'ro' ? 'Programare masaj' : 'Massage booking' },
    },
  }

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${SITE_URL}/#services`,
    name: lang === 'ro' ? 'Servicii de Masaj Bali Zen' : 'Bali Zen Massage Services',
    itemListElement: allServices.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        '@id': `${SITE_URL}/#service-${service.title.toLowerCase().replace(/\s+/g, '-')}`,
        name: service.title,
        description: service.description,
        areaServed: { '@type': 'City', name: 'Ploiești' },
        offers: service.pricing.map((p) => ({
          '@type': 'Offer',
          price: p.price,
          priceCurrency: 'RON',
          eligibleDuration: { '@type': 'QuantitativeValue', value: p.duration, unitCode: 'MIN' },
          availability: 'https://schema.org/InStock',
        })),
      },
    })),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: lang === 'ro' ? 'Acasă' : 'Home', item: SITE_URL },
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }

  return [localBusinessSchema, organizationSchema, websiteSchema, serviceSchema, breadcrumbSchema, faqSchema]
}
