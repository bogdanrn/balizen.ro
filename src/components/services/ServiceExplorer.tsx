'use client'

import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useRef } from 'react'

import { getTranslations, type Lang } from '@/i18n'
import { trackServiceView } from '@/lib/analytics'
import type { CdnMedia } from '@/lib/cdn'
import { setScrollLock } from '@/lib/scrollLock'

import CdnImage from '../CdnImage'
import Icon from '../Icon'
import SectionEyebrow from '../SectionEyebrow'

export type ExplorerService = {
  id: number
  title: string
  description: string
  pricing: { duration: number; price: string }[]
  image: CdnMedia | null
  isNew: boolean
  categoryName: string
}

export type ExplorerCategory = {
  id: number
  name: string
  services: ExplorerService[]
}

type Props = {
  lang: Lang
  categories: ExplorerCategory[]
  bookingUrl: string
  whatsappUrl: string
  phone: string
  phoneHref: string
}

// The open service lives in the URL (?service=<payload id>) so a card can be
// linked and shared; state is derived from useSearchParams rather than
// duplicated, which makes the browser Back button close the modal for free.
const PARAM = 'service'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export default function ServiceExplorer({
  lang,
  categories,
  bookingUrl,
  whatsappUrl,
  phone,
  phoneHref,
}: Props) {
  const t = getTranslations(lang)
  const searchParams = useSearchParams()

  const services = categories.flatMap((category) => category.services)
  const requestedId = searchParams.get(PARAM)
  const openService = requestedId
    ? (services.find((s) => String(s.id) === requestedId) ?? null)
    : null

  const triggers = useRef(new Map<number, HTMLElement | null>())
  const panelRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  // Whether this modal was opened by a click here (history entry we own and can
  // pop) rather than by landing on a shared ?service= link (nothing to go back
  // to — stripping the param must not walk the visitor off the site).
  const pushedByUs = useRef(false)
  const lastOpenId = useRef<number | null>(null)
  const firedFor = useRef<number | null>(null)

  const open = useCallback((id: number) => {
    const params = new URLSearchParams(window.location.search)
    params.set(PARAM, String(id))
    window.history.pushState(
      null,
      '',
      `${window.location.pathname}?${params.toString()}${window.location.hash}`,
    )
    pushedByUs.current = true
  }, [])

  const close = useCallback(() => {
    if (pushedByUs.current) {
      pushedByUs.current = false
      window.history.back()
      return
    }
    const params = new URLSearchParams(window.location.search)
    params.delete(PARAM)
    const query = params.toString()
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`,
    )
  }, [])

  // Body scroll lock, initial focus, Escape and a Tab cycle inside the panel.
  useEffect(() => {
    if (!openService) return

    setScrollLock('service-modal', true)
    closeButtonRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      // The booking consent modal stacks above this one (z-[120] vs z-50); when
      // it is open it owns Escape, otherwise one keypress would close both.
      if (document.getElementById('booking-consent-modal')?.classList.contains('flex')) return

      if (event.key === 'Escape') {
        close()
        return
      }
      if (event.key !== 'Tab') return

      const panel = panelRef.current
      if (!panel) return
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (element) => element.offsetParent !== null,
      )
      if (items.length === 0) return

      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      setScrollLock('service-modal', false)
    }
  }, [openService, close])

  // Return focus to the card that opened the modal.
  useEffect(() => {
    if (openService) {
      lastOpenId.current = openService.id
      return
    }
    const id = lastOpenId.current
    if (id === null) return
    lastOpenId.current = null
    triggers.current.get(id)?.focus()
  }, [openService])

  // One event per open — re-renders while open must not refire. Deep links
  // count as an open and fire after mount.
  useEffect(() => {
    if (!openService) {
      firedFor.current = null
      return
    }
    if (firedFor.current === openService.id) return
    firedFor.current = openService.id
    trackServiceView({
      id: openService.id,
      title: openService.title,
      categoryName: openService.categoryName,
    })
  }, [openService])

  const priceLine = (service: ExplorerService) =>
    service.pricing.map(({ price }) => `${price} ${t.units.currency}`).join(' · ')
  const durationLine = (service: ExplorerService) =>
    service.pricing.map(({ duration }) => `${duration} ${t.units.minutes}`).join(' · ')

  return (
    <>
      <div className="mt-20 space-y-20">
        {categories.map((category) => (
          <section key={category.id}>
            <div className="flex items-center gap-5">
              <h3 className="font-heading text-2xl font-semibold text-ink sm:text-3xl">
                {category.name}
              </h3>
              <span aria-hidden="true" className="h-px flex-1 bg-ink/15" />
            </div>

            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
              {category.services.map((service) => (
                <article
                  key={service.id}
                  className={`relative flex gap-4 rounded-2xl bg-white p-5 ring-1 transition-colors ${
                    service.isNew ? 'service-new ring-primary/60' : 'ring-ink/10 hover:ring-ink/30'
                  }`}
                >
                  {service.image ? (
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full ring-1 ring-ink/10">
                      <CdnImage
                        media={service.image}
                        alt=""
                        sizes="64px"
                        widths={[64, 128]}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-accent text-ink">
                      <Icon name="star" className="h-5 w-5" />
                    </div>
                  )}

                  <div className="flex flex-1 flex-col gap-2">
                    <header className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                      <div className="flex flex-wrap items-center gap-2 text-left">
                        <h4 className="font-heading text-xl font-semibold text-ink">
                          {/* The ::after stretches this link over the whole card, so
                              the card is clickable while the accessible name stays
                              the service title. A real href (not a button) keeps the
                              deep link reachable without JS and discoverable by
                              crawlers; with JS the click is intercepted into
                              pushState so the page never refetches. */}
                          <a
                            href={`?${PARAM}=${service.id}`}
                            ref={(element) => {
                              triggers.current.set(service.id, element)
                            }}
                            onClick={(event) => {
                              if (event.metaKey || event.ctrlKey || event.shiftKey) return
                              event.preventDefault()
                              open(service.id)
                            }}
                            aria-haspopup="dialog"
                            className="focus-ring cursor-pointer rounded-sm text-left after:absolute after:inset-0 after:rounded-2xl after:content-['']"
                          >
                            {service.title}
                            <span className="sr-only"> — {t.services.viewDetails}</span>
                          </a>
                        </h4>
                        {service.isNew && (
                          <span className="inline-flex items-center rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-ink">
                            {t.labels.new}
                          </span>
                        )}
                      </div>

                      {service.pricing.length > 0 && (
                        <div className="text-left text-xs sm:shrink-0 sm:text-right">
                          <div className="font-medium uppercase tracking-wide text-muted-warm">
                            {durationLine(service)}
                          </div>
                          <div className="mt-0.5 font-semibold text-ink">{priceLine(service)}</div>
                        </div>
                      )}
                    </header>

                    <p className="line-clamp-3 text-sm leading-relaxed text-muted-warm">
                      {service.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      {openService && (
        /* The overlay is the scroll container, so an unusually tall card moves
           as one page-style block with the scrollbar at the viewport edge —
           never a scrollbar inside the card and never clipped text. Sizing still
           tries to fit first: the image shrinks to a wider crop on short
           viewports and spacing tightens before any scrolling happens. */
        <div className="fixed inset-0 z-50 overflow-y-auto bg-ink/70 backdrop-blur-sm motion-safe:animate-[overlay-in_150ms_ease-out]">
          <div
            className="flex min-h-full items-end justify-center sm:items-center sm:p-6"
            onClick={(event) => {
              if (event.target === event.currentTarget) close()
            }}
          >
            <div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="service-modal-title"
              // Bottom sheet on mobile: at least 85dvh tall, so the image gets
              // room to breathe and the spacing stays generous rather than
              // reading as a small floating card. Desktop sizes to content.
              className="flex min-h-[85dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-cream ring-1 ring-ink/10 motion-safe:animate-[panel-in_220ms_ease-out] sm:min-h-0 sm:max-w-2xl sm:rounded-3xl"
            >
              <div className="relative aspect-[3/2] max-h-[42dvh] w-full shrink-0 overflow-hidden bg-ink sm:max-h-[40dvh]">
                {openService.image && (
                  <CdnImage
                    media={openService.image}
                    alt=""
                    sizes="(min-width: 640px) 42rem, 100vw"
                    className="absolute inset-0 h-full w-full object-cover object-center"
                  />
                )}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/45 to-ink/10"
                />

                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                  <SectionEyebrow tone="cream">{openService.categoryName}</SectionEyebrow>
                  <h2
                    id="service-modal-title"
                    className="mt-2 font-heading text-3xl font-semibold leading-[1.1] text-cream sm:text-4xl"
                  >
                    {openService.title}
                  </h2>
                </div>

                <button
                  type="button"
                  ref={closeButtonRef}
                  onClick={close}
                  aria-label={t.services.closeDetails}
                  className="focus-ring absolute right-3 top-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-cream/90 text-ink ring-1 ring-ink/10 backdrop-blur transition-colors hover:bg-cream"
                >
                  <Icon name="x" className="h-5 w-5" />
                </button>
              </div>

              <div className="flex flex-1 flex-col gap-5 px-6 py-6 sm:gap-6 sm:px-8">
                {openService.pricing.length > 0 && (
                  <ul className="divide-y divide-ink/10 border-y border-ink/10">
                    {openService.pricing.map((tier, index) => (
                      <li key={index} className="flex items-baseline justify-between gap-4 py-2.5">
                        <span className="text-sm font-medium uppercase tracking-wide text-muted-warm">
                          {tier.duration} {t.units.minutes}
                        </span>
                        <span className="font-heading text-xl font-semibold text-ink">
                          {tier.price} {t.units.currency}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                <p className="whitespace-pre-line text-sm leading-relaxed text-muted-warm sm:text-base">
                  {openService.description}
                </p>

                <div className="mt-auto flex flex-col gap-2.5 pb-[env(safe-area-inset-bottom)] sm:mt-0 sm:flex-row sm:flex-wrap sm:pb-0">
                  <a
                    href={bookingUrl}
                    target="_blank"
                    rel="noopener"
                    className="btn-primary js-programari-button w-full gap-2 px-4 py-2.5 text-sm font-semibold uppercase tracking-wide sm:w-auto sm:flex-1"
                  >
                    <Icon name="calendar" className="h-5 w-5" />
                    <span>{t.buttons.bookHere}</span>
                  </a>
                  <div className="grid grid-cols-2 gap-2.5 sm:contents">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener"
                      className="btn-outline js-contact-button gap-2 px-4 py-2.5 text-sm font-semibold uppercase tracking-wide"
                    >
                      <Icon name="brand-whatsapp" className="h-5 w-5" />
                      <span>{t.buttons.whatsapp}</span>
                    </a>
                    <a
                      href={phoneHref}
                      className="btn-outline js-contact-button gap-2 px-4 py-2.5 text-sm font-semibold uppercase tracking-wide"
                      aria-label={phone}
                    >
                      <Icon name="phone" className="h-5 w-5" />
                      <span aria-hidden="true">{t.buttons.call}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
