import { Suspense } from 'react'

import { getTranslations, type Lang } from '@/i18n'
import { isNewService } from '@/lib/payload'
import { ctaClass } from '@/lib/ui'
import type { Homepage, Service, ServiceCategory, SiteConfig } from '@/payload-types'

import Icon from '../Icon'
import LocalizedLink from '../LocalizedLink'
import SectionEyebrow from '../SectionEyebrow'
import ServiceExplorer, { type ExplorerCategory } from '../services/ServiceExplorer'

export type ServiceCategoryWithServices = ServiceCategory & { services: Service[] }

type Props = {
  lang: Lang
  homepage: Homepage
  categories: ServiceCategoryWithServices[]
  siteConfig: SiteConfig
}

// Cream band so the white service cards separate by surface, not by shadow.
// The card grid and the service detail modal live in ServiceExplorer (client,
// because the open service is derived from the ?service= query param); this
// section stays a server component for the heading, CTA and contact row.
export default function ServicesSection({ lang, homepage, categories, siteConfig }: Props) {
  const t = getTranslations(lang)
  const cta = homepage.servicesCta

  // Narrow the CMS docs to the serializable shape the client component needs.
  const explorerCategories: ExplorerCategory[] = categories.map((category) => ({
    id: category.id,
    name: category.name,
    services: category.services.map((service) => ({
      id: service.id,
      title: service.title,
      description: service.description,
      pricing: (service.pricing ?? []).map(({ duration, price }) => ({ duration, price })),
      image: service.image && typeof service.image === 'object' ? service.image : null,
      isNew: isNewService(service.modifiedDate),
      categoryName: category.name,
    })),
  }))

  return (
    <section id="servicii" className="border-t border-ink/10 bg-cream">
      <div className="mx-auto w-full max-w-screen-xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>{t.services.tagline}</SectionEyebrow>
          <h2 className="mt-5 font-heading text-4xl font-semibold leading-[1.1] text-ink sm:text-5xl">
            {homepage.servicesTitle}
          </h2>
          <p className="mx-auto mt-5 max-w-prose text-base leading-relaxed text-muted-warm">
            {homepage.servicesDescription}
          </p>
          <div className="mt-8">
            <LocalizedLink
              href={cta.href}
              lang={lang}
              className={ctaClass(cta, { extra: 'text-sm font-semibold uppercase tracking-wide' })}
              target={cta.target}
              rel="noopener"
            >
              {cta.label}
            </LocalizedLink>
          </div>
        </div>

        <Suspense fallback={null}>
          <ServiceExplorer
            lang={lang}
            categories={explorerCategories}
            bookingUrl={siteConfig.bookingUrl}
            whatsappUrl={siteConfig.whatsappUrl}
            phone={siteConfig.phone}
            phoneHref={siteConfig.phoneHref}
          />
        </Suspense>

        <div className="mt-16 flex flex-col items-center gap-4 border-t border-ink/10 pt-12">
          <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-start sm:justify-center sm:gap-4">
            <a
              href={siteConfig.bookingUrl}
              className="btn-primary js-programari-button w-full gap-2 text-sm font-semibold uppercase tracking-wide sm:w-auto"
              target="_blank"
              rel="noopener"
            >
              <Icon name="calendar" className="h-5 w-5" />
              <span>{t.buttons.bookHere}</span>
            </a>
            <a
              href={siteConfig.whatsappUrl}
              className="btn-outline js-contact-button w-full gap-2 text-sm font-semibold uppercase tracking-wide sm:w-auto"
              target="_blank"
              rel="noopener"
            >
              <Icon name="brand-whatsapp" className="h-5 w-5" />
              <span>{t.buttons.whatsapp}</span>
            </a>
            <div className="flex w-full flex-col items-center gap-1.5 sm:w-auto">
              <a
                href={siteConfig.phoneHref}
                className="btn-outline js-contact-button w-full gap-2 text-sm font-semibold uppercase tracking-wide sm:w-auto"
              >
                <Icon name="phone" className="h-5 w-5" />
                <span>{siteConfig.phone}</span>
              </a>
              <span className="text-xs font-medium text-muted-warm">{t.labels.locationCaption}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
