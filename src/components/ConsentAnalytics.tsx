'use client'

import { useEffect } from 'react'

import { FB_PIXEL_ID, GA_ID, GTM_ID } from '@/lib/analytics'

declare global {
  interface Window {
    __balizenAnalyticsInitialized?: boolean
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
    fbq?: ((...args: unknown[]) => void) & { queue?: unknown[]; loaded?: boolean; version?: string }
    _fbq?: unknown
    facebookPixelLoaded?: boolean
  }
}

// Verbatim port of the legacy Analytics.astro consent-gated loader:
// nothing loads until the `analytics` category is granted; revoking consent
// revokes the FB pixel consent. The Consent Mode 'default denied' call lives
// in an inline script in the layout <head> (must run before any vendor script).
export default function ConsentAnalytics(): null {
  useEffect(() => {
    if (window.__balizenAnalyticsInitialized) return
    window.__balizenAnalyticsInitialized = true

    const state = { gaLoaded: false, gtmLoaded: false, fbPixelInitialized: false }

    function loadGoogleAnalytics() {
      if (state.gaLoaded) return
      state.gaLoaded = true
      const script = document.createElement('script')
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
      script.async = true
      document.head.appendChild(script)

      window.gtag('js', new Date())
      window.gtag('config', GA_ID, { anonymize_ip: true })
    }

    function loadGoogleTagManager() {
      if (state.gtmLoaded) return
      state.gtmLoaded = true
      ;(function (w: Window, d: Document, s: string, l: string, i: string) {
        const dl = d as unknown as Record<string, unknown[]>
        dl[l] = dl[l] || []
        dl[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })
        const f = d.getElementsByTagName(s)[0]
        const j = d.createElement(s) as HTMLScriptElement
        const dlParam = l !== 'dataLayer' ? `&l=${l}` : ''
        j.async = true
        j.src = `https://www.googletagmanager.com/gtm.js?id=${i}${dlParam}`
        f.parentNode?.insertBefore(j, f)
      })(window, document, 'script', 'dataLayer', GTM_ID)
    }

    function loadFacebookPixel() {
      if (state.fbPixelInitialized) return
      if (!window.fbq) {
        const fbq = function (this: unknown, ...args: unknown[]) {
          // eslint-disable-next-line prefer-spread, prefer-rest-params
          ;(fbq as any).callMethod ? (fbq as any).callMethod.apply(fbq, args) : (fbq as any).queue.push(args)
        } as NonNullable<Window['fbq']>
        fbq.queue = []
        fbq.loaded = true
        fbq.version = '2.0'
        window.fbq = fbq
        window._fbq = fbq
        const script = document.createElement('script')
        script.async = true
        script.src = 'https://connect.facebook.net/en_US/fbevents.js'
        const first = document.getElementsByTagName('script')[0]
        first.parentNode?.insertBefore(script, first)
      }

      window.fbq!('init', FB_PIXEL_ID)
      window.fbq!('consent', 'grant')
      window.fbq!('track', 'PageView')

      state.fbPixelInitialized = true
      window.facebookPixelLoaded = true
    }

    function updateConsent(granted: boolean) {
      const consentStatus = granted
        ? { ad_storage: 'granted', analytics_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted' }
        : { ad_storage: 'denied', analytics_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' }

      window.gtag('consent', 'update', consentStatus)

      if (granted) {
        loadGoogleAnalytics()
        loadGoogleTagManager()
        loadFacebookPixel()
      } else if (window.fbq && state.fbPixelInitialized) {
        window.fbq('consent', 'revoke')
      }
    }

    function readCookieConsent(): boolean {
      const cookie = document.cookie.split('; ').find((row) => row.startsWith('cc_cookie='))
      if (!cookie) return false
      try {
        const value = decodeURIComponent(cookie.split('=')[1] || '')
        if (!value) return false
        const data = JSON.parse(value)
        const categories = data?.categories ?? []
        return categories.includes('analytics')
      } catch (error) {
        console.error('Failed to parse cookie consent prefs', error)
        return false
      }
    }

    updateConsent(readCookieConsent())

    const handleConsentEvent = (event: Event) => {
      try {
        const categories = (event as CustomEvent).detail?.cookie?.categories ?? []
        updateConsent(categories.includes('analytics'))
      } catch (error) {
        console.error('Unable to process consent event', error)
      }
    }

    window.addEventListener('cc:onConsent', handleConsentEvent)
    window.addEventListener('cc:onChange', handleConsentEvent)
    return () => {
      window.removeEventListener('cc:onConsent', handleConsentEvent)
      window.removeEventListener('cc:onChange', handleConsentEvent)
    }
  }, [])

  return null
}
