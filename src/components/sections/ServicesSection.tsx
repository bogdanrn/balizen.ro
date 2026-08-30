import { getTranslations, type Lang } from '@/i18n'
import { isNewService } from '@/lib/payload'
import type { Homepage, Service, ServiceCategory, SiteConfig } from '@/payload-types'

import CdnImage from '../CdnImage'
import Icon from '../Icon'
import LocalizedLink from '../LocalizedLink'

export type ServiceCategoryWithServices = ServiceCategory & { services: Service[] }

type Props = {
  lang: Lang
  homepage: Homepage
  categories: ServiceCategoryWithServices[]
  siteConfig: SiteConfig
}

// Ported verbatim from _legacy ServicesSection.astro.
const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

// Port of _legacy ServicesSection.astro (section id "servicii"). The
// description toggle markup (js-service-description / js-service-description-toggle)
// is wired up by a separate client script; the matching CSS lives in globals.css.
export default function ServicesSection({ lang, homepage, categories, siteConfig }: Props) {
  const t = getTranslations(lang)
  const cta = homepage.servicesCta

  return (
    <section id="servicii" className="bg-slate-50">
      <div className="mx-auto max-w-screen-xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">{t.services.tagline}</p>
          <h2 className="mt-4 font-heading text-3xl font-bold text-slate-900 sm:text-4xl">{homepage.servicesTitle}</h2>
          <p className="mt-3 text-base text-slate-600">{homepage.servicesDescription}</p>
          <div className="mt-8">
            <LocalizedLink
              href={cta.href}
              lang={lang}
              className={`inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:opacity-90 ${cta.className ?? ''}`.trim()}
              target={cta.target}
              rel="noopener"
            >
              {cta.label}
            </LocalizedLink>
          </div>
        </div>

        <div className="mt-16 space-y-16">
          {categories.map(({ id: categoryId, name, services }) => (
            <section key={categoryId} className="space-y-8">
              <div className="text-center">
                <h3 className="font-heading text-2xl font-semibold uppercase tracking-[0.4em] text-primary sm:text-3xl">
                  {name}
                </h3>
                <div className="mt-3 h-1 w-16 bg-primary/70 mx-auto rounded-full" />
              </div>

              <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
                {services.map((service) => {
                  const descriptionId = `service-desc-${slugify(`${name}-${service.title}-${service.order ?? 0}`)}`
                  const isNew = isNewService(service.modifiedDate)
                  const image = service.image

                  return (
                    <article
                      key={service.id}
                      className={
                        isNew
                          ? 'service-new group flex gap-4 rounded-3xl border p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg border-primary/40 bg-gradient-to-br from-primary/[0.06] via-white to-primary/[0.04] shadow-md shadow-primary/10 ring-1 hover:border-primary/70 hover:shadow-primary/20'
                          : 'group flex gap-4 rounded-3xl border p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg border-slate-200 bg-white/90 hover:border-primary/60'
                      }
                    >
                      {image && typeof image === 'object' ? (
                        <div
                          className={
                            isNew
                              ? 'relative h-16 w-16 shrink-0 overflow-hidden rounded-full border shadow-md border-primary/50 shadow-primary/30'
                              : 'relative h-16 w-16 shrink-0 overflow-hidden rounded-full border shadow-md border-primary/30 shadow-primary/20'
                          }
                        >
                          <CdnImage
                            media={image}
                            alt={image.alt || service.title}
                            sizes="64px"
                            widths={[64, 128]}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <span className="font-heading text-lg font-semibold">
                            {String(service.order ?? 0).padStart(2, '0')}
                          </span>
                        </div>
                      )}

                      <div className="flex flex-1 flex-col gap-2">
                        <header className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                          <div className="text-left">
                            <div className="flex items-center gap-2">
                              <h4 className="font-heading text-xl font-semibold text-slate-900">{service.title}</h4>
                              {isNew && (
                                <span className="new-badge inline-flex items-center rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-white shadow-sm shadow-primary/40">
                                  {t.labels.new}
                                </span>
                              )}
                            </div>
                          </div>

                          {service.pricing?.length ? (
                            <div className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500 sm:text-right">
                              <div>{service.pricing.map(({ duration }) => `${duration} ${t.units.minutes}`).join(' · ')}</div>
                              <div className="text-primary">
                                {service.pricing.map(({ price }) => `${price} ${t.units.currency}`).join(' · ')}
                              </div>
                            </div>
                          ) : null}
                        </header>

                        {service.description && (
                          <div>
                            <p
                              id={descriptionId}
                              className="service-description js-service-description line-clamp-4 text-sm leading-relaxed text-slate-600"
                            >
                              {service.description}
                            </p>
                            <button
                              type="button"
                              className="js-service-description-toggle mt-2 hidden text-xs font-semibold uppercase tracking-wide text-primary transition hover:underline"
                              aria-expanded="false"
                              aria-controls={descriptionId}
                              data-label-more={t.buttons.showMore}
                              data-label-less={t.buttons.showLess}
                            >
                              {t.buttons.showMore}
                            </button>
                          </div>
                        )}

                        <div className="mt-2 h-[1px] w-full bg-gradient-to-r from-primary/20 via-transparent to-transparent" />
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-4">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center">
            <a
              href={siteConfig.whatsappUrl}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#25D366] bg-[#25D366] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-white hover:text-[#25D366] sm:w-auto js-contact-button"
              target="_blank"
              rel="noopener"
            >
              <Icon name="brand-whatsapp" className="h-5 w-5" />
              <span>{t.buttons.whatsapp}</span>
            </a>
            <a
              href={siteConfig.bookingUrl}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-primary/30 transition hover:opacity-90 sm:w-auto js-programari-button"
              target="_blank"
              rel="noopener"
            >
              <Icon name="calendar" className="h-5 w-5" />
              <span>{t.buttons.bookHere}</span>
            </a>
          </div>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center">
            <div className="flex flex-col items-center gap-1">
              <a
                href={siteConfig.phoneHref}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-white bg-white px-6 py-3 text-sm font-semibold uppercase tracking-wide text-black transition hover:border-black hover:bg-white hover:text-black sm:w-auto js-contact-button"
              >
                <Icon name="phone" className="h-5 w-5" />
                <span>{siteConfig.phone}</span>
              </a>
              <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                {t.labels.locationCaption}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
