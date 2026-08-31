import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import AboutSection from '@/components/sections/AboutSection'
import CallToActionSection from '@/components/sections/CallToActionSection'
import GiftCardSection from '@/components/sections/GiftCardSection'
import HeroSection from '@/components/sections/HeroSection'
import LocationSection from '@/components/sections/LocationSection'
import ReviewsSection from '@/components/sections/ReviewsSection'
import ServicesSection from '@/components/sections/ServicesSection'
import SubscriptionsSection from '@/components/sections/SubscriptionsSection'
import type { Lang } from '@/i18n'
import {
  getHomepage,
  getLocations,
  getReviews,
  getServicesByCategory,
  getSiteConfig,
  getSubscriptions,
} from '@/lib/payload'

const SITE_URL = 'https://balizen.ro'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const lang = (locale === 'en' ? 'en' : 'ro') as Lang
  const [siteConfig, homepage] = await Promise.all([getSiteConfig(lang), getHomepage(lang)])

  const canonical = lang === 'en' ? `${SITE_URL}/en` : `${SITE_URL}/`

  return {
    title: `${siteConfig.name} · ${siteConfig.tagline}`,
    description: homepage.heroSubtitle?.[0]?.line ?? siteConfig.description,
    alternates: {
      canonical,
      languages: {
        ro: `${SITE_URL}/`,
        en: `${SITE_URL}/en`,
        'x-default': `${SITE_URL}/`,
      },
    },
    openGraph: {
      title: `${siteConfig.name} · ${siteConfig.tagline}`,
      description: siteConfig.description,
      url: canonical,
      siteName: siteConfig.name,
      locale: lang === 'ro' ? 'ro_RO' : 'en_US',
      images: [{ url: `${SITE_URL}/images/balizen_50.jpg` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${siteConfig.name} · ${siteConfig.tagline}`,
      description: siteConfig.description,
      images: [`${SITE_URL}/images/balizen_50.jpg`],
    },
  }
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (locale !== 'ro' && locale !== 'en') notFound()
  const lang = locale as Lang

  const [siteConfig, homepage, categories, subscriptions, reviews, locations] = await Promise.all([
    getSiteConfig(lang),
    getHomepage(lang),
    getServicesByCategory(lang),
    getSubscriptions(lang),
    getReviews(),
    getLocations(lang),
  ])

  return (
    <>
      <HeroSection lang={lang} homepage={homepage} siteConfig={siteConfig} />
      <AboutSection lang={lang} homepage={homepage} />
      <ServicesSection lang={lang} homepage={homepage} categories={categories} siteConfig={siteConfig} />
      <SubscriptionsSection lang={lang} homepage={homepage} subscriptions={subscriptions} siteConfig={siteConfig} />
      <GiftCardSection lang={lang} homepage={homepage} />
      <ReviewsSection lang={lang} reviews={reviews} siteConfig={siteConfig} />
      <CallToActionSection lang={lang} homepage={homepage} />
      <LocationSection lang={lang} homepage={homepage} locations={locations} siteConfig={siteConfig} />
    </>
  )
}
