import { getTranslations, type Lang } from '@/i18n'
import type { Homepage, SiteConfig } from '@/payload-types'

import CdnImage from '../CdnImage'
import Icon from '../Icon'
import LocalizedLink from '../LocalizedLink'

type Props = {
  lang: Lang
  homepage: Homepage
  siteConfig: SiteConfig
}

type HeroAction = NonNullable<Homepage['heroActions']>[number]

// Port of _legacy HeroSection.astro. The CMS merged primaryActions and
// secondaryActions into one ordered heroActions list; all render in the legacy
// primaryActions row, with per-action className carrying the visual variant.
// tel: actions keep the legacy location caption below the button.
export default function HeroSection({ lang, homepage, siteConfig }: Props) {
  const t = getTranslations(lang)
  const titleLines = homepage.heroTitle.split('\n')
  const actions = homepage.heroActions ?? []

  const actionClass = (action: HeroAction) =>
    `inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#33291F]/20 px-6 py-3 text-sm font-semibold uppercase tracking-wide transition hover:bg-[#33291F] hover:text-white sm:w-auto ${action.className ?? ''}`.trim()

  const renderAction = (action: HeroAction, index: number) => {
    const link = (
      <LocalizedLink
        href={action.href}
        lang={lang}
        className={actionClass(action)}
        target={action.target}
        rel="noopener"
      >
        {action.icon && <Icon name={action.icon} className="h-5 w-5" />}
        <span>{action.label}</span>
      </LocalizedLink>
    )

    if (action.href?.startsWith('tel:')) {
      return (
        <div key={action.id ?? index} className="flex flex-col items-center gap-1">
          {link}
          <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">
            {t.labels.locationCaption}
          </span>
        </div>
      )
    }

    return <span key={action.id ?? index} className="contents">{link}</span>
  }

  return (
    <section className="relative isolate overflow-hidden bg-slate-100 text-[#33291F]">
      <div className="absolute inset-0">
        <CdnImage media={homepage.heroImage} alt="" className="h-full w-full object-cover object-center" eager />
        <div className="absolute inset-0 bg-white/50 mix-blend-multiply"></div>
      </div>

      <div className="relative mx-auto flex min-h-[90vh] max-w-screen-xl flex-col justify-center gap-12 px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <div className="max-w-4xl text-center lg:text-left">
          {homepage.heroText && (
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80 white">
              {siteConfig.name} <br />
              {homepage.heroText}
            </p>
          )}
          <h1 className="mt-6 font-heading text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-[3.5rem] lg:leading-[1.05] text-[#33291F]">
            {titleLines.map((line, index) => (
              <span key={index} className="contents">
                {line}
                {index < titleLines.length - 1 && <br />}
              </span>
            ))}
          </h1>
          <div className="mt-8 space-y-4 text-lg leading-relaxed text-[#33291F] sm:text-xl">
            {(homepage.heroSubtitle ?? []).map((paragraph) => (
              <p key={paragraph.id ?? paragraph.line}>{paragraph.line}</p>
            ))}
          </div>

          {actions.length > 0 && (
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center lg:items-center lg:justify-start">
              {actions.map(renderAction)}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
