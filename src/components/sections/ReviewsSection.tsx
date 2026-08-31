import { getTranslations, type Lang } from '@/i18n'
import type { Review, SiteConfig } from '@/payload-types'

import Icon from '../Icon'
import SectionEyebrow from '../SectionEyebrow'

type Props = {
  lang: Lang
  reviews: Review[]
  siteConfig: SiteConfig
}

// Cream band: white quote cards separate by surface and a hairline ring, not
// by shadow. Header copy comes from the i18n dictionary (it was hardcoded
// Romanian in legacy); dates keep the legacy ro-RO formatting regardless of locale.
export default function ReviewsSection({ lang, reviews, siteConfig }: Props) {
  const t = getTranslations(lang)

  return (
    <section className="bg-cream" aria-labelledby="reviews-heading">
      <div className="mx-auto w-full max-w-screen-xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>{t.reviews.tagline}</SectionEyebrow>
          <h2
            id="reviews-heading"
            className="mt-5 font-heading text-4xl font-semibold leading-[1.1] text-ink sm:text-5xl"
          >
            {t.reviews.title}
          </h2>
          <p className="mx-auto mt-5 max-w-prose text-base leading-relaxed text-muted-warm">{t.reviews.description}</p>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            /* The whole card links out to the Google reviews page: the author
               anchor's ::after covers it, so the click target is the card while
               the accessible name stays "<author> — see all reviews on Google". */
            <figure
              key={review.id}
              className="group relative flex h-full flex-col justify-between rounded-2xl bg-white p-6 ring-1 ring-ink/10 transition-colors hover:ring-ink/30"
            >
              <div>
                <div
                  className="flex items-center gap-1"
                  aria-label={t.reviews.ratingLabel.replace('{rating}', String(review.rating))}
                >
                  {Array.from({ length: 5 }, (_, index) => (
                    <Icon
                      key={index}
                      name={index < review.rating ? 'star-filled' : 'star'}
                      // Peach on white is only ~1.9:1 — the filled stars carry the
                      // rating visually, so they use ink.
                      className={`h-4 w-4 ${index < review.rating ? 'text-ink' : 'text-ink/20'}`}
                    />
                  ))}
                </div>
                <blockquote className="mt-5 font-serif text-lg leading-relaxed text-ink">
                  &ldquo;{review.text}&rdquo;
                </blockquote>
              </div>
              <figcaption className="mt-8 flex items-end justify-between gap-4 border-t border-ink/10 pt-4">
                <div className="text-sm font-semibold text-ink">
                  <a
                    href={siteConfig.googleReviewsUrl}
                    target="_blank"
                    rel="noopener"
                    className="focus-ring rounded-sm after:absolute after:inset-0 after:rounded-2xl after:content-['']"
                  >
                    {review.author}
                    <span className="sr-only"> — {t.reviews.allOnGoogle}</span>
                  </a>
                  <span className="mt-0.5 block text-xs font-medium uppercase tracking-wide text-muted-warm">
                    {new Date(review.date).toLocaleDateString('ro-RO', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <Icon
                  name="arrow-up-right"
                  className="h-5 w-5 shrink-0 text-muted-warm transition-colors group-hover:text-ink"
                />
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href={siteConfig.googleReviewsUrl}
            className="btn-outline gap-2 text-sm font-semibold uppercase tracking-wide"
            target="_blank"
            rel="noopener"
          >
            <Icon name="message-star" className="h-5 w-5" />
            <span>{t.reviews.allOnGoogle}</span>
          </a>
        </div>
      </div>
    </section>
  )
}
