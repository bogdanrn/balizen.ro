'use client'

import { usePathname } from 'next/navigation'

import { getTranslations, type Lang } from '@/i18n'

// not-found.tsx receives no route params, so the locale comes from the URL.
export default function NotFound() {
  const pathname = usePathname() ?? '/'
  const lang: Lang = pathname.startsWith('/en') ? 'en' : 'ro'
  const t = getTranslations(lang).notFound

  return (
    <section className="flex min-h-[60vh] items-center bg-slate-50">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-6 px-4 text-center sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">{t.tagline}</p>
        <h1 className="font-heading text-6xl font-bold text-slate-900 sm:text-7xl">{t.title}</h1>
        <p className="text-lg text-slate-600">{t.body}</p>
        <a
          href={lang === 'en' ? '/en' : '/'}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:opacity-90"
        >
          {t.back}
        </a>
      </div>
    </section>
  )
}
