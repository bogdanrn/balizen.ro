'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'

import { trackGtag } from '@/lib/analytics'

import Icon from './Icon'

export type ActionMenuSubAction = {
  key: string
  href: string
  icon: string
  /** Icon-only button: this is its only accessible name. */
  ariaLabel: string
  target?: string | null
  /** js-* hook so SiteInteractions' fbq delegation still fires, e.g. js-location-button. */
  hookClass?: string
}

export type ActionMenuOption = {
  key: string
  label: string
  /**
   * External URL, tel:, or an in-page fragment (#servicii). Fragments stay plain
   * anchors on purpose: a Next <Link> to "/#servicii" triggers a router
   * navigation, which on these force-dynamic pages refetches the whole page
   * from the database instead of jumping to the section.
   */
  href: string
  icon?: string | null
  /** js-* hook so SiteInteractions' fbq + booking consent delegation still fires. */
  hookClass?: string
  target?: string | null
  variant?: 'primary' | 'outline'
  /** Accessible name when the visible label is not enough (e.g. "Call"). */
  ariaLabel?: string
  /**
   * Renders this option as a combined control: the option itself plus a
   * right-hand strip of icon-only buttons (e.g. Waze/Apple Maps next to a
   * Google Maps link for the same place).
   */
  actions?: ActionMenuSubAction[]
}

type Props = {
  options: ActionMenuOption[]
  triggerClassName: string
  /** Visible trigger text. Omit for an icon-only trigger (then pass triggerAriaLabel). */
  triggerLabel?: string
  triggerIcon?: string | null
  /** Icon swapped in while open — icon-only triggers use this to show a close affordance. */
  triggerOpenIcon?: string | null
  triggerAriaLabel?: string
  triggerTabIndex?: number
  /** Value sent as `location` on the gtag cta_open event. */
  analyticsLocation?: string
  /** Positioning context for the trigger + popup. Must stay `relative`. */
  wrapClassName?: string
}

// A disclosure that turns one CTA into a small picker of ways to get in touch.
// It is deliberately NOT a dialog: no focus trap, no scroll lock — Escape and
// an outside tap close it, and focus moves to the first option on open.
//
// The js-* hooks live on the options, never on the trigger, so the analytics
// event and the booking consent modal fire on the choice the visitor actually
// made rather than on opening the menu.
export default function ActionMenu({
  options,
  triggerClassName,
  triggerLabel,
  triggerIcon,
  triggerOpenIcon,
  triggerAriaLabel,
  triggerTabIndex,
  analyticsLocation,
  wrapClassName = 'relative w-full sm:w-auto',
}: Props) {
  const menuId = useId()
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Enter transition without a second render pass: the panel is rendered in its
  // "from" state (already correctly positioned), then the next frame drops those
  // classes so the transition runs. Keeping it out of React state avoids a
  // cascading render on every open.
  const attachMenu = useCallback((node: HTMLDivElement | null) => {
    menuRef.current = node
    if (!node) return
    const frame = requestAnimationFrame(() => {
      node.classList.remove('scale-95', 'opacity-0')
      node.classList.add('scale-100', 'opacity-100')
    })
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (wrapRef.current?.contains(event.target as Node)) return
      setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('touchstart', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('touchstart', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    menuRef.current?.querySelector<HTMLElement>('a, button')?.focus()
  }, [open])

  const toggle = useCallback(() => {
    setOpen((wasOpen) => {
      if (!wasOpen && analyticsLocation) trackGtag('cta_open', { location: analyticsLocation })
      return !wasOpen
    })
  }, [analyticsLocation])

  const close = useCallback(() => setOpen(false), [])

  const optionClass = (option: ActionMenuOption) =>
    [
      option.variant === 'primary' ? 'btn-primary' : 'btn-outline',
      'w-full justify-start gap-3 px-5 py-3 text-sm font-semibold uppercase tracking-wide',
      option.hookClass,
    ]
      .filter(Boolean)
      .join(' ')

  // A split row reads as one control: the wrapper owns the pill shape and
  // clips both segments into it, so the main link keeps optionClass's colors
  // but none of its own rounding.
  const splitWrapClass = (option: ActionMenuOption) =>
    [
      'flex w-full items-stretch overflow-hidden rounded-full',
      option.variant === 'primary' ? 'border border-primary bg-primary' : 'ring-1 ring-inset ring-ink/20',
    ].join(' ')

  // Same focus color as .btn's own focus-visible ring, but inset: the
  // wrapper's overflow-hidden (needed to clip the pill's outer corners) would
  // otherwise cut off the usual outline-based focus-ring, since that draws
  // outside the element and both segments sit flush against the wrapper edge.
  const SPLIT_FOCUS_CLASS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/70'

  const splitMainClass = (option: ActionMenuOption) =>
    [
      // min-w-0 lets the flex item shrink past its content width, which is what
      // makes the label's truncate actually clip instead of wrapping to a
      // second line next to the icon buttons.
      'inline-flex min-h-11 min-w-0 flex-1 items-center gap-3 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-ink transition duration-200 ease-in',
      SPLIT_FOCUS_CLASS,
      option.variant === 'primary' ? 'hover:bg-[#F59E5E]' : 'hover:bg-ink hover:text-cream',
      option.hookClass,
    ]
      .filter(Boolean)
      .join(' ')

  const splitActionClass = (action: ActionMenuSubAction) =>
    [
      'inline-flex h-11 w-11 shrink-0 items-center justify-center border-l border-ink/15 text-ink transition-colors hover:bg-ink hover:text-cream',
      SPLIT_FOCUS_CLASS,
      action.hookClass,
    ]
      .filter(Boolean)
      .join(' ')

  return (
    <div ref={wrapRef} className={wrapClassName}>
      {open && (
        // Outer element owns the centering translate; the inner one owns the
        // enter transition, so scaling never fights the -50% offset. The menu
        // emerges upward out of the trigger, hence origin-bottom.
        <div className="absolute bottom-full left-1/2 z-10 mb-3 w-[min(20rem,calc(100vw-2rem))] -translate-x-1/2">
          <div
            ref={attachMenu}
            id={menuId}
            className="origin-bottom scale-95 rounded-3xl bg-cream p-3 opacity-0 ring-1 ring-ink/15 transition duration-150 ease-out motion-reduce:transition-none"
          >
            <div className="flex flex-col gap-2">
              {/* Never preventDefault on any of these: the menu closes and the
                  anchor's own navigation (external URL, tel:, or in-page hash)
                  proceeds. */}
              {options.map((option) =>
                option.actions?.length ? (
                  <div key={option.key} className={splitWrapClass(option)}>
                    <a
                      href={option.href}
                      target={option.target ?? undefined}
                      rel={option.target === '_blank' ? 'noopener' : undefined}
                      className={splitMainClass(option)}
                      aria-label={option.ariaLabel}
                      onClick={close}
                    >
                      {option.icon && <Icon name={option.icon} className="h-5 w-5 shrink-0" />}
                      <span className="truncate">{option.label}</span>
                    </a>
                    {option.actions.map((action) => (
                      <a
                        key={action.key}
                        href={action.href}
                        target={action.target ?? undefined}
                        rel={action.target === '_blank' ? 'noopener' : undefined}
                        className={splitActionClass(action)}
                        aria-label={action.ariaLabel}
                        onClick={close}
                      >
                        <Icon name={action.icon} className="h-5 w-5" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <a
                    key={option.key}
                    href={option.href}
                    target={option.target ?? undefined}
                    rel={option.target === '_blank' ? 'noopener' : undefined}
                    className={optionClass(option)}
                    aria-label={option.ariaLabel}
                    onClick={close}
                  >
                    {option.icon && <Icon name={option.icon} className="h-5 w-5" />}
                    <span>{option.label}</span>
                  </a>
                ),
              )}
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={triggerAriaLabel}
        tabIndex={triggerTabIndex}
        className={triggerClassName}
      >
        {open && triggerOpenIcon ? (
          <Icon name={triggerOpenIcon} className="h-6 w-6" />
        ) : (
          triggerIcon && (
            <Icon name={triggerIcon} className={triggerLabel ? 'h-5 w-5' : 'h-6 w-6'} />
          )
        )}
        {triggerLabel && <span>{triggerLabel}</span>}
      </button>
    </div>
  )
}
