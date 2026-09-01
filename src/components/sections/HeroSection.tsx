import { getTranslations, type Lang } from '@/i18n'
import type { Homepage, Location, SiteConfig } from '@/payload-types'

import CdnImage from '../CdnImage'
import HeroActionMenu from '../HeroActionMenu'
import Icon from '../Icon'
import SectionEyebrow from '../SectionEyebrow'

type Props = {
  lang: Lang
  homepage: Homepage
  siteConfig: SiteConfig
  locations: Location[]
}

// Full-bleed photographic hero, as on the legacy Astro site: the image is the
// background, a cream scrim carries the type. The CTA row is fixed: the shared
// book-now control (labelled "Rezervă acum", WhatsApp on the left segment,
// chevron opens the picker) plus a direct services-list jump. Labels are
// hardcoded via i18n so every surface reads identically; the CMS hero actions
// no longer drive this row.
export default function HeroSection({ lang, homepage, siteConfig, locations }: Props) {
  const t = getTranslations(lang)

  return (
    <section className="relative isolate overflow-hidden bg-cream text-ink">
      <div className="absolute inset-0">
        <CdnImage
          media={homepage.heroImage}
          alt=""
          className="hero-drift h-full w-full object-cover object-center motion-safe:animate-[hero-drift_24s_ease-in-out_infinite_alternate]"
          sizes="100vw"
          eager
        />
        {/* Legibility scrim. The copy is centered up to the lg breakpoint, so a
            flat wash is what keeps it readable there; from lg the copy moves
            left and a horizontal gradient reveals the right of the photograph. */}
        <div aria-hidden="true" className="absolute inset-0 bg-cream/80 lg:hidden" />
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden bg-gradient-to-r from-cream via-cream/85 to-cream/30 lg:block"
        />
      </div>

      <div className="relative mx-auto flex min-h-[90vh] w-full max-w-screen-xl flex-col justify-center px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
          {homepage.heroText && <SectionEyebrow>{homepage.heroText}</SectionEyebrow>}

          <h1 className="mt-6 whitespace-pre-line font-heading text-4xl font-semibold leading-[1.05] text-ink sm:text-5xl lg:text-6xl xl:text-7xl">
            {homepage.heroTitle}
          </h1>

          <div className="mt-8 space-y-4 text-lg leading-relaxed text-muted-warm sm:text-xl">
            {(homepage.heroSubtitle ?? []).map((paragraph) => (
              <p key={paragraph.id ?? paragraph.line}>{paragraph.line}</p>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-center sm:gap-4 lg:justify-start">
            <HeroActionMenu
              lang={lang}
              bookingUrl={siteConfig.bookingUrl}
              whatsappUrl={siteConfig.whatsappUrl}
              phone={siteConfig.phone}
              phoneHref={siteConfig.phoneHref}
              locations={locations}
            />
            <a
              href="#servicii"
              className="btn-scrim w-full gap-2 text-sm font-semibold uppercase tracking-wide sm:w-auto"
            >
              <Icon name="list" className="h-5 w-5" />
              <span>{t.services.listLabel}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
