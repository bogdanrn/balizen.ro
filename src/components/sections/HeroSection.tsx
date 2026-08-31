import { Fragment } from 'react'

import { getTranslations, type Lang } from '@/i18n'
import { ctaClass } from '@/lib/ui'
import type { Homepage, SiteConfig } from '@/payload-types'

import CdnImage from '../CdnImage'
import HeroActionMenu from '../HeroActionMenu'
import Icon from '../Icon'
import LocalizedLink from '../LocalizedLink'
import SectionEyebrow from '../SectionEyebrow'

type Props = {
  lang: Lang
  homepage: Homepage
  siteConfig: SiteConfig
}

type HeroAction = NonNullable<Homepage['heroActions']>[number]

// Full-bleed photographic hero, as on the legacy Astro site: the image is the
// background, a cream scrim carries the type. Action styling is driven by each
// action's `variant` field — the CMS className is a behavior-hook field only
// (see lib/ui), so the legacy per-button color soup never reaches the DOM.
//
// The first primary action becomes the contact picker (HeroActionMenu) instead
// of a direct link; the js-programari-button hook moves onto the menu's booking
// option. Any further actions render as ordinary pills.
export default function HeroSection({ lang, homepage, siteConfig }: Props) {
  const t = getTranslations(lang)
  const actions = homepage.heroActions ?? []
  const menuActionId = actions.find((action) => action.variant !== 'secondary')?.id

  const renderAction = (action: HeroAction, index: number) => {
    if (action.id && action.id === menuActionId) {
      return (
        <HeroActionMenu
          key={action.id}
          lang={lang}
          label={action.label}
          icon={action.icon}
          bookingUrl={siteConfig.bookingUrl}
          whatsappUrl={siteConfig.whatsappUrl}
          phone={siteConfig.phone}
          phoneHref={siteConfig.phoneHref}
        />
      )
    }

    const link = (
      <LocalizedLink
        href={action.href}
        lang={lang}
        className={ctaClass(action, {
          secondary: 'btn-scrim',
          extra: 'w-full gap-2 text-sm font-semibold uppercase tracking-wide sm:w-auto',
        })}
        target={action.target}
        rel="noopener"
      >
        {action.icon && <Icon name={action.icon} className="h-5 w-5" />}
        <span>{action.label}</span>
      </LocalizedLink>
    )

    // tel: actions keep the legacy caption naming the branch you reach.
    if (action.href?.startsWith('tel:')) {
      return (
        <div key={action.id ?? index} className="flex w-full flex-col items-center gap-1.5 sm:w-auto">
          {link}
          <span className="text-xs font-medium text-muted-warm">{t.labels.locationCaption}</span>
        </div>
      )
    }

    return <Fragment key={action.id ?? index}>{link}</Fragment>
  }

  return (
    <section className="relative isolate overflow-hidden bg-cream text-ink">
      <div className="absolute inset-0">
        <CdnImage
          media={homepage.heroImage}
          alt=""
          className="hero-drift h-full w-full object-cover object-center motion-safe:animate-[hero-drift_24s_ease-in-out_infinite_alternate]"
          sizes="100vw"
          eager
        />
        {/* Legibility scrim. The copy is centered up to the lg breakpoint, so a
            flat wash is what keeps it readable there; from lg the copy moves
            left and a horizontal gradient reveals the right of the photograph. */}
        <div aria-hidden="true" className="absolute inset-0 bg-cream/80 lg:hidden" />
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden bg-gradient-to-r from-cream via-cream/85 to-cream/30 lg:block"
        />
      </div>

      <div className="relative mx-auto flex min-h-[90vh] w-full max-w-screen-xl flex-col justify-center px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
          {homepage.heroText && <SectionEyebrow>{homepage.heroText}</SectionEyebrow>}

          <h1 className="mt-6 whitespace-pre-line font-heading text-4xl font-semibold leading-[1.05] text-ink sm:text-5xl lg:text-6xl xl:text-7xl">
            {homepage.heroTitle}
          </h1>

          <div className="mt-8 space-y-4 text-lg leading-relaxed text-muted-warm sm:text-xl">
            {(homepage.heroSubtitle ?? []).map((paragraph) => (
              <p key={paragraph.id ?? paragraph.line}>{paragraph.line}</p>
            ))}
          </div>

          {actions.length > 0 && (
            <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-center sm:gap-4 lg:justify-start">
              {actions.map(renderAction)}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
