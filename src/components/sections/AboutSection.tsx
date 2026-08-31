import type { Lang } from '@/i18n'
import { ctaClass } from '@/lib/ui'
import type { Homepage } from '@/payload-types'

import CdnImage from '../CdnImage'
import Icon from '../Icon'
import LocalizedLink from '../LocalizedLink'
import SectionEyebrow from '../SectionEyebrow'

type Props = {
  lang: Lang
  homepage: Homepage
}

// White band. Copy left, portrait image right on desktop; stacked on mobile
// with the copy first, so the section reads as prose rather than a card grid.
export default function AboutSection({ lang, homepage }: Props) {
  const cta = homepage.aboutCta

  return (
    <section id="despre-noi" className="border-t border-ink/10 bg-white">
      <div className="mx-auto grid w-full max-w-screen-xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-28">
        <div>
          {homepage.aboutTagline && <SectionEyebrow>{homepage.aboutTagline}</SectionEyebrow>}

          <h2 className="mt-5 font-heading text-4xl font-semibold leading-[1.1] text-ink sm:text-5xl">
            {homepage.aboutTitle}
          </h2>

          <p className="mt-5 max-w-prose text-base leading-relaxed text-muted-warm">{homepage.aboutIntro}</p>

          <ul className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
            {(homepage.aboutBullets ?? []).map((item, index) => (
              <li key={item.id ?? index} className="flex items-start gap-4 py-5">
                <span
                  aria-hidden="true"
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                />
                <div>
                  <h3 className="font-heading text-xl font-semibold text-ink">{item.title}</h3>
                  <p className="mt-1 max-w-prose text-sm leading-relaxed text-muted-warm">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <LocalizedLink
              href={cta.href}
              lang={lang}
              className={ctaClass(cta, { extra: 'w-full gap-2 text-sm font-semibold uppercase tracking-wide sm:w-auto' })}
              target={cta.target}
              rel="noopener"
            >
              <Icon name={cta.icon ?? 'calendar'} className="h-5 w-5" />
              <span>{cta.label}</span>
            </LocalizedLink>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl ring-1 ring-accent">
          <CdnImage
            media={homepage.aboutImage}
            className="aspect-[4/3] h-full w-full object-cover object-center lg:aspect-[4/5]"
            sizes="(min-width: 1024px) 45vw, 100vw"
          />
        </div>
      </div>
    </section>
  )
}
