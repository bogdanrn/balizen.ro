import { getTranslations, type Lang } from '@/i18n'
import type { Homepage, Subscription } from '@/payload-types'

import CdnImage from '../CdnImage'
import Disclaimer from '../Disclaimer'
import LocalizedLink from '../LocalizedLink'

type Props = {
  lang: Lang
  homepage: Homepage
  subscriptions: Subscription[]
}

// Port of _legacy SubscriptionsSection.astro (section id "abonamente").
// The shared action comes from homepage.subscriptionAction, the disclaimer
// lines from homepage.subscriptionDisclaimer.
export default function SubscriptionsSection({ lang, homepage, subscriptions }: Props) {
  const t = getTranslations(lang)
  const action = homepage.subscriptionAction
  const disclaimer = (homepage.subscriptionDisclaimer ?? []).map((item) => item.line)

  return (
    <section id="abonamente" className="bg-white">
      <div className="mx-auto max-w-screen-xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">{t.subscriptions.tagline}</p>
          <h2 className="mt-4 font-heading text-3xl font-bold text-slate-900 sm:text-4xl">{t.subscriptions.title}</h2>
          <p className="mt-3 text-base text-slate-600">{t.subscriptions.description}</p>
        </div>

        <div className="mt-16 space-y-16">
          {subscriptions.map((subscription, index) => {
            const isReversed = index % 2 === 1

            return (
              <article
                key={subscription.id}
                className="group grid gap-6 rounded-3xl border border-slate-200 bg-slate-50/60 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg lg:gap-10 lg:grid-cols-[0.6fr_0.4fr]"
                id={String(subscription.id)}
              >
                <div className="space-y-6 self-center order-2 lg:order-none">
                  <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-primary">
                    <span>{t.subscriptions.subscriptionLabel}</span>
                  </div>
                  <h3 className="font-heading text-2xl font-semibold text-slate-900">{subscription.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{subscription.summary}</p>

                  <ul className="space-y-3 text-sm text-slate-700">
                    {subscription.highlights.map((highlight, highlightIndex) => (
                      <li key={highlight.id ?? highlightIndex} className="flex items-start gap-3">
                        <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <svg
                            className="h-3 w-3"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                          >
                            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        <span>{highlight.text}</span>
                      </li>
                    ))}
                  </ul>

                  <div>
                    <LocalizedLink
                      href={action.href}
                      lang={lang}
                      className={`inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:opacity-90 ${action.className ?? ''}`.trim()}
                      target={action.target}
                      rel="noopener"
                    >
                      {action.label}
                    </LocalizedLink>
                  </div>
                </div>

                <div
                  className={`relative h-64 w-full overflow-hidden rounded-3xl lg:h-96 ${isReversed ? 'lg:order-first' : ''}`}
                >
                  <CdnImage
                    media={subscription.image}
                    className="absolute inset-0 h-full w-full object-cover object-center shadow-md shadow-slate-200 transition-transform duration-500 group-hover:scale-110"
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
            className="mx-auto mt-10 max-w-3xl text-center text-xs leading-relaxed text-slate-500"
            linkClass="underline underline-offset-2 text-primary hover:text-primary/80"
          />
        )}
      </div>
    </section>
  )
}
