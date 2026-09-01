import { getTranslations, type Lang } from '@/i18n'
import { ctaClass } from '@/lib/ui'
import type { Homepage, SiteConfig, Subscription } from '@/payload-types'

import ActionMenu, { type ActionMenuOption } from '../ActionMenu'
import CdnImage from '../CdnImage'
import Disclaimer from '../Disclaimer'
import SectionEyebrow from '../SectionEyebrow'

type Props = {
  lang: Lang
  homepage: Homepage
  subscriptions: Subscription[]
  siteConfig: SiteConfig
}

// White band. Each subscription is a cream panel; the image side alternates on
// desktop and always leads on mobile. The shared action comes from
// homepage.subscriptionAction, the disclaimer from homepage.subscriptionDisclaimer.
export default function SubscriptionsSection({ lang, homepage, subscriptions, siteConfig }: Props) {
  const t = getTranslations(lang)
  const action = homepage.subscriptionAction
  const disclaimer = (homepage.subscriptionDisclaimer ?? []).map((item) => item.line)

  // Subscriptions convert through a conversation, not the booking site, so the
  // action is a direct WhatsApp button (js-contact-button keeps the fbq
  // Contact event firing). It goes through ActionMenu's single-option
  // segmented mode — same wiring as the pickers, so adding a second option
  // later upgrades it to a full picker with a chevron for free.
  const whatsappOptions: ActionMenuOption[] = [
    {
      key: 'whatsapp',
      label: t.buttons.whatsapp,
      href: siteConfig.whatsappUrl,
      icon: 'brand-whatsapp',
      target: '_blank',
      hookClass: 'js-contact-button',
    },
  ]

  return (
    <section id="abonamente" className="border-t border-ink/10 bg-white">
      <div className="mx-auto w-full max-w-screen-xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>{t.subscriptions.tagline}</SectionEyebrow>
          <h2 className="mt-5 font-heading text-4xl font-semibold leading-[1.1] text-ink sm:text-5xl">
            {t.subscriptions.title}
          </h2>
          <p className="mx-auto mt-5 max-w-prose text-base leading-relaxed text-muted-warm">
            {t.subscriptions.description}
          </p>
        </div>

        <div className="mt-16 space-y-8">
          {subscriptions.map((subscription, index) => {
            const isReversed = index % 2 === 1

            return (
              <article
                key={subscription.id}
                id={String(subscription.id)}
                className="grid gap-8 rounded-3xl bg-cream p-5 ring-1 ring-ink/10 sm:p-8 lg:grid-cols-[0.6fr_0.4fr] lg:gap-12"
              >
                <div className="order-2 self-center lg:order-none">
                  <SectionEyebrow>{t.subscriptions.subscriptionLabel}</SectionEyebrow>

                  <h3 className="mt-4 font-heading text-3xl font-semibold leading-[1.15] text-ink sm:text-4xl">
                    {subscription.title}
                  </h3>

                  <p className="mt-4 max-w-prose text-sm leading-relaxed text-muted-warm">
                    {subscription.summary}
                  </p>

                  <ul className="mt-6 space-y-3 text-sm text-ink">
                    {subscription.highlights.map((highlight, highlightIndex) => (
                      <li key={highlight.id ?? highlightIndex} className="flex items-start gap-3">
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                        />
                        <span className="leading-relaxed">{highlight.text}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 flex">
                    <ActionMenu
                      options={whatsappOptions}
                      segmented
                      triggerLabel={t.buttons.orderSubscription}
                      triggerIcon="brand-whatsapp"
                      // Variant only: the CMS js-programari-button hook must NOT
                      // ride on this trigger, or the booking consent modal
                      // would open instead of the WhatsApp conversation.
                      triggerClassName={ctaClass(
                        { variant: action.variant },
                        {
                          extra:
                            'w-full gap-2 px-5 py-3 text-sm font-semibold uppercase tracking-wide sm:w-auto',
                        },
                      )}
                    />
                  </div>
                </div>

                <div
                  className={`order-1 aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-accent lg:order-none ${
                    isReversed ? 'lg:order-first' : ''
                  }`}
                >
                  <CdnImage
                    media={subscription.image}
                    className="h-full w-full object-cover object-center"
                    sizes="(min-width: 1024px) 35vw, 100vw"
                  />
                </div>
              </article>
            )
          })}
        </div>

        {disclaimer.length > 0 && (
          <Disclaimer
            items={disclaimer}
            lang={lang}
            className="mx-auto mt-12 max-w-3xl text-center text-xs leading-relaxed text-muted-warm"
            linkClass="focus-ring rounded-sm text-ink underline underline-offset-4 transition-colors hover:text-muted-warm"
          />
        )}
      </div>
    </section>
  )
}
