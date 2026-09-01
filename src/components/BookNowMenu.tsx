import { buildBookingOptions } from '@/lib/bookingOptions'
import { getTranslations, type Lang } from '@/i18n'
import type { ActionMenuOption } from './ActionMenu'

import ActionMenu from './ActionMenu'

type Props = {
  lang: Lang
  bookingUrl: string
  whatsappUrl: string
  phone: string
  phoneHref: string
  /** Trigger text. Defaults to the localized "Book now" (none when compact). */
  triggerLabel?: string
  triggerVariant?: 'primary' | 'secondary'
  /** Panel opening direction. The sticky header needs "down". */
  direction?: 'up' | 'down'
  /** Extra picker rows after the three standard ways (locations, service list). */
  extras?: ActionMenuOption[]
  analyticsLocation?: string
  /** Sizing classes for the trigger pill; colors come from triggerVariant. */
  triggerClassName?: string
  wrapClassName?: string
}

const DEFAULT_TRIGGER_CLASS =
  'w-full gap-2 px-5 py-3 text-sm font-semibold uppercase tracking-wide sm:w-auto'

// The uniform book-now control: a segmented pill whose left segment fires the
// first way in (WhatsApp, through js-contact-button) and whose chevron opens
// the "Rezervă acum" picker — WhatsApp, phone, online booking (the online
// option keeps the consent modal via js-programari-button) — plus any extras
// the caller adds.
export default function BookNowMenu({
  lang,
  bookingUrl,
  whatsappUrl,
  phone,
  phoneHref,
  triggerLabel,
  triggerVariant = 'primary',
  direction = 'up',
  extras,
  analyticsLocation,
  triggerClassName,
  wrapClassName,
}: Props) {
  const t = getTranslations(lang)

  return (
    <ActionMenu
      options={[
        ...buildBookingOptions(lang, { bookingUrl, whatsappUrl, phone, phoneHref }),
        ...(extras ?? []),
      ]}
      analyticsLocation={analyticsLocation}
      title={t.buttons.bookNow}
      direction={direction}
      segmented
      triggerVariant={triggerVariant}
      triggerLabel={triggerLabel ?? t.buttons.bookNow}
      triggerIcon="brand-whatsapp"
      chevronLabel={t.buttons.openOptions}
      wrapClassName={wrapClassName}
      triggerClassName={triggerClassName ?? DEFAULT_TRIGGER_CLASS}
    />
  )
}
