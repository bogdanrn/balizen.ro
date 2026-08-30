import type { Lang } from '@/i18n'
import type { Homepage } from '@/payload-types'

import CdnImage from '../CdnImage'
import Icon from '../Icon'
import LocalizedLink from '../LocalizedLink'

type Props = {
  lang: Lang
  homepage: Homepage
}

// Port of _legacy AboutSection.astro (section id "despre-noi").
export default function AboutSection({ lang, homepage }: Props) {
  const cta = homepage.aboutCta

  return (
    <section id="despre-noi" className="bg-white">
      <div className="mx-auto grid max-w-screen-xl gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8">
        <div className="space-y-8">
          {homepage.aboutTagline && (
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">{homepage.aboutTagline}</p>
          )}
          <h2 className="font-heading text-3xl font-bold text-slate-900 sm:text-4xl">{homepage.aboutTitle}</h2>
          <p className="text-base leading-relaxed text-slate-600">{homepage.aboutIntro}</p>

          <ul className="space-y-6">
            {(homepage.aboutBullets ?? []).map((item, index) => (
              <li key={item.id ?? index} className="flex items-start gap-4">
                <span className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon name="star" className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>

          <div>
            <LocalizedLink
              href={cta.href}
              lang={lang}
              className={`inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:opacity-90 ${cta.className ?? ''}`.trim()}
              target={cta.target}
              rel="noopener"
            >
              <Icon name={cta.icon ?? 'calendar'} className="h-5 w-5" />
              <span>{cta.label}</span>
            </LocalizedLink>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl shadow-xl shadow-slate-200">
          <CdnImage
            media={homepage.aboutImage}
            className="h-full w-full object-cover"
            sizes="(min-width: 1024px) 40vw, 100vw"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent"></div>
        </div>
      </div>
    </section>
  )
}
