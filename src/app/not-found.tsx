import { headers } from 'next/headers'
import localFont from 'next/font/local'
import type { Metadata } from 'next'

import NotFoundContent from '@/components/NotFoundContent'
import type { Lang } from '@/i18n'

import './globals.css'

// Global 404 for every URL that matches no route. The frontend routes are all
// static ((ro) group at the root, (en) group under /en), so anything else —
// typos, deep paths, invalid locales — lands here, wrapped by Next's built-in
// minimal layout. Styles and fonts must be self-imported for that reason.
// The language comes from the x-balizen-locale header the proxy stamps
// (usePathname is unreliable while a 404 renders); dotted paths bypass the
// proxy and default to ro, which is fine — they are bots and tooling.
// noindex is added automatically for 404 responses.
const sourceSans = localFont({
  src: [
    { path: './fonts/source-sans-pro-latin-ext-400-normal.woff2', weight: '400', style: 'normal' },
    { path: './fonts/source-sans-pro-latin-ext-600-normal.woff2', weight: '600', style: 'normal' },
    { path: './fonts/source-sans-pro-latin-ext-700-normal.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-source-sans',
  display: 'swap',
})

const cormorant = localFont({
  src: [
    {
      path: './fonts/cormorant-garamond-latin-ext-500-normal.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/cormorant-garamond-latin-ext-600-normal.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fonts/cormorant-garamond-latin-ext-700-normal.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-cormorant',
  display: 'swap',
})

export const metadata: Metadata = {
  title: '404',
}

export default async function NotFound() {
  const lang: Lang = (await headers()).get('x-balizen-locale') === 'en' ? 'en' : 'ro'

  return (
    <div
      className={`${sourceSans.variable} ${cormorant.variable} min-h-screen bg-cream font-sans text-ink antialiased`}
    >
      <NotFoundContent lang={lang} />
    </div>
  )
}
