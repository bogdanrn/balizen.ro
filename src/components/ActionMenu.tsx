'use client'

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'

import { trackGtag } from '@/lib/analytics'

import Icon from './Icon'

// useLayoutEffect warns during SSR; the picker only opens client-side, but
// the hook list runs on the server render too — pick per environment.
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

type Placement = {
  left: number
  top?: number
  bottom?: number
  maxHeight: number
}

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
  /**
   * Visible trigger text. Omit to default to the first option's label
   * (segmented mode) or render an icon-only trigger.
   */
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
  /** Small heading shown above the options inside the panel. */
  title?: string
  /** Which way the panel emerges out of the trigger. */
  direction?: 'up' | 'down'
  /**
   * Split-pill trigger: the left segment fires options[0] directly (its href,
   * target and js-* hook ride on it), the chevron segment opens the panel.
   * With a single option it degrades to a plain direct anchor — same wiring,
   * no chevron, no panel — so adding a second option later upgrades the
   * control to a picker for free.
   */
  segmented?: boolean
  /** Pill colors for the segmented left segment. */
  triggerVariant?: 'primary' | 'secondary'
  /** Accessible name for the chevron segment (segmented mode). */
  chevronLabel?: string
}

// A disclosure that turns one CTA into a small picker of ways to get in touch.
// It is deliberately NOT a dialog: no focus trap, no scroll lock — Escape and
// an outside tap close it, and focus moves to the first option on open.
//
// The js-* hooks live on the options (and the segmented left segment), never
// on the toggle, so the analytics event and the booking consent modal fire on
// the choice the visitor actually made rather than on opening the menu.
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
  title,
  direction = 'up',
  segmented = false,
  triggerVariant = 'primary',
  chevronLabel,
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
      option.variant === 'primary'
        ? 'border border-primary bg-primary'
        : 'ring-1 ring-inset ring-ink/20',
    ].join(' ')

  // Same focus color as .btn's own focus-visible ring, but inset: the
  // wrapper's overflow-hidden (needed to clip the pill's outer corners) would
  // otherwise cut off the usual outline-based focus-ring, since that draws
  // outside the element and both segments sit flush against the wrapper edge.
  const SPLIT_FOCUS_CLASS =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/70'

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

  // Segmented trigger: one clipped pill, direct action on the left, chevron
  // toggle on the right. Variant colors live on the wrapper (same model as the
  // split rows above); the left segment only carries the caller's sizing
  // classes so nothing fights the clipped focus ring.
  const SEGMENTED_WRAP_CLASS = {
    primary: 'border border-primary bg-primary text-ink',
    secondary: 'bg-ink text-cream',
  }[triggerVariant]

  const SEGMENTED_LEFT_HOVER = {
    primary: 'hover:bg-[#F59E5E]',
    secondary: 'hover:bg-[#4A3B2C]',
  }[triggerVariant]

  const segmentedLeftClass = (option: ActionMenuOption) =>
    [
      'inline-flex min-h-11 min-w-0 flex-1 items-center justify-center transition duration-200 ease-in',
      SEGMENTED_LEFT_HOVER,
      SPLIT_FOCUS_CLASS,
      option.hookClass,
      triggerClassName,
    ]
      .filter(Boolean)
      .join(' ')

  // Divider/hover tinted from the pill's own text color (color-mix on
  // currentColor), so one class list works on peach and ink pills alike.
  const segmentedChevronClass = [
    'inline-flex h-11 w-11 shrink-0 items-center justify-center border-l border-current/20 transition-colors hover:bg-current/10',
    SPLIT_FOCUS_CLASS,
  ].join(' ')

  const direct = segmented ? options[0] : undefined
  const directLabel = triggerLabel ?? direct?.label
  const directIcon = triggerIcon ?? direct?.icon

  const panelOrigin = direction === 'down' ? 'origin-top' : 'origin-bottom'

  // The panel is anchored to the trigger, but placed by JS: centered on it,
  // then clamped inside the viewport, so it opens correctly no matter where
  // the button sits (screen-edge header pill, docked selector, mid-page).
  // Vertically it prefers the caller's `direction` and flips to the other
  // side when that side lacks room; whichever side it opens on also caps the
  // panel height there, so an over-long list scrolls instead of clipping.
  const [placement, setPlacement] = useState<Placement | null>(null)

  const place = useCallback(() => {
    const wrap = wrapRef.current
    const panel = menuRef.current
    if (!wrap || !panel) return
    const rect = wrap.getBoundingClientRect()
    const margin = 16
    const gap = 12
    const width = panel.offsetWidth
    const height = panel.offsetHeight
    if (!width || !height) return
    const vw = window.innerWidth
    const vh = window.innerHeight

    // Centered on the trigger, then clamped inside the viewport. The panel is
    // absolutely positioned inside the wrapper, so the clamped viewport x has
    // to be converted back into an offset from the wrapper's own left edge.
    const viewportLeft = Math.min(
      Math.max(margin, rect.left + rect.width / 2 - width / 2),
      vw - margin - width,
    )
    const left = viewportLeft - rect.left

    const spaceAbove = rect.top - gap
    const spaceBelow = vh - rect.bottom - gap
    let openUp = direction === 'up'
    if (openUp && spaceAbove < height && spaceBelow > spaceAbove) openUp = false
    if (!openUp && spaceBelow < height && spaceAbove > spaceBelow) openUp = true

    setPlacement({
      left,
      top: openUp ? undefined : rect.height + gap,
      bottom: openUp ? rect.height + gap : undefined,
      maxHeight: Math.max(openUp ? spaceAbove : spaceBelow, 160),
    })
  }, [direction])

  useIsomorphicLayoutEffect(() => {
    if (!open) return
    place()
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    return () => {
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place, true)
    }
  }, [open, place])

  const renderPanel = () =>
    open && (
      // Outer element carries the JS-computed placement; the inner one owns
      // the enter transition, so scaling never fights the position.
      <div
        className="absolute z-10"
        style={
          placement
            ? { left: placement.left, top: placement.top, bottom: placement.bottom }
            : undefined
        }
      >
        <div
          ref={attachMenu}
          id={menuId}
          style={placement ? { maxHeight: placement.maxHeight } : undefined}
          className={`${panelOrigin} w-[min(20rem,calc(100vw-2rem))] scale-95 overflow-y-auto rounded-3xl bg-cream p-3 opacity-0 ring-1 ring-ink/15 transition duration-150 ease-out motion-reduce:transition-none`}
        >
          {title && (
            <p className="px-2 pb-2 pt-1 font-heading text-sm font-semibold uppercase tracking-wide text-muted-warm">
              {title}
            </p>
          )}
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
    )

  // Degenerate segmented case: one option is not a picker. Render it as a
  // plain direct anchor — the caller's triggerClassName carries the full pill
  // styling here — and skip the toggle state entirely.
  if (segmented && options.length === 1 && direct) {
    return (
      <div ref={wrapRef} className={wrapClassName}>
        <a
          href={direct.href}
          target={direct.target ?? undefined}
          rel={direct.target === '_blank' ? 'noopener' : undefined}
          className={[triggerClassName, direct.hookClass].filter(Boolean).join(' ')}
          aria-label={triggerAriaLabel ?? direct.ariaLabel ?? (directLabel || direct.label)}
        >
          {directIcon && <Icon name={directIcon} className="h-5 w-5" />}
          {directLabel && <span>{directLabel}</span>}
        </a>
      </div>
    )
  }

  return (
    <div ref={wrapRef} className={wrapClassName}>
      {renderPanel()}

      {segmented && direct ? (
        // One clipped pill, direct action on the left, chevron toggle on the
        // right.
        <div
          className={`inline-flex w-full items-stretch overflow-hidden rounded-full sm:w-auto ${SEGMENTED_WRAP_CLASS}`}
        >
          <a
            href={direct.href}
            target={direct.target ?? undefined}
            rel={direct.target === '_blank' ? 'noopener' : undefined}
            aria-label={direct.ariaLabel ?? (directLabel || direct.label)}
            className={segmentedLeftClass(direct)}
          >
            {directIcon && <Icon name={directIcon} className="h-5 w-5 shrink-0" />}
            {directLabel && <span className="truncate">{directLabel}</span>}
          </a>
          <button
            type="button"
            onClick={toggle}
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={chevronLabel ?? triggerAriaLabel}
            tabIndex={triggerTabIndex}
            className={segmentedChevronClass}
          >
            <Icon
              name="chevron-down"
              className={`h-5 w-5 motion-safe:transition-transform motion-safe:duration-200 ${
                open ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>
      ) : (
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
      )}
    </div>
  )
}
