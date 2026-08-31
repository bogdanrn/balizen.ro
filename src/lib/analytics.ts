// Public analytics IDs (ported from _legacy/src/config.yaml). Not secrets.
export const GA_ID = 'G-QZ8FEVGH7X'
export const GTM_ID = 'GTM-KXL82G4N'
export const FB_PIXEL_ID = '2269890693426339'

// Consent guards, matching the pattern SiteInteractions already uses for the
// legacy js-* delegation. The Window globals are declared in ConsentAnalytics.
//
// fbq: only exists once the visitor granted the analytics category, so every
// call is gated on facebookPixelLoaded.
// gtag: always defined (the Consent Mode default snippet in the layout <head>
// installs it), and queues into dataLayer. GA4/GTM only load after consent, and
// storage stays denied until then, so queuing an event is safe and correct.
export function trackFbq(event: string, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return
  if (!window.facebookPixelLoaded || typeof window.fbq !== 'function') return
  window.fbq('track', event, params)
}

export function trackGtag(event: string, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return
  if (typeof window.gtag !== 'function') return
  window.gtag('event', event, params)
}

// Fired when a service detail modal opens (including deep links). Service
// title/category/id only — no PII.
export function trackServiceView(service: { id: number; title: string; categoryName: string }): void {
  trackFbq('ViewContent', {
    content_name: service.title,
    content_category: service.categoryName,
  })
  trackGtag('select_content', {
    content_type: 'service',
    item_id: service.id,
    item_name: service.title,
  })
}
