'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'

import { getTranslations, type Lang } from '@/i18n'

import ActionMenu, { type ActionMenuOption } from './ActionMenu'

type Props = {
  lang: Lang
  /** Label of the hero's primary CMS action; the menu replaces its direct link. */
  label: string
  icon?: string | null
  bookingUrl: string
  whatsappUrl: string
  phone: string
  phoneHref: string
}

// The hero's primary CTA is a disclosure, not a link: it opens the four ways to
// reach the salon. The js-programari-button hook lives on the booking option
// inside the menu, so SiteInteractions' fbq ViewContent + booking consent flow
// fire on the actual booking choice rather than on opening the menu.
//
// On mobile the button also docks to the bottom of the viewport once its
// in-hero position scrolls off the top. An in-flow sentinel drives the
// IntersectionObserver, so nothing is measured during layout and the hero never
// shifts. Desktop never docks — the sticky header keeps its own booking CTA.
const MOBILE_QUERY = '(max-width: 1023px)'

// False while server-rendering, true once hydrated — the portal needs a real
// document. Done with useSyncExternalStore rather than a setState-in-effect so
// hydration does not cost an extra render pass.
const noopSubscribe = () => () => {}
const useIsHydrated = () =>
  useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  )

export default function HeroActionMenu({
  lang,
  label,
  icon,
  bookingUrl,
  whatsappUrl,
  phone,
  phoneHref,
}: Props) {
  const t = getTranslations(lang)

  const [pastHero, setPastHero] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const hydrated = useIsHydrated()

  const docked = pastHero && isMobile

  useEffect(() => {
    const query = window.matchMedia(MOBILE_QUERY)
    const update = () => setIsMobile(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  const options: ActionMenuOption[] = [
    {
      key: 'book',
      label: t.buttons.bookHere,
      href: bookingUrl,
      icon: 'calendar',
      target: '_blank',
      hookClass: 'js-programari-button',
      variant: 'primary',
    },
    {
      key: 'whatsapp',
      label: t.buttons.whatsapp,
      href: whatsappUrl,
      icon: 'brand-whatsapp',
      target: '_blank',
      hookClass: 'js-contact-button',
    },
    {
      key: 'phone',
      label: phone,
      href: phoneHref,
      icon: 'phone',
      hookClass: 'js-contact-button',
    },
    {
      key: 'services',
      label: t.services.listLabel,
      // Plain in-page fragment: works identically in both locales and jumps
      // instead of triggering a router refetch.
      href: '#servicii',
      icon: 'list',
    },
  ]

  return (
    <>
      {/* Natural position. The sentinel stays in flow whether or not the button
          is docked, so docking never shifts the hero layout. */}
      <div ref={sentinelRef} className="w-full sm:w-auto">
        <ActionMenu
          options={options}
          analyticsLocation="inline"
          triggerLabel={label}
          triggerIcon={icon}
          triggerClassName="btn-primary w-full gap-2 text-sm font-semibold uppercase tracking-wide sm:w-auto"
        />
      </div>

      {/* Docked form: mobile only, below the nav drawer (z-30) and every modal.
          Portaled to <body> because the hero section is `isolate` — inside that
          stacking context the fixed pill paints under every later section. */}
      {hydrated &&
        createPortal(
          <div
            className={`fixed bottom-0 left-1/2 z-20 -translate-x-1/2 pb-[max(1rem,env(safe-area-inset-bottom))] motion-safe:transition-opacity motion-safe:duration-200 lg:hidden ${
              docked ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
            aria-hidden={!docked}
          >
            <ActionMenu
              options={options}
              analyticsLocation="docked"
              triggerIcon="calendar"
              triggerOpenIcon="x"
              triggerAriaLabel={`${t.quickActions.label} — ${t.quickActions.open}`}
              triggerTabIndex={docked ? 0 : -1}
              wrapClassName="relative"
              triggerClassName="focus-ring inline-flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-ink text-cream ring-1 ring-cream/20 transition-colors hover:bg-[#4A3B2C]"
            />
          </div>,
          document.body,
        )}
    </>
  )
}
