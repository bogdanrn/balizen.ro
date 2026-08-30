import localFont from 'next/font/local'
import { notFound } from 'next/navigation'
import React from 'react'

import '../../globals.css'

import ConsentAnalytics from '@/components/ConsentAnalytics'
import ConsentBanner from '@/components/ConsentBanner'
import JsonLd from '@/components/JsonLd'
import SiteInteractions from '@/components/SiteInteractions'
import SiteFooter from '@/components/layout/SiteFooter'
import SiteHeader from '@/components/layout/SiteHeader'
import { getTranslations, type Lang } from '@/i18n'
import { getLocations, getServicesByCategory, getSiteConfig, isNewService } from '@/lib/payload'

const sourceSans = localFont({
  src: [
    { path: '../../fonts/source-sans-pro-latin-ext-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../../fonts/source-sans-pro-latin-ext-600-normal.woff2', weight: '600', style: 'normal' },
    { path: '../../fonts/source-sans-pro-latin-ext-700-normal.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-source-sans',
  display: 'swap',
})

const cormorant = localFont({
  src: [
    { path: '../../fonts/cormorant-garamond-latin-ext-500-normal.woff2', weight: '500', style: 'normal' },
    { path: '../../fonts/cormorant-garamond-latin-ext-600-normal.woff2', weight: '600', style: 'normal' },
    { path: '../../fonts/cormorant-garamond-latin-ext-700-normal.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-cormorant',
  display: 'swap',
})

// CMS edits must be visible within seconds: render per request, no ISR.
export const dynamic = 'force-dynamic'

// Consent Mode v2 default: everything denied until the visitor chooses.
// Must run before any Google/Meta script; the loaders live in ConsentAnalytics.
const CONSENT_DEFAULT_SNIPPET = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = window.gtag || gtag;
gtag('consent', 'default', {
  ad_storage: 'denied',
  analytics_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  wait_for_update: 500,
});
`

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (locale !== 'ro' && locale !== 'en') notFound()
  const lang = locale as Lang
  const t = getTranslations(lang)

  const [siteConfig, locations, categories] = await Promise.all([
    getSiteConfig(lang),
    getLocations(lang),
    getServicesByCategory(lang),
  ])
  const hasNewServices = categories.some((c) => c.services.some((s) => isNewService(s.modifiedDate)))

  return (
    <html lang={lang} className={`${sourceSans.variable} ${cormorant.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULT_SNIPPET }} />
        <JsonLd lang={lang} />
      </head>
      <body className="flex min-h-screen flex-col bg-white font-sans text-slate-900 antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[130] focus:bg-white focus:px-4 focus:py-2"
        >
          {t.skipToContent}
        </a>
        <SiteHeader lang={lang} siteConfig={siteConfig} hasNewServices={hasNewServices} />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <SiteFooter lang={lang} siteConfig={siteConfig} locations={locations} />
        <SiteInteractions lang={lang} bookingUrl={siteConfig.bookingUrl} />
        <ConsentBanner lang={lang} />
        <ConsentAnalytics />
      </body>
    </html>
  )
}
