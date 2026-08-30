import { getTranslations, type Lang } from '@/i18n'
import type { SiteConfig } from '@/payload-types'

import LanguageSwitcherLink from '../LanguageSwitcherLink'
import LocalizedLink from '../LocalizedLink'
import Logo from './Logo'

type Props = {
  lang: Lang
  siteConfig: SiteConfig
  hasNewServices: boolean
}

// Port of _legacy Header.astro. The drawer toggle/drawer carry the data-*
// hooks; the interactivity script lives in a separate client component.
// The legacy primaryAction.class ("js-programari-button") has no CMS field on
// the new SiteConfig, so the analytics/modal hook is kept verbatim here.
export default function SiteHeader({ lang, siteConfig, hasNewServices }: Props) {
  const t = getTranslations(lang)
  const navLinks = siteConfig.headerLinks ?? []
  const primaryAction = siteConfig.primaryAction

  return (
    <header className="lg:sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur lg:bg-white/70">
      <div className="mx-auto flex w-full items-center justify-between gap-6 px-4 py-4 transition-all max-w-screen-xl">
        <Logo lang={lang} name={siteConfig.name} tagline={siteConfig.tagline} />

        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcherLink lang={lang} />
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            type="button"
            aria-label={lang === 'ro' ? 'Deschide meniul' : 'Open menu'}
            aria-expanded="false"
            data-nav-toggle
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              data-icon-hamburger
            >
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
            <svg
              className="h-5 w-5 hidden"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              data-icon-close
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <nav
          className="hidden flex-1 items-center justify-end gap-10 text-sm font-medium uppercase tracking-wide text-slate-700 lg:flex"
          data-nav-menu
        >
          {navLinks.map((link) => {
            const isServicesLink = link.href?.includes('servicii')
            return (
              <LocalizedLink
                key={link.id ?? link.href}
                href={link.href}
                lang={lang}
                className={`relative transition-colors hover:text-primary whitespace-nowrap ${link.className ?? ''}`.trim()}
              >
                {link.label}
                {isServicesLink && hasNewServices && (
                  <span className="nav-new-dot absolute -right-3 -top-1 flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60"></span>
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary"></span>
                  </span>
                )}
              </LocalizedLink>
            )
          })}

          {primaryAction && (
            <LocalizedLink
              href={primaryAction.href}
              lang={lang}
              className="whitespace-nowrap rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 js-programari-button"
              rel="noopener"
            >
              {primaryAction.label}
            </LocalizedLink>
          )}
          <LanguageSwitcherLink lang={lang} />
        </nav>
      </div>

      <div className="hidden border-t border-slate-200 bg-white px-4 py-4 shadow-sm lg:hidden" data-nav-drawer>
        <nav className="space-y-3 text-sm font-medium uppercase tracking-wide text-slate-700">
          {navLinks.map((link) => {
            const isServicesLink = link.href?.includes('servicii')
            return (
              <LocalizedLink
                key={link.id ?? link.href}
                href={link.href}
                lang={lang}
                className={`flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 transition hover:bg-slate-100 whitespace-nowrap ${link.className ?? ''}`.trim()}
              >
                <span className="flex items-center gap-2">
                  {link.label}
                  {isServicesLink && hasNewServices && (
                    <span className="inline-flex items-center rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                      {t.labels.new}
                    </span>
                  )}
                </span>
                <svg
                  className="h-4 w-4 text-slate-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </LocalizedLink>
            )
          })}

          {primaryAction && (
            <LocalizedLink
              href={primaryAction.href}
              lang={lang}
              className="mt-4 flex items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 whitespace-nowrap js-programari-button"
              rel="noopener"
            >
              {primaryAction.label}
            </LocalizedLink>
          )}
          <div className="mt-4">
            <LanguageSwitcherLink lang={lang} />
          </div>
        </nav>
      </div>
    </header>
  )
}
