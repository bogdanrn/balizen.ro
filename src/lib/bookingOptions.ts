import type { ActionMenuOption } from '@/components/ActionMenu'
import { getTranslations, type Lang } from '@/i18n'
import { getAppleMapsUrl, getWazeUrl } from '@/lib/locationLinks'
import type { Location } from '@/payload-types'

export type ContactConfig = {
  bookingUrl: string
  whatsappUrl: string
  phone: string
  phoneHref: string
}

// The three ways in: WhatsApp first (it is the picker's default — the
// segmented left segment fires it directly), then the phone, then online
// booking (through the consent flow via the js-programari-button hook).
// Shared by every BookNowMenu so the picker reads identically wherever it
// opens.
export function buildBookingOptions(
  lang: Lang,
  { bookingUrl, whatsappUrl, phone, phoneHref }: ContactConfig,
): ActionMenuOption[] {
  const t = getTranslations(lang)

  return [
    {
      key: 'whatsapp',
      label: t.buttons.whatsapp,
      href: whatsappUrl,
      icon: 'brand-whatsapp',
      target: '_blank',
      hookClass: 'js-contact-button',
      // Primary emphasis rides with the first option, wherever the order ends
      // up — the picker should always spotlight the default choice.
      variant: 'primary',
    },
    {
      key: 'phone',
      label: `${t.buttons.phone}: ${phone}`,
      href: phoneHref,
      icon: 'phone',
      hookClass: 'js-contact-button',
      ariaLabel: phone,
    },
    {
      key: 'book',
      label: t.buttons.bookOnline,
      href: bookingUrl,
      icon: 'calendar',
      target: '_blank',
      hookClass: 'js-programari-button',
    },
  ]
}

// One combined row per studio location: Google Maps is the main tap target
// (same js-location-button hook the legacy "Open in Maps" buttons use, so
// fbq FindLocation still fires), Waze and Apple Maps ride along as icon
// buttons so visitors can pick their own navigation app without a second
// screen. mapsUrl is required on the collection, but skip defensively
// rather than emit a broken link.
export function buildLocationOptions(lang: Lang, locations: Location[]): ActionMenuOption[] {
  const t = getTranslations(lang)

  return locations
    .filter((location) => location.mapsUrl)
    .map((location) => ({
      key: `location-${location.id}`,
      label: location.name,
      href: location.mapsUrl,
      icon: 'map',
      target: '_blank',
      hookClass: 'js-location-button',
      ariaLabel: `${t.location.openInGoogleMaps}: ${location.name}`,
      actions: [
        {
          key: `location-${location.id}-waze`,
          href: getWazeUrl(location),
          icon: 'brand-waze',
          ariaLabel: `${t.location.openInWaze}: ${location.name}`,
          target: '_blank',
          hookClass: 'js-location-button',
        },
        {
          key: `location-${location.id}-apple`,
          href: getAppleMapsUrl(location),
          icon: 'brand-apple',
          ariaLabel: `${t.location.openInAppleMaps}: ${location.name}`,
          target: '_blank',
          hookClass: 'js-location-button',
        },
      ],
    }))
}
