'use client'

import { useCallback, useEffect, useState } from 'react'

import { getTranslations, type Lang } from '@/i18n'
import { releaseScrollLock, setScrollLock } from '@/lib/scrollLock'

declare global {
  interface Window {
    facebookPixelLoaded?: boolean
  }
}

const MODAL_ID = 'booking-consent-modal'

// Renders the booking consent modal and wires the site-wide click delegation:
// .js-programari-button -> FB ViewContent + this modal (confirm opens the
// external booking URL), .js-contact-button -> FB Contact,
// .js-location-button -> FB FindLocation. Port of the legacy
// BookingConsentModal.astro + MainLayout delegation script.
export default function SiteInteractions({ lang, bookingUrl }: { lang: Lang; bookingUrl: string }) {
  const t = getTranslations(lang).booking
  const [open, setOpen] = useState(false)

  const show = useCallback(() => {
    setOpen(true)
    setScrollLock('booking-modal', true)
  }, [])

  const hide = useCallback(() => {
    setOpen(false)
    setScrollLock('booking-modal', false)
  }, [])

  const confirm = useCallback(() => {
    hide()
    window.open(bookingUrl, '_blank', 'noopener,noreferrer')
  }, [hide, bookingUrl])

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null
      if (!target?.closest) return

      const programButton = target.closest('.js-programari-button')
      if (programButton) {
        event.preventDefault()
        event.stopPropagation()

        if (window.facebookPixelLoaded && typeof window.fbq === 'function') {
          window.fbq('track', 'ViewContent', {
            content_name: 'Programare',
            content_category: 'Programare',
            content_ids: ['programare'],
          })
        }
        show()
        return
      }

      if (target.closest('.js-contact-button')) {
        if (window.facebookPixelLoaded && typeof window.fbq === 'function') window.fbq('track', 'Contact')
        return
      }

      if (target.closest('.js-location-button')) {
        if (window.facebookPixelLoaded && typeof window.fbq === 'function') window.fbq('track', 'FindLocation')
      }
    }

    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') hide()
    }

    document.addEventListener('click', onClick)
    document.addEventListener('keydown', onKeydown)
    return () => {
      document.removeEventListener('click', onClick)
      document.removeEventListener('keydown', onKeydown)
      releaseScrollLock('booking-modal')
    }
  }, [show, hide])

  return (
    <div
      id={MODAL_ID}
      className={`fixed inset-0 z-[120] ${open ? 'flex' : 'hidden'} items-center justify-center bg-ink/70 px-4 backdrop-blur-sm`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${MODAL_ID}-title`}
      onClick={(event) => {
        if (event.target === event.currentTarget) hide()
      }}
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white ring-1 ring-ink/10">
        <div className="flex items-center justify-between gap-4 border-b border-ink/10 px-6 py-5">
          <h2 id={`${MODAL_ID}-title`} className="font-heading text-2xl font-semibold text-ink">
            {t.title}
          </h2>
          <button
            type="button"
            className="focus-ring -mr-2 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted-warm transition-colors hover:bg-cream hover:text-ink"
            aria-label={t.closeLabel}
            onClick={hide}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="space-y-5 px-6 py-6 text-sm leading-relaxed text-muted-warm">
          <p>{t.description}</p>
          <ul className="space-y-2.5">
            {t.policies.map((policy) => (
              <li key={policy.href} className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <a
                  href={policy.href}
                  target="_blank"
                  rel="noopener"
                  className="focus-ring rounded-sm underline-offset-4 transition-colors hover:text-ink hover:underline"
                >
                  {policy.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="border-t border-ink/10 pt-4 text-xs text-muted-warm">{t.finePrint}</p>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-ink/10 bg-cream px-6 py-4 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            className="btn-outline px-5 py-2.5 text-sm font-semibold uppercase tracking-wide"
            onClick={hide}
          >
            {t.cancelLabel}
          </button>
          <button
            type="button"
            className="btn-primary px-5 py-2.5 text-sm font-semibold uppercase tracking-wide"
            onClick={confirm}
          >
            {t.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
