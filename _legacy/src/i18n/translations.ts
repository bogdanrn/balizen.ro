import type { Lang } from './ui';

export const translations = {
  ro: {
    location: {
      tagline: 'Locație',
      description: 'Ne găsești în două locații în centrul Ploieștiului, în spații liniștite dedicate relaxării tale.',
      workingHours: 'Program de lucru',
      contact: 'Contact',
      openInGoogleMaps: 'Deschide în Google Maps',
      mapTitle: 'Harta',
    },
    services: {
      tagline: 'Servicii',
    },
    subscriptions: {
      tagline: 'Abonamente',
      title: 'Prețuri și pachete Bali Zen',
      description:
        'Alege abonamentul care se potrivește cel mai bine ritmului tău și bucură-te de relaxare autentic balineză, în mod constant.',
      subscriptionLabel: 'Abonament',
    },
    giftCard: {
      tagline: 'Gift Card',
    },
    buttons: {
      bookHere: 'Programează-te aici',
      whatsapp: 'WhatsApp',
      showMore: 'Vezi mai mult',
      showLess: 'Vezi mai puțin',
    },
    units: {
      minutes: 'min',
      currency: 'RON',
    },
    labels: {
      new: 'Nou',
    },
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
    },
    services: {
      tagline: 'Services',
    },
    subscriptions: {
      tagline: 'Subscriptions',
      title: 'Bali Zen Prices and Packages',
      description:
        'Choose the subscription that best fits your rhythm and enjoy authentic Balinese relaxation, consistently.',
      subscriptionLabel: 'Subscription',
    },
    giftCard: {
      tagline: 'Gift Card',
    },
    buttons: {
      bookHere: 'Book here',
      whatsapp: 'WhatsApp',
      showMore: 'Show more',
      showLess: 'Show less',
    },
    units: {
      minutes: 'min',
      currency: 'RON',
    },
    labels: {
      new: 'New',
    },
  },
} as const;

export function getTranslations(lang: Lang) {
  return translations[lang];
}
