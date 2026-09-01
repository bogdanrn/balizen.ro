import { getTranslations, type Lang } from '@/i18n'
import type { Homepage, SiteConfig } from '@/payload-types'

import BookNowMenu from '../BookNowMenu'
import SectionEyebrow from '../SectionEyebrow'

type Props = {
  lang: Lang
  homepage: Homepage
  siteConfig: SiteConfig
}

// The peach band: the loudest brand moment on the page, so it stays plain
// colour with ink type — no dot pattern, no gradient. The book-now control is
// forced to the ink pill (triggerVariant="secondary") because a peach primary
// would vanish into the background; the panel opens upward, away from the
// footer below.
export default function CallToActionSection({ lang, homepage, siteConfig }: Props) {
  const t = getTranslations(lang)

  return (
    <section id="programare" className="bg-primary text-ink">
      <div className="mx-auto flex w-full max-w-screen-xl flex-col items-center px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-28">
        <SectionEyebrow tone="ink">{t.cta.tagline}</SectionEyebrow>

        <h2 className="mt-5 max-w-3xl font-heading text-4xl font-semibold leading-[1.1] text-ink sm:text-5xl">
          {homepage.ctaTitle}
        </h2>

        <p className="mt-5 max-w-prose text-base leading-relaxed text-ink/75">
          {homepage.ctaSubtitle}
        </p>

        <div className="mt-10 w-full sm:w-auto">
          <BookNowMenu
            lang={lang}
            bookingUrl={siteConfig.bookingUrl}
            whatsappUrl={siteConfig.whatsappUrl}
            phone={siteConfig.phone}
            phoneHref={siteConfig.phoneHref}
            triggerVariant="secondary"
            analyticsLocation="cta"
          />
        </div>
      </div>
    </section>
  )
}
