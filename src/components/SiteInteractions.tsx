'use client'

import { useCallback, useEffect, useState } from 'react'

import { getTranslations, type Lang } from '@/i18n'

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
    document.body.classList.add('overflow-hidden')
  }, [])

  const hide = useCallback(() => {
    setOpen(false)
    document.body.classList.remove('overflow-hidden')
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
      document.body.classList.remove('overflow-hidden')
    }
  }, [show, hide])

  return (
    <div
      id={MODAL_ID}
      className={`fixed inset-0 z-[120] ${open ? 'flex' : 'hidden'} items-center justify-center bg-slate-900/70 px-4 backdrop-blur-sm`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${MODAL_ID}-title`}
      onClick={(event) => {
        if (event.target === event.currentTarget) hide()
      }}
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <h2 id={`${MODAL_ID}-title`} className="font-heading text-lg font-semibold text-slate-900">
            {t.title}
          </h2>
          <button
            type="button"
            className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label={t.closeLabel}
            onClick={hide}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="space-y-4 px-6 py-6 text-sm text-slate-600">
          <p>{t.description}</p>
          <ul className="space-y-2">
            {t.policies.map((policy) => (
              <li key={policy.href} className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                  •
                </span>
                <a
                  href={policy.href}
                  target="_blank"
                  rel="noopener"
                  className="underline-offset-2 transition hover:text-primary hover:underline"
                >
                  {policy.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="border-t border-slate-200 pt-4 text-xs text-slate-500">{t.finePrint}</p>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            type="button"
            className="inline-flex items-center rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
            onClick={hide}
          >
            {t.cancelLabel}
          </button>
          <button
            type="button"
            className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
            onClick={confirm}
          >
            {t.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
