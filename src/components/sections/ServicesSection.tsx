import { Suspense } from 'react'

import { getTranslations, type Lang } from '@/i18n'
import { isNewService } from '@/lib/payload'
import type { Homepage, Service, ServiceCategory, SiteConfig } from '@/payload-types'

import BookNowMenu from '../BookNowMenu'
import BookingContactButtons from '../BookingContactButtons'
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
          <div className="mt-8 flex justify-center">
            <BookNowMenu
              lang={lang}
              bookingUrl={siteConfig.bookingUrl}
              whatsappUrl={siteConfig.whatsappUrl}
              phone={siteConfig.phone}
              phoneHref={siteConfig.phoneHref}
              analyticsLocation="services"
            />
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
          <BookingContactButtons
            lang={lang}
            layout="row"
            bookingUrl={siteConfig.bookingUrl}
            whatsappUrl={siteConfig.whatsappUrl}
            phone={siteConfig.phone}
            phoneHref={siteConfig.phoneHref}
            phoneCaption={t.labels.locationCaption}
          />
        </div>
      </div>
    </section>
  )
}
