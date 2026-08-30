import { getTranslations, type Lang } from '@/i18n'
import type { Homepage } from '@/payload-types'

import CdnImage from '../CdnImage'
import Disclaimer from '../Disclaimer'
import Icon from '../Icon'
import LocalizedLink from '../LocalizedLink'

type Props = {
  lang: Lang
  homepage: Homepage
}

// Port of _legacy GiftCardSection.astro (section id "gift-card").
export default function GiftCardSection({ lang, homepage }: Props) {
  const t = getTranslations(lang)
  const cta = homepage.giftCardCta
  const disclaimer = (homepage.giftCardDisclaimer ?? []).map((item) => item.line)

  return (
    <section id="gift-card" className="relative overflow-hidden bg-[#33291F] text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-[#33291F] to-[#33291F]"></div>
      </div>

      <div className="relative mx-auto flex max-w-screen-xl flex-col gap-12 px-4 py-24 sm:px-6 lg:flex-row lg:items-center lg:justify-center lg:px-8">
        <div className="max-w-xl space-y-8">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">{t.giftCard.tagline}</p>
          <h2 className="font-heading text-3xl font-bold leading-tight sm:text-4xl">{homepage.giftCardTitle}</h2>
          <div className="space-y-4 text-base leading-relaxed text-white/85">
            {(homepage.giftCardDescription ?? []).map((paragraph, index) => (
              <p key={paragraph.id ?? index}>{paragraph.paragraph}</p>
            ))}
          </div>

          <ul className="space-y-4">
            {(homepage.giftCardFeatures ?? []).map((feature, index) => (
              <li key={feature.id ?? index} className="flex items-start gap-4 rounded-2xl bg-white/10 p-4">
                <span className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <Icon name={feature.icon} className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-semibold text-white">{feature.title}</h3>
                  <p className="text-sm text-white/75">{feature.description}</p>
                </div>
              </li>
            ))}
          </ul>

          {disclaimer.length > 0 && (
            <Disclaimer
              items={disclaimer}
              lang={lang}
              className="border-t border-white/15 pt-6 text-xs leading-relaxed text-white/65"
              linkClass="underline underline-offset-2 hover:text-white"
            />
          )}
        </div>

        <div className="flex w-full max-w-md flex-col items-center justify-center gap-6 mx-auto lg:mx-0">
          <LocalizedLink
            href={cta.href}
            lang={lang}
            target={cta.target}
            rel="noopener"
            className="block w-full overflow-hidden rounded-3xl border border-white/20 shadow-xl shadow-primary/30 transition hover:scale-105 hover:shadow-primary/50"
          >
            <CdnImage
              media={homepage.giftCardImage}
              className="h-full w-full object-cover"
              sizes="(min-width: 1024px) 30vw, 80vw"
            />
          </LocalizedLink>
          <div className="flex justify-center">
            <LocalizedLink
              href={cta.href}
              lang={lang}
              className={`inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/40 transition hover:brightness-110 ${cta.className ?? ''}`.trim()}
              target={cta.target}
              rel="noopener"
            >
              <Icon name={cta.icon ?? 'gift'} className="h-5 w-5" />
              <span>{cta.label}</span>
            </LocalizedLink>
          </div>
        </div>
      </div>
    </section>
  )
}
