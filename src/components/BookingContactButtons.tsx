import { getTranslations, type Lang } from '@/i18n'

import Icon from './Icon'

type Props = {
  lang: Lang
  bookingUrl: string
  whatsappUrl: string
  phone: string
  phoneHref: string
  /**
   * "row": the standalone contact strip (services end). "modal": the footer of
   * the service detail modal, where booking spans full width and WhatsApp +
   * phone share a row on mobile.
   */
  layout?: 'row' | 'modal'
  /** Caption rendered under the phone button in "row" layout. */
  phoneCaption?: string
}

const BUTTON_CLASS = 'w-full gap-2 text-sm font-semibold uppercase tracking-wide sm:w-auto'
const MODAL_CLASS = 'gap-2 px-4 py-2.5 text-sm font-semibold uppercase tracking-wide'

// The plain three-button row — online booking (through the consent modal via
// js-programari-button), WhatsApp, phone — shared by the service detail modal
// and the end-of-services contact strip. No picker here: when all three ways
// are already visible, a disclosure would only hide them.
export default function BookingContactButtons({
  lang,
  bookingUrl,
  whatsappUrl,
  phone,
  phoneHref,
  layout = 'row',
  phoneCaption,
}: Props) {
  const t = getTranslations(lang)

  const bookButton = (
    <a
      href={bookingUrl}
      target="_blank"
      rel="noopener"
      className={`btn-primary js-programari-button ${layout === 'modal' ? `${MODAL_CLASS} sm:flex-1` : BUTTON_CLASS}`}
    >
      <Icon name="calendar" className="h-5 w-5" />
      <span>{t.buttons.bookOnline}</span>
    </a>
  )

  const whatsappButton = (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener"
      className={`btn-outline js-contact-button ${layout === 'modal' ? MODAL_CLASS : BUTTON_CLASS}`}
    >
      <Icon name="brand-whatsapp" className="h-5 w-5" />
      <span>{t.buttons.whatsapp}</span>
    </a>
  )

  const phoneButton = (
    <a
      href={phoneHref}
      className={`btn-outline js-contact-button ${layout === 'modal' ? MODAL_CLASS : BUTTON_CLASS}`}
      aria-label={phone}
    >
      <Icon name="phone" className="h-5 w-5" />
      <span>{phone}</span>
    </a>
  )

  if (layout === 'modal') {
    return (
      <div className="mt-auto flex flex-col gap-2.5 pb-[env(safe-area-inset-bottom)] sm:mt-0 sm:flex-row sm:flex-wrap sm:pb-0">
        {bookButton}
        <div className="grid grid-cols-2 gap-2.5 sm:contents">
          {whatsappButton}
          {phoneButton}
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-start sm:justify-center sm:gap-4">
      {bookButton}
      {whatsappButton}
      {phoneCaption ? (
        <div className="flex w-full flex-col items-center gap-1.5 sm:w-auto">
          {phoneButton}
          <span className="text-xs font-medium text-muted-warm">{phoneCaption}</span>
        </div>
      ) : (
        phoneButton
      )}
    </div>
  )
}
