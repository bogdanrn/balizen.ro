import { getTranslations, type Lang } from '@/i18n'
import { hookClasses } from '@/lib/ui'
import type { SiteConfig } from '@/payload-types'

import BookNowMenu from '../BookNowMenu'
import LanguageSwitcherLink from '../LanguageSwitcherLink'
import LocalizedLink from '../LocalizedLink'
import Logo from './Logo'

type Props = {
  lang: Lang
  siteConfig: SiteConfig
  hasNewServices: boolean
}

// Fresh mobile-first header. The drawer toggle/drawer keep the data-*
// hooks (HeaderDrawer client component wires the behavior). Every CTA is the
// shared book-now control: the left segment fires WhatsApp directly (with the
// js-contact-button hook), the chevron opens the contact picker below the
// bar. Mobile uses the compact icon-only variant next to the hamburger.
// The bar carries backdrop-blur (not the <header> element) so the fixed
// drawer overlay positions against the viewport, not the header.
export default function SiteHeader({ lang, siteConfig, hasNewServices }: Props) {
  const t = getTranslations(lang)
  const navLinks = siteConfig.headerLinks ?? []

  const bookNowProps = {
    lang,
    bookingUrl: siteConfig.bookingUrl,
    whatsappUrl: siteConfig.whatsappUrl,
    phone: siteConfig.phone,
    phoneHref: siteConfig.phoneHref,
    direction: 'down' as const,
  }

  return (
    <header className="top-0 z-40 lg:sticky">
      <div className="relative z-40 border-b border-ink/10 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between gap-6 px-4 py-4">
          <Logo lang={lang} name={siteConfig.name} tagline={siteConfig.tagline} />

          <div className="flex items-center gap-2 lg:hidden">
            <BookNowMenu
              {...bookNowProps}
              analyticsLocation="header-mobile"
              wrapClassName="relative"
              triggerLabel={t.buttons.whatsapp}
              triggerClassName="gap-2 px-5 py-3 text-sm font-semibold uppercase tracking-wide"
            />
            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-ink/15 text-ink transition hover:bg-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
            className="hidden flex-1 items-center justify-center gap-8 text-sm font-medium text-muted-warm lg:flex"
            data-nav-menu
          >
            {navLinks.map((link) => {
              const isServicesLink = link.href?.includes('servicii')
              return (
                <LocalizedLink
                  key={link.id ?? link.href}
                  href={link.href}
                  lang={lang}
                  className={`focus-ring relative whitespace-nowrap rounded-sm transition-colors hover:text-ink ${hookClasses(link.className)}`.trim()}
                >
                  {link.label}
                  {isServicesLink && hasNewServices && (
                    <span
                      aria-hidden="true"
                      className="nav-new-dot absolute -right-2.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-primary"
                    ></span>
                  )}
                </LocalizedLink>
              )
            })}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <BookNowMenu {...bookNowProps} analyticsLocation="header" />
            <LanguageSwitcherLink lang={lang} />
          </div>
        </div>
      </div>

      <div className="fixed inset-0 z-30 hidden overflow-y-auto bg-cream lg:hidden" data-nav-drawer>
        <div className="flex min-h-full flex-col px-6 pb-8 pt-28">
          <nav className="flex flex-col">
            {navLinks.map((link) => {
              const isServicesLink = link.href?.includes('servicii')
              return (
                <LocalizedLink
                  key={link.id ?? link.href}
                  href={link.href}
                  lang={lang}
                  className={`focus-ring flex min-h-14 items-center gap-3 whitespace-nowrap border-b border-ink/10 py-4 font-heading text-2xl font-semibold text-ink transition-colors hover:text-muted-warm ${hookClasses(link.className)}`.trim()}
                >
                  {link.label}
                  {isServicesLink && hasNewServices && (
                    <span className="inline-flex items-center rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-ink">
                      {t.labels.new}
                    </span>
                  )}
                </LocalizedLink>
              )
            })}
          </nav>

          <div className="mt-auto flex flex-col items-stretch gap-4 pt-8">
            <BookNowMenu
              {...bookNowProps}
              analyticsLocation="drawer"
              triggerClassName="w-full px-5 py-3 text-sm font-semibold uppercase tracking-wide"
            />
            <div className="flex justify-center">
              <LanguageSwitcherLink lang={lang} />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
