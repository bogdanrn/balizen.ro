'use client'

import { usePathname } from 'next/navigation'

import SectionEyebrow from '@/components/SectionEyebrow'
import { getTranslations, type Lang } from '@/i18n'

// not-found.tsx receives no route params, so the locale comes from the URL.
export default function NotFound() {
  const pathname = usePathname() ?? '/'
  const lang: Lang = pathname.startsWith('/en') ? 'en' : 'ro'
  const t = getTranslations(lang).notFound

  return (
    <section className="flex min-h-[60vh] items-center bg-cream">
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-16 text-center sm:px-6">
        <SectionEyebrow>{t.tagline}</SectionEyebrow>
        <h1 className="mt-5 font-heading text-6xl font-semibold leading-none text-ink sm:text-7xl">{t.title}</h1>
        <p className="mt-6 max-w-prose text-lg leading-relaxed text-muted-warm">{t.body}</p>
        <a
          href={lang === 'en' ? '/en' : '/'}
          className="btn-primary mt-10 text-sm font-semibold uppercase tracking-wide"
        >
          {t.back}
        </a>
      </div>
    </section>
  )
}
