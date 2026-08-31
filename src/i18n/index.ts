// Single source for all UI strings. Ports _legacy/src/i18n/translations.ts,
// ui.ts, plus the hardcoded per-locale strings from MainLayout (booking modal),
// Footer, ReviewsSection, and 404.
export type Lang = 'ro' | 'en'

export const LANGUAGES: Record<Lang, { label: string; flag: string }> = {
  ro: { label: 'Română', flag: '🇷🇴' },
  en: { label: 'English', flag: '🇬🇧' },
}

export const DEFAULT_LANG: Lang = 'ro'

export const translations = {
  ro: {
    location: {
      tagline: 'Locație',
      description:
        'Ne găsești în două locații în centrul Ploieștiului, în spații liniștite dedicate relaxării tale.',
      workingHours: 'Program de lucru',
      contact: 'Contact',
      openInGoogleMaps: 'Deschide în Google Maps',
      mapTitle: 'Harta',
      emailLabel: 'Email',
    },
    services: {
      tagline: 'Servicii',
      listLabel: 'Lista servicii',
      viewDetails: 'Vezi detalii',
      closeDetails: 'Închide detaliile serviciului',
    },
    quickActions: {
      label: 'Programări',
      open: 'Deschide acțiunile rapide',
      close: 'Închide acțiunile rapide',
    },
    subscriptions: {
      tagline: 'Abonamente',
      title: 'Prețuri și pachete Bali Zen',
      description:
        'Alege abonamentul care se potrivește cel mai bine ritmului tău și bucură-te de relaxare autentic balineză, în mod constant.',
      subscriptionLabel: 'Abonament',
    },
    giftCard: { tagline: 'Gift Card' },
    cta: { tagline: 'Programare' },
    buttons: {
      bookHere: 'Programează-te aici',
      whatsapp: 'WhatsApp',
      showMore: 'Vezi mai mult',
      showLess: 'Vezi mai puțin',
      call: 'Sună acum',
    },
    announcement: { dismiss: 'Închide anunțul' },
    units: { minutes: 'min', currency: 'RON' },
    labels: { new: 'Nou', locationCaption: 'Gh. Gr. Cantacuzino' },
    reviews: {
      tagline: 'Recenzii',
      title: 'Ce spun clienții noștri',
      description:
        'Fiecare experiență la Bali Zen este unică. Descoperă ce spun clienții noștri despre momentele de relaxare petrecute în studio.',
      allOnGoogle: 'Vezi toate recenziile pe Google',
      ratingLabel: '{rating} din 5 stele',
    },
    footer: {
      locationContact: 'Locație & Contact',
      address: 'Adresă',
      schedule: 'Program',
      contact: 'Contact',
      readReviews: 'Citește recenziile noastre pe Google',
      cookieSettings: 'Setări cookie-uri',
    },
    booking: {
      title: 'Programări online: confirmare necesară',
      description:
        'Pentru a continua cu programarea online, confirmă că ai citit și ești de acord cu politicile Bali Zen referitoare la programări, plăți și anulări.',
      confirmLabel: 'Confirm și continuă programarea',
      cancelLabel: 'Revin mai târziu',
      finePrint:
        'Prin confirmare declarați că ați citit și acceptat politicile Bali Zen referitoare la programări, anulări și rambursări.',
      closeLabel: 'Închide dialogul',
      policies: [
        { label: 'Politica de confidențialitate (GDPR)', href: '/privacy-policy' },
        { label: 'Termeni și condiții de utilizare', href: '/terms-policy' },
        { label: 'Politica de rambursare', href: '/return-policy' },
        { label: 'Politica de anulare', href: '/cancellation-policy' },
      ],
    },
    skipToContent: 'Sari la conținut',
    notFound: {
      tagline: 'Eroare',
      title: '404',
      body: 'Ne pare rău, pagina pe care o cauți nu mai există sau a fost mutată. Revino la pagina principală și continuă explorarea.',
      back: 'Înapoi la prima pagină',
    },
    legalDocument: 'Document',
  },
  en: {
    location: {
      tagline: 'Location',
      description:
        'You can find us in two locations in the center of Ploiești, in peaceful spaces dedicated to your relaxation.',
      workingHours: 'Working Hours',
      contact: 'Contact',
      openInGoogleMaps: 'Open in Google Maps',
      mapTitle: 'Map',
      emailLabel: 'Email',
    },
    services: {
      tagline: 'Services',
      listLabel: 'Services list',
      viewDetails: 'View details',
      closeDetails: 'Close service details',
    },
    quickActions: {
      label: 'Book',
      open: 'Open quick actions',
      close: 'Close quick actions',
    },
    subscriptions: {
      tagline: 'Subscriptions',
      title: 'Bali Zen Prices and Packages',
      description:
        'Choose the subscription that best fits your rhythm and enjoy authentic Balinese relaxation, consistently.',
      subscriptionLabel: 'Subscription',
    },
    giftCard: { tagline: 'Gift Card' },
    cta: { tagline: 'Booking' },
    buttons: {
      bookHere: 'Book here',
      whatsapp: 'WhatsApp',
      showMore: 'Show more',
      showLess: 'Show less',
      call: 'Call now',
    },
    announcement: { dismiss: 'Dismiss announcement' },
    units: { minutes: 'min', currency: 'RON' },
    labels: { new: 'New', locationCaption: 'Gh. Gr. Cantacuzino' },
    reviews: {
      tagline: 'Reviews',
      title: 'What our clients say',
      description:
        'Every experience at Bali Zen is unique. Discover what our clients say about their moments of relaxation in the studio.',
      allOnGoogle: 'See all reviews on Google',
      ratingLabel: '{rating} out of 5 stars',
    },
    footer: {
      locationContact: 'Location & Contact',
      address: 'Address',
      schedule: 'Schedule',
      contact: 'Contact',
      readReviews: 'Read our reviews on Google',
      cookieSettings: 'Cookie settings',
    },
    booking: {
      title: 'Online Booking: Confirmation Required',
      description:
        'To continue with online booking, please confirm that you have read and agree to Bali Zen policies regarding bookings, payments, and cancellations.',
      confirmLabel: 'Confirm and continue booking',
      cancelLabel: 'Return later',
      finePrint:
        'By confirming you declare that you have read and accept the Bali Zen policies regarding bookings, cancellations and refunds.',
      closeLabel: 'Close dialog',
      policies: [
        { label: 'Privacy Policy', href: '/en/privacy-policy' },
        { label: 'Terms and Conditions', href: '/en/terms-policy' },
        { label: 'Return Policy', href: '/en/return-policy' },
        { label: 'Cancellation Policy', href: '/en/cancellation-policy' },
      ],
    },
    skipToContent: 'Skip to content',
    notFound: {
      tagline: 'Error',
      title: '404',
      body: 'Sorry, the page you are looking for no longer exists or has been moved. Head back to the homepage and keep exploring.',
      back: 'Back to homepage',
    },
    legalDocument: 'Document',
  },
} as const

export function getTranslations(lang: Lang) {
  return translations[lang]
}

// Prefix a path with the locale when it is not the default (ro stays bare).
export function getLocalizedPath(pathname: string, lang: Lang): string {
  if (lang === DEFAULT_LANG) return pathname
  if (pathname === '/') return `/${lang}`
  return `/${lang}${pathname.startsWith('/') ? pathname : `/${pathname}`}`
}

// Path of the current page in the other locale (for the language switcher).
export function getAlternateLocalePath(pathname: string, lang: Lang): string {
  const other: Lang = lang === 'ro' ? 'en' : 'ro'
  const stripped = pathname.replace(/^\/en(?=\/|$)/, '') || '/'
  return getLocalizedPath(stripped, other)
}
