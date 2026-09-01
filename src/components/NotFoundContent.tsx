'use client'

import { useEffect } from 'react'

import SectionEyebrow from '@/components/SectionEyebrow'
import { getTranslations, type Lang } from '@/i18n'

type Props = {
  lang: Lang
}

// Shared 404 UI, rendered by src/app/not-found.tsx inside Next's built-in
// minimal layout. The language comes from the x-balizen-locale request header
// the proxy stamps (usePathname is unreliable while a 404 renders, since the
// boundary runs under the internal /_not-found route, not the requested URL).
// The <html> of that built-in layout carries no lang attribute, so it is set
// here on the client for screen readers.
export default function NotFoundContent({ lang }: Props) {
  const t = getTranslations(lang).notFound

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  return (
    <section className="flex min-h-[60vh] items-center bg-cream">
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-16 text-center sm:px-6">
        <SectionEyebrow>{t.tagline}</SectionEyebrow>
        <h1 className="mt-5 font-heading text-6xl font-semibold leading-none text-ink sm:text-7xl">
          {t.title}
        </h1>
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
