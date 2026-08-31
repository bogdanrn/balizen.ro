import { getTranslations, type Lang } from '@/i18n'
import { ctaClass } from '@/lib/ui'
import type { Homepage } from '@/payload-types'

import CdnImage from '../CdnImage'
import Disclaimer from '../Disclaimer'
import Icon from '../Icon'
import LocalizedLink from '../LocalizedLink'
import SectionEyebrow from '../SectionEyebrow'

type Props = {
  lang: Lang
  homepage: Homepage
}

// The one dark band on the page. Flat ink — no gradient wash — with the gift
// card artwork leading on mobile and sitting right on desktop.
export default function GiftCardSection({ lang, homepage }: Props) {
  const t = getTranslations(lang)
  const cta = homepage.giftCardCta
  const disclaimer = (homepage.giftCardDisclaimer ?? []).map((item) => item.line)

  return (
    <section id="gift-card" className="bg-ink text-cream">
      <div className="mx-auto grid w-full max-w-screen-xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-28">
        <div className="order-2 lg:order-1">
          <SectionEyebrow tone="cream">{t.giftCard.tagline}</SectionEyebrow>

          <h2 className="mt-5 font-heading text-4xl font-semibold leading-[1.1] text-cream sm:text-5xl">
            {homepage.giftCardTitle}
          </h2>

          <div className="mt-5 max-w-prose space-y-4 text-base leading-relaxed text-cream/75">
            {(homepage.giftCardDescription ?? []).map((paragraph, index) => (
              <p key={paragraph.id ?? index}>{paragraph.paragraph}</p>
            ))}
          </div>

          <ul className="mt-10 divide-y divide-cream/10 border-y border-cream/10">
            {(homepage.giftCardFeatures ?? []).map((feature, index) => (
              <li key={feature.id ?? index} className="flex items-start gap-4 py-5">
                <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream/10 text-primary">
                  <Icon name={feature.icon} className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-heading text-xl font-semibold text-cream">{feature.title}</h3>
                  <p className="mt-1 max-w-prose text-sm leading-relaxed text-cream/70">{feature.description}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <LocalizedLink
              href={cta.href}
              lang={lang}
              className={ctaClass(cta, {
                secondary: 'btn border-none text-cream ring-1 ring-inset ring-cream/30 hover:bg-cream hover:text-ink',
                extra: 'w-full gap-2 text-sm font-semibold uppercase tracking-wide sm:w-auto',
              })}
              target={cta.target}
              rel="noopener"
            >
              <Icon name={cta.icon ?? 'gift'} className="h-5 w-5" />
              <span>{cta.label}</span>
            </LocalizedLink>
          </div>

          {disclaimer.length > 0 && (
            <Disclaimer
              items={disclaimer}
              lang={lang}
              className="mt-10 border-t border-cream/10 pt-6 text-xs leading-relaxed text-cream/60"
              linkClass="focus-ring rounded-sm text-cream underline underline-offset-4 transition-colors hover:text-primary"
            />
          )}
        </div>

        <div className="order-1 lg:order-2">
          <LocalizedLink
            href={cta.href}
            lang={lang}
            target={cta.target}
            rel="noopener"
            ariaLabel={cta.label}
            className="focus-ring block overflow-hidden rounded-3xl ring-1 ring-cream/15 transition-colors hover:ring-primary"
          >
            <CdnImage
              media={homepage.giftCardImage}
              className="h-full w-full object-cover object-center"
              sizes="(min-width: 1024px) 45vw, 100vw"
            />
          </LocalizedLink>
        </div>
      </div>
    </section>
  )
}
