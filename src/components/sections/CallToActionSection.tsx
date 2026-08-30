import type { Lang } from '@/i18n'
import type { Homepage } from '@/payload-types'

import Icon from '../Icon'
import LocalizedLink from '../LocalizedLink'

type Props = {
  lang: Lang
  homepage: Homepage
}

// Port of _legacy CallToActionSection.astro (section id "programare").
export default function CallToActionSection({ lang, homepage }: Props) {
  const cta = homepage.ctaButton

  return (
    <section id="programare" className="relative overflow-hidden bg-primary text-white">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)',
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0',
        }}
      ></div>

      <div className="relative mx-auto flex max-w-screen-xl flex-col items-center gap-8 px-4 py-20 text-center sm:px-6 lg:px-8">
        <Icon name="calendar" className="h-12 w-12 text-white" />
        <h2 className="font-heading text-3xl font-bold sm:text-4xl">{homepage.ctaTitle}</h2>
        <p className="max-w-2xl text-base text-white/90">{homepage.ctaSubtitle}</p>
        <LocalizedLink
          href={cta.href}
          lang={lang}
          className={`inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary shadow-lg shadow-slate-800/30 transition hover:opacity-90 ${cta.className ?? ''}`.trim()}
          target={cta.target}
          rel="noopener"
        >
          <Icon name={cta.icon ?? 'calendar'} className="h-5 w-5" />
          <span>{cta.label}</span>
        </LocalizedLink>
      </div>
    </section>
  )
}
