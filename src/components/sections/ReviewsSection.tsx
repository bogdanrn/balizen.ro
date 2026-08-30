import { getTranslations, type Lang } from '@/i18n'
import type { Review, SiteConfig } from '@/payload-types'

import Icon from '../Icon'

type Props = {
  lang: Lang
  reviews: Review[]
  siteConfig: SiteConfig
}

// Port of _legacy ReviewsSection.astro. Header copy comes from the i18n
// dictionary (it was hardcoded Romanian in legacy); dates keep the legacy
// ro-RO formatting regardless of locale.
export default function ReviewsSection({ lang, reviews, siteConfig }: Props) {
  const t = getTranslations(lang)

  return (
    <section className="bg-slate-100" aria-labelledby="reviews-heading">
      <div className="mx-auto max-w-screen-xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">{t.reviews.tagline}</p>
          <h2 id="reviews-heading" className="mt-4 font-heading text-3xl font-bold text-slate-900 sm:text-4xl">
            {t.reviews.title}
          </h2>
          <p className="mt-3 text-base text-slate-600">{t.reviews.description}</p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <figure
              key={review.id}
              className="flex h-full flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="space-y-4">
                <div
                  className="flex items-center gap-2"
                  aria-label={t.reviews.ratingLabel.replace('{rating}', String(review.rating))}
                >
                  {Array.from({ length: 5 }, (_, index) => (
                    <Icon
                      key={index}
                      name={index < review.rating ? 'star-filled' : 'star'}
                      className={`h-5 w-5 ${index < review.rating ? 'text-amber-400' : 'text-slate-300'}`}
                    />
                  ))}
                </div>
                <blockquote className="text-sm leading-relaxed text-slate-700">“{review.text}”</blockquote>
              </div>
              <figcaption className="mt-6 text-sm font-semibold text-slate-900">
                {review.author}
                <span className="block text-xs font-medium uppercase tracking-wide text-slate-400">
                  {new Date(review.date).toLocaleDateString('ro-RO', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href={siteConfig.googleReviewsUrl}
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary shadow-lg shadow-primary/20 transition hover:text-primary/80"
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
