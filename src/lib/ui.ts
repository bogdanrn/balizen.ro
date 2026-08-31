// Every CTA-shaped CMS field (heroActions, aboutCta, servicesCta,
// subscriptionAction, giftCardCta, ctaButton) carries a `variant` plus a free
// `className` that still holds legacy styling from the Astro site
// (bg-[#33291F] text-white shadow-lg hover:opacity-90 …). That styling fights
// the warm palette — it produced ink-on-ink buttons and drop-shadowed pills —
// so it is ignored entirely: the look comes from `variant`, and the only
// tokens kept from `className` are the js-* hooks that analytics and the
// booking modal delegate on (js-programari-button, js-contact-button,
// js-location-button). Never filter those out.

export type CtaVariant = 'primary' | 'secondary' | null | undefined

export type CtaLike = {
  variant?: CtaVariant
  className?: string | null
}

export const hookClasses = (className: string | null | undefined): string =>
  (className ?? '')
    .split(/\s+/)
    .filter((token) => token.startsWith('js-'))
    .join(' ')

type Options = {
  /** Pill utility for variant "primary". Override on bands where peach-on-peach would vanish. */
  primary?: string
  /** Pill utility for variant "secondary" (and for actions with no variant set). */
  secondary?: string
  /** Extra layout classes appended after the variant utility. */
  extra?: string
}

export const ctaClass = (action: CtaLike, options: Options = {}): string => {
  const { primary = 'btn-primary', secondary = 'btn-outline', extra } = options
  return [action.variant === 'secondary' ? secondary : primary, extra, hookClasses(action.className)]
    .filter(Boolean)
    .join(' ')
}
