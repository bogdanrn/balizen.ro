import { getTranslations, type Lang } from '@/i18n'
import type { Homepage, Location, SiteConfig } from '@/payload-types'

import Icon from '../Icon'

type Props = {
  lang: Lang
  homepage: Homepage
  locations: Location[]
  siteConfig: SiteConfig
}

// Port of _legacy LocationSection.astro (section id "locatie"). The social
// link cards come from homepage.socialLinks and carry the legacy
// "social-media" anchor on the grid.
export default function LocationSection({ lang, homepage, locations }: Props) {
  const t = getTranslations(lang)
  const socialLinks = homepage.socialLinks ?? []

  return (
    <section id="locatie" className="bg-white">
      <div className="mx-auto max-w-screen-xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">{t.location.tagline}</p>
          <h2 className="mt-4 font-heading text-3xl font-bold text-slate-900 sm:text-4xl">{homepage.locationTitle}</h2>
          <p className="mt-3 text-base text-slate-600">{t.location.description}</p>
        </div>

        {socialLinks.length ? (
          <div id="social-media" className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {socialLinks.map((link, index) => (
              <a
                key={link.id ?? index}
                href={link.href}
                target="_blank"
                rel="noopener"
                className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/80 transition hover:-translate-y-1 hover:border-primary/60 hover:shadow-lg hover:shadow-primary/20"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white">
                  <Icon name={link.icon} className="h-6 w-6" />
                </span>
                <div className="flex flex-col">
                  <span className="text-base font-semibold text-slate-900">{link.label}</span>
                  {link.handle && <span className="text-sm text-slate-600">{link.handle}</span>}
                </div>
                <span className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition group-hover:bg-primary group-hover:text-white">
                  <Icon name="arrow-up-right" className="h-5 w-5" />
                </span>
              </a>
            ))}
          </div>
        ) : null}

        <div className="mt-16 space-y-16">
          {locations.map((loc) => {
            const mapQuery = encodeURIComponent(`${loc.address}`)
            const fallbackEmbedSrc = `https://www.google.com/maps?q=${mapQuery}&hl=${lang}&z=16&output=embed`
            const mapEmbedSrc = loc.mapsEmbedUrl || fallbackEmbedSrc

            return (
              <div key={loc.id} className="grid gap-10 lg:grid-cols-2">
                <div className="space-y-6 rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <div className="flex items-start gap-4">
                    <span className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon name="map-pin" className="h-5 w-5" />
                    </span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">{loc.name}</h3>
                      <a
                        href={loc.mapsUrl}
                        className="mt-1 block text-sm text-slate-600 hover:text-primary"
                        target="_blank"
                        rel="noopener"
                      >
                        {loc.address}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <span className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon name="clock" className="h-5 w-5" />
                    </span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900">{t.location.workingHours}</h4>
                      <p className="mt-1 text-sm text-slate-600">{loc.schedule}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <span className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon name="phone" className="h-5 w-5" />
                    </span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900">{t.location.contact}</h4>
                      <a href={loc.phoneHref} className="mt-1 block text-sm text-slate-600 hover:text-primary">
                        {loc.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-4">
                    <a
                      href={loc.mapsUrl}
                      className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:opacity-90"
                      target="_blank"
                      rel="noopener"
                    >
                      <Icon name="map" className="h-5 w-5" />
                      <span>{t.location.openInGoogleMaps}</span>
                    </a>
                    <a
                      href={loc.phoneHref}
                      className="inline-flex items-center gap-2 rounded-full border border-primary px-6 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
                    >
                      <Icon name="phone" className="h-5 w-5" />
                      <span>{loc.phone}</span>
                    </a>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-3xl shadow-xl shadow-slate-200">
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
            <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <span className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon name="mail" className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-semibold text-slate-900">{t.location.emailLabel}</h3>
                <a
                  href={`mailto:${homepage.locationEmail}`}
                  className="mt-1 block text-sm text-slate-600 hover:text-primary"
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
