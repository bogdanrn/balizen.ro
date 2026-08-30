import { getTranslations, type Lang } from '@/i18n'
import type { Location, SiteConfig } from '@/payload-types'

import Icon from '../Icon'
import LanguageSwitcherLink from '../LanguageSwitcherLink'
import LocalizedLink from '../LocalizedLink'

type Props = {
  lang: Lang
  siteConfig: SiteConfig
  locations: Location[]
}

// Port of _legacy Footer.astro. The location/contact block iterates the
// locations collection (the old footer.locations field is gone); the ANPC
// middle-bar badges are hardcoded as on the legacy site.
export default function SiteFooter({ lang, siteConfig, locations }: Props) {
  const t = getTranslations(lang)
  const currentYear = new Date().getFullYear()
  const dynamicFootnote = siteConfig.copyright.replace(/\d{4}/g, String(currentYear))
  const columns = siteConfig.footerColumns ?? []
  const socialLinks = siteConfig.socialLinks ?? []

  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-screen-xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-2">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{t.footer.locationContact}</h3>
          <div className="mt-4 space-y-8">
            {locations.map((loc) => (
              <dl key={loc.id} className="space-y-3 text-sm text-slate-600">
                <div>
                  <dt className="font-semibold uppercase tracking-wide text-slate-500">{t.footer.address}</dt>
                  <dd>
                    <a href={loc.mapsUrl} target="_blank" rel="noopener" className="hover:text-primary">
                      {loc.address}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold uppercase tracking-wide text-slate-500">{t.footer.schedule}</dt>
                  <dd>{loc.schedule}</dd>
                </div>
                <div>
                  <dt className="font-semibold uppercase tracking-wide text-slate-500">{t.footer.contact}</dt>
                  <dd>
                    <a className="hover:text-primary" href={loc.phoneHref}>
                      {loc.phone}
                    </a>
                  </dd>
                </div>
              </dl>
            ))}
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:col-span-3 lg:grid-cols-2">
          {columns.map((column) => (
            <div key={column.id ?? column.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{column.title}</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                {(column.links ?? []).map((link) => (
                  <li key={link.id ?? link.href}>
                    {link.href ? (
                      <LocalizedLink
                        href={link.href}
                        lang={lang}
                        className={`transition hover:text-primary ${link.className ?? ''}`.trim()}
                      >
                        {link.text}
                      </LocalizedLink>
                    ) : (
                      <span>{link.text}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-screen-xl flex-col items-center gap-6 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4 sm:justify-start">
            <a
              href="https://anpc.ro/ce-este-sal/"
              target="_blank"
              rel="nofollow"
              className="inline-flex items-center justify-center rounded-md  border border-transparent hover:border-primary hover:shadow"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/anpc-sal.png"
                alt="Soluționarea Alternativă a Litigiilor"
                loading="lazy"
                width={250}
                className="max-h-12 w-auto"
              />
            </a>
            <a
              href="https://ec.europa.eu/consumers/odr"
              target="_blank"
              rel="nofollow"
              className="inline-flex items-center justify-center rounded-md  border border-transparent hover:border-primary hover:shadow"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/anpc-sol.png"
                alt="Soluționarea Online a Litigiilor"
                loading="lazy"
                width={250}
                className="max-h-12 w-auto"
              />
            </a>
          </div>

          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.id ?? social.href}
                href={social.href}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-primary hover:text-primary"
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

      <div className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-screen-xl flex-col items-center gap-4 px-4 py-6 text-center text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>{dynamicFootnote}</p>
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
            <a
              className="text-primary underline-offset-2 hover:underline"
              href={siteConfig.googleReviewsUrl}
              target="_blank"
              rel="noopener"
            >
              {t.footer.readReviews}
            </a>
            <button type="button" className="text-primary underline-offset-2 hover:underline" data-cc="show-preferencesModal">
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
