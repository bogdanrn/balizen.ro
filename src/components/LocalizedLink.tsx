import Link from 'next/link'
import type { ReactNode } from 'react'

import { getLocalizedPath, type Lang } from '@/i18n'

// External URLs (https:, tel:, mailto:) and pure anchors (#servicii) pass
// through untouched; internal paths get the locale prefix ("/#servicii" ->
// "/en/#servicii", "/privacy-policy" -> "/en/privacy-policy"). Paths already
// carrying the locale prefix pass through (CMS content like the en disclaimer
// links embeds "/en/..." hrefs already).
export function resolveLocalizedHref(href: string, lang: Lang): string {
  if (/^(https?:|tel:|mailto:)/i.test(href)) return href
  if (href.startsWith('#')) return href
  if (href.startsWith('/')) {
    if (new RegExp(`^/${lang}(?=/|$)`).test(href)) return href
    return getLocalizedPath(href, lang)
  }
  return href
}

type Props = {
  href: string
  lang: Lang
  className?: string
  target?: string | null
  rel?: string | null
  ariaLabel?: string
  children: ReactNode
}

export default function LocalizedLink({ href, lang, className, target, rel, ariaLabel, children }: Props) {
  const resolved = resolveLocalizedHref(href, lang)
  const isInternal = resolved.startsWith('/')

  if (isInternal) {
    return (
      <Link href={resolved} className={className} target={target ?? undefined} rel={rel ?? undefined} aria-label={ariaLabel}>
        {children}
      </Link>
    )
  }

  return (
    <a href={resolved} className={className} target={target ?? undefined} rel={rel ?? undefined} aria-label={ariaLabel}>
      {children}
    </a>
  )
}
