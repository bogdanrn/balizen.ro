'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'

import { buildBookingOptions, buildLocationOptions } from '@/lib/bookingOptions'
import { getTranslations, type Lang } from '@/i18n'
import type { Location } from '@/payload-types'

import ActionMenu from './ActionMenu'

type Props = {
  lang: Lang
  bookingUrl: string
  whatsappUrl: string
  phone: string
  phoneHref: string
  locations: Location[]
}

// The hero's primary CTA is the shared book-now control: a segmented pill
// whose left segment fires WhatsApp directly (via the js-contact-button hook)
// and whose chevron opens the "Rezervă acum" picker with the three ways to
// reach the salon. Locations and the services list stay out of the inline
// picker — the hero shows them via the dedicated services button and the
// docked mobile selector below.
//
// On mobile the icon-only quick selector also docks to the bottom of the
// viewport once its in-hero position scrolls off the top; that one keeps the
// full option set (three ways + locations + services list). An in-flow
// sentinel drives the IntersectionObserver, so nothing is measured during
// layout and the hero never shifts. Desktop never docks — the sticky header
// keeps its own booking CTA.
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
  bookingUrl,
  whatsappUrl,
  phone,
  phoneHref,
  locations,
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

  const ways = buildBookingOptions(lang, { bookingUrl, whatsappUrl, phone, phoneHref })

  // Only the docked mobile selector carries the extras (locations with their
  // Waze/Apple sub-actions, and the services list jump).
  const dockedOptions = [
    ...ways,
    ...buildLocationOptions(lang, locations),
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
          options={ways}
          analyticsLocation="inline"
          title={t.buttons.bookNow}
          segmented
          triggerVariant="primary"
          triggerLabel={t.buttons.bookNow}
          triggerIcon="brand-whatsapp"
          chevronLabel={t.buttons.openOptions}
          triggerClassName="w-full gap-2 px-5 py-3 text-sm font-semibold uppercase tracking-wide sm:w-auto"
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
              options={dockedOptions}
              analyticsLocation="docked"
              title={t.buttons.bookNow}
              direction="up"
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
