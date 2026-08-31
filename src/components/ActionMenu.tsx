'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'

import { trackGtag } from '@/lib/analytics'

import Icon from './Icon'

export type ActionMenuOption = {
  key: string
  label: string
  /**
   * External URL, tel:, or an in-page fragment (#servicii). Fragments stay plain
   * anchors on purpose: a Next <Link> to "/#servicii" triggers a router
   * navigation, which on these force-dynamic pages refetches the page from D1
   * instead of jumping to the section.
   */
  href: string
  icon?: string | null
  /** js-* hook so SiteInteractions' fbq + booking consent delegation still fires. */
  hookClass?: string
  target?: string | null
  variant?: 'primary' | 'outline'
  /** Accessible name when the visible label is not enough (e.g. "Call"). */
  ariaLabel?: string
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
              {options.map((option) => (
                <a
                  key={option.key}
                  href={option.href}
                  target={option.target ?? undefined}
                  rel={option.target === '_blank' ? 'noopener' : undefined}
                  className={optionClass(option)}
                  aria-label={option.ariaLabel}
                  // Never preventDefault here: the menu closes and the anchor's
                  // own navigation (external URL, tel:, or in-page hash) proceeds.
                  onClick={close}
                >
                  {option.icon && <Icon name={option.icon} className="h-5 w-5" />}
                  <span>{option.label}</span>
                </a>
              ))}
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
