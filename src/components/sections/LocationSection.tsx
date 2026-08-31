import { getTranslations, type Lang } from '@/i18n'
import {
  formatExceptionalHourDate,
  getUpcomingExceptionalHours,
  isExceptionalHourClosed,
} from '@/lib/exceptionalHours'
import type { ExceptionalHour, Homepage, Location, SiteConfig } from '@/payload-types'

import Icon from '../Icon'
import SectionEyebrow from '../SectionEyebrow'

type Props = {
  lang: Lang
  homepage: Homepage
  locations: Location[]
  siteConfig: SiteConfig
  exceptionalHours: ExceptionalHour[]
}

// White band closing the page. The social link cards come from
// homepage.socialLinks and keep the legacy "social-media" anchor on the grid.
export default function LocationSection({ lang, homepage, locations, exceptionalHours }: Props) {
  const t = getTranslations(lang)
  const socialLinks = homepage.socialLinks ?? []
  const upcomingHours = getUpcomingExceptionalHours(exceptionalHours)

  return (
    <section id="locatie" className="bg-white">
      <div className="mx-auto w-full max-w-screen-xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>{t.location.tagline}</SectionEyebrow>
          <h2 className="mt-5 font-heading text-4xl font-semibold leading-[1.1] text-ink sm:text-5xl">
            {homepage.locationTitle}
          </h2>
          <p className="mx-auto mt-5 max-w-prose text-base leading-relaxed text-muted-warm">
            {t.location.description}
          </p>
        </div>

        {socialLinks.length ? (
          <div id="social-media" className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {socialLinks.map((link, index) => (
              <a
                key={link.id ?? index}
                href={link.href}
                target="_blank"
                rel="noopener"
                className="focus-ring group flex min-h-16 items-center gap-4 rounded-2xl bg-cream p-5 ring-1 ring-ink/10 transition-colors hover:ring-ink/30"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-ink transition-colors group-hover:bg-primary">
                  <Icon name={link.icon} className="h-6 w-6" />
                </span>
                <span className="flex flex-col">
                  <span className="text-base font-semibold text-ink">{link.label}</span>
                  {link.handle && <span className="text-sm text-muted-warm">{link.handle}</span>}
                </span>
                <span
                  aria-hidden="true"
                  className="ml-auto inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-warm transition-colors group-hover:text-ink"
                >
                  <Icon name="arrow-up-right" className="h-5 w-5" />
                </span>
              </a>
            ))}
          </div>
        ) : null}

        {upcomingHours.length > 0 && (
          // One callout for the whole business (exceptions have no per-location
          // relation), placed before the location cards, not repeated per card.
          <div className="mx-auto mt-14 max-w-3xl rounded-2xl bg-cream p-6 ring-1 ring-ink/10 sm:p-8">
            <div className="flex items-start gap-4">
              <span className="mt-0.5 shrink-0 text-muted-warm">
                <Icon name="clock" className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-heading text-lg font-semibold text-ink">{t.exceptionalHours.heading}</h3>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-warm">
                  {upcomingHours.map((hour) => (
                    <li key={hour.id}>
                      <span className="font-medium text-ink">{formatExceptionalHourDate(hour, lang)}</span>
                      {': '}
                      {isExceptionalHourClosed(hour)
                        ? t.exceptionalHours.closed
                        : `${hour.opensAt} - ${hour.closesAt}`}
                      {hour.note ? ` (${hour.note})` : ''}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="mt-16 space-y-16">
          {locations.map((loc) => {
            const mapQuery = encodeURIComponent(`${loc.address}`)
            const fallbackEmbedSrc = `https://www.google.com/maps?q=${mapQuery}&hl=${lang}&z=16&output=embed`
            const mapEmbedSrc = loc.mapsEmbedUrl || fallbackEmbedSrc

            return (
              <div key={loc.id} className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                <div className="rounded-3xl bg-cream p-6 ring-1 ring-ink/10 sm:p-8">
                  <h3 className="font-heading text-2xl font-semibold text-ink">{loc.name}</h3>

                  <dl className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
                    <div className="flex items-start gap-4 py-4">
                      <dt className="mt-0.5 shrink-0 text-muted-warm">
                        <Icon name="map-pin" className="h-5 w-5" />
                        <span className="sr-only">{t.footer.address}</span>
                      </dt>
                      <dd>
                        <a
                          href={loc.mapsUrl}
                          className="focus-ring rounded-sm text-sm leading-relaxed text-muted-warm underline-offset-4 transition-colors hover:text-ink hover:underline"
                          target="_blank"
                          rel="noopener"
                        >
                          {loc.address}
                        </a>
                      </dd>
                    </div>

                    <div className="flex items-start gap-4 py-4">
                      <dt className="mt-0.5 shrink-0 text-muted-warm">
                        <Icon name="clock" className="h-5 w-5" />
                        <span className="sr-only">{t.location.workingHours}</span>
                      </dt>
                      <dd className="text-sm leading-relaxed text-muted-warm">{loc.schedule}</dd>
                    </div>

                    <div className="flex items-start gap-4 py-4">
                      <dt className="mt-0.5 shrink-0 text-muted-warm">
                        <Icon name="phone" className="h-5 w-5" />
                        <span className="sr-only">{t.location.contact}</span>
                      </dt>
                      <dd>
                        <a
                          href={loc.phoneHref}
                          className="focus-ring rounded-sm text-sm leading-relaxed text-muted-warm underline-offset-4 transition-colors hover:text-ink hover:underline"
                        >
                          {loc.phone}
                        </a>
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                    <a
                      href={loc.mapsUrl}
                      className="btn-primary w-full gap-2 text-sm font-semibold uppercase tracking-wide sm:w-auto"
                      target="_blank"
                      rel="noopener"
                    >
                      <Icon name="map" className="h-5 w-5" />
                      <span>{t.location.openInGoogleMaps}</span>
                    </a>
                    <a
                      href={loc.phoneHref}
                      className="btn-outline js-contact-button w-full gap-2 text-sm font-semibold uppercase tracking-wide sm:w-auto"
                    >
                      <Icon name="phone" className="h-5 w-5" />
                      <span>{loc.phone}</span>
                    </a>
                  </div>
                </div>

                <div className="min-h-80 overflow-hidden rounded-3xl ring-1 ring-ink/10">
                  <iframe
                    src={mapEmbedSrc}
                    width="100%"
                    height="450"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`${t.location.mapTitle} ${loc.name}`}
                    className="h-full w-full border-0"
                  />
                </div>
              </div>
            )
          })}

          {homepage.locationEmail && (
            <div className="flex items-start gap-4 rounded-2xl bg-cream p-5 ring-1 ring-ink/10">
              <span className="mt-0.5 shrink-0 text-muted-warm">
                <Icon name="mail" className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-semibold text-ink">{t.location.emailLabel}</h3>
                <a
                  href={`mailto:${homepage.locationEmail}`}
                  className="focus-ring mt-1 block rounded-sm text-sm text-muted-warm underline-offset-4 transition-colors hover:text-ink hover:underline"
                >
                  {homepage.locationEmail}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
