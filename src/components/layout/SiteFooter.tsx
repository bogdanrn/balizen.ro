import { getTranslations, type Lang } from '@/i18n'
import { hookClasses } from '@/lib/ui'
import type { Location, SiteConfig } from '@/payload-types'

import Icon from '../Icon'
import LanguageSwitcherLink from '../LanguageSwitcherLink'
import LocalizedLink from '../LocalizedLink'

type Props = {
  lang: Lang
  siteConfig: SiteConfig
  locations: Location[]
}

// Dark ink close to the page, matching the announcement banner and btn-secondary.
// The location/contact block iterates the locations collection; the ANPC
// middle-bar badges are hardcoded as on the legacy site — their href/target/rel
// must not change, so the badges sit in a cream chip to stay legible on ink.
const LABEL = 'text-xs font-semibold uppercase tracking-widest text-cream/50'
const LINK = 'focus-ring rounded-sm text-cream/75 underline-offset-4 transition-colors hover:text-cream hover:underline'

export default function SiteFooter({ lang, siteConfig, locations }: Props) {
  const t = getTranslations(lang)
  const currentYear = new Date().getFullYear()
  const dynamicFootnote = siteConfig.copyright.replace(/\d{4}/g, String(currentYear))
  const columns = siteConfig.footerColumns ?? []
  const socialLinks = siteConfig.socialLinks ?? []

  return (
    <footer className="bg-ink text-cream">
      <div className="mx-auto grid w-full max-w-screen-xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-2">
          <h2 className={LABEL}>{t.footer.locationContact}</h2>
          <div className="mt-5 space-y-8">
            {locations.map((loc) => (
              <dl key={loc.id} className="space-y-4 text-sm text-cream/75">
                <div>
                  <dt className={LABEL}>{t.footer.address}</dt>
                  <dd className="mt-1">
                    <a href={loc.mapsUrl} target="_blank" rel="noopener" className={LINK}>
                      {loc.address}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className={LABEL}>{t.footer.schedule}</dt>
                  <dd className="mt-1">{loc.schedule}</dd>
                </div>
                <div>
                  <dt className={LABEL}>{t.footer.contact}</dt>
                  <dd className="mt-1">
                    <a className={LINK} href={loc.phoneHref}>
                      {loc.phone}
                    </a>
                  </dd>
                </div>
              </dl>
            ))}
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:col-span-3">
          {columns.map((column) => (
            <div key={column.id ?? column.title}>
              <h2 className={LABEL}>{column.title}</h2>
              <ul className="mt-5 space-y-3 text-sm">
                {(column.links ?? []).map((link) => (
                  <li key={link.id ?? link.href}>
                    {link.href ? (
                      <LocalizedLink
                        href={link.href}
                        lang={lang}
                        className={`${LINK} ${hookClasses(link.className)}`.trim()}
                      >
                        {link.text}
                      </LocalizedLink>
                    ) : (
                      <span className="text-cream/75">{link.text}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="mx-auto flex w-full max-w-screen-xl flex-col items-center gap-6 px-4 py-8 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4 sm:justify-start">
            <a
              href="https://anpc.ro/ce-este-sal/"
              target="_blank"
              rel="nofollow"
              className="focus-ring inline-flex items-center justify-center rounded-lg bg-cream px-2 py-1.5 ring-1 ring-transparent transition-colors hover:ring-primary"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/anpc-sal.png"
                alt="Soluționarea Alternativă a Litigiilor"
                loading="lazy"
                width={250}
                className="max-h-10 w-auto"
              />
            </a>
            <a
              href="https://ec.europa.eu/consumers/odr"
              target="_blank"
              rel="nofollow"
              className="focus-ring inline-flex items-center justify-center rounded-lg bg-cream px-2 py-1.5 ring-1 ring-transparent transition-colors hover:ring-primary"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/anpc-sol.png"
                alt="Soluționarea Online a Litigiilor"
                loading="lazy"
                width={250}
                className="max-h-10 w-auto"
              />
            </a>
          </div>

          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.id ?? social.href}
                href={social.href}
                className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-full text-cream/75 ring-1 ring-cream/20 transition-colors hover:bg-cream hover:text-ink hover:ring-cream"
                target="_blank"
                rel="noopener"
                aria-label={social.label}
              >
                <Icon name={social.icon} className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-cream/10">
        {/* Extra bottom room on mobile so the docked hero CTA never covers the
            last row of links. */}
        <div className="mx-auto flex w-full max-w-screen-xl flex-col items-center gap-4 px-4 pb-28 pt-6 text-center text-sm text-cream/60 sm:flex-row sm:justify-between sm:px-6 lg:px-8 lg:pb-6">
          <p>{dynamicFootnote}</p>
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-5">
            <a className={LINK} href={siteConfig.googleReviewsUrl} target="_blank" rel="noopener">
              {t.footer.readReviews}
            </a>
            <button type="button" className={LINK} data-cc="show-preferencesModal">
              {t.footer.cookieSettings}
            </button>
          </div>
          <div className="flex justify-center">
            <LanguageSwitcherLink lang={lang} />
          </div>
        </div>
      </div>
    </footer>
  )
}
