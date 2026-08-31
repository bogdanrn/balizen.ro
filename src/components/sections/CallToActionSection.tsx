import { getTranslations, type Lang } from '@/i18n'
import { ctaClass } from '@/lib/ui'
import type { Homepage } from '@/payload-types'

import Icon from '../Icon'
import LocalizedLink from '../LocalizedLink'
import SectionEyebrow from '../SectionEyebrow'

type Props = {
  lang: Lang
  homepage: Homepage
}

// The peach band: the loudest brand moment on the page, so it stays plain
// colour with ink type — no dot pattern, no gradient. The CTA is forced to the
// ink pill because a peach primary would vanish into the background.
export default function CallToActionSection({ lang, homepage }: Props) {
  const t = getTranslations(lang)
  const cta = homepage.ctaButton

  return (
    <section id="programare" className="bg-primary text-ink">
      <div className="mx-auto flex w-full max-w-screen-xl flex-col items-center px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-28">
        <SectionEyebrow tone="ink">{t.cta.tagline}</SectionEyebrow>

        <h2 className="mt-5 max-w-3xl font-heading text-4xl font-semibold leading-[1.1] text-ink sm:text-5xl">
          {homepage.ctaTitle}
        </h2>

        <p className="mt-5 max-w-prose text-base leading-relaxed text-ink/75">{homepage.ctaSubtitle}</p>

        <div className="mt-10 w-full sm:w-auto">
          <LocalizedLink
            href={cta.href}
            lang={lang}
            className={ctaClass(cta, {
              primary: 'btn-secondary',
              secondary: 'btn border-none text-ink ring-1 ring-inset ring-ink/40 hover:bg-ink hover:text-cream',
              extra: 'w-full gap-2 text-sm font-semibold uppercase tracking-wide sm:w-auto',
            })}
            target={cta.target}
            rel="noopener"
          >
            <Icon name={cta.icon ?? 'calendar'} className="h-5 w-5" />
            <span>{cta.label}</span>
          </LocalizedLink>
        </div>
      </div>
    </section>
  )
}
