'use client'

import { usePathname, useSearchParams } from 'next/navigation'

import { getAlternateLocalePath, LANGUAGES, type Lang } from '@/i18n'

// Single link to the OTHER locale, keeping the current page. Client-side only
// because it needs usePathname; rendered from server components via `lang`.
export default function LanguageSwitcherLink({ lang }: { lang: Lang }) {
  const pathname = usePathname()
  // Carried over so shareable state survives the switch (?service=<id> keeps
  // the service modal open on the other locale).
  const query = useSearchParams().toString()
  const other: Lang = lang === 'ro' ? 'en' : 'ro'
  const data = LANGUAGES[other]

  return (
    <a
      href={`${getAlternateLocalePath(pathname, lang)}${query ? `?${query}` : ''}`}
      // bg-current/10 rather than a fixed black/white tint so the hover reads
      // on the light header and the ink footer alike.
      className="flex min-h-11 items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-current transition-colors hover:bg-current/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      aria-label={`Switch to ${data.label}`}
    >
      <span className="text-lg">{data.flag}</span>
      <span>{data.label}</span>
    </a>
  )
}
