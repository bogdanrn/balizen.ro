import type { Field, GlobalConfig } from 'payload'

// Homepage section copy, mirroring the legacy homepage.json 1:1. The services
// list, subscriptions, locations, and reviews live in their own collections;
// this global holds the copy for each section.
const actionFields: Field[] = [
  { name: 'label', type: 'text', required: true, localized: true },
  { name: 'href', type: 'text', required: true },
  { name: 'variant', type: 'select', options: ['primary', 'secondary'], defaultValue: 'primary' },
  { name: 'icon', type: 'text', admin: { description: { en: 'Tabler icon name, e.g. calendar', ro: 'Nume iconiță Tabler, ex. calendar' } } },
  { name: 'target', type: 'select', options: ['_self', '_blank'], defaultValue: '_self' },
  { name: 'className', type: 'text', admin: { description: { en: 'Optional CSS/JS hook classes (e.g. js-programari-button).', ro: 'Clase CSS/JS opționale (ex. js-programari-button).' } } },
]


export const Homepage: GlobalConfig = {
  slug: 'homepage',
  admin: {
    description: { en: 'Copy for every homepage section, per locale.', ro: 'Textele fiecărei secțiuni de pe prima pagină, per limbă.' },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [
            { name: 'heroTitle', type: 'text', required: true, localized: true, admin: { description: { en: 'Use \n for a line break.', ro: 'Folosește \n pentru rând nou.' } } },
            {
              name: 'heroSubtitle',
              type: 'array',
              required: true,
              minRows: 1,
              fields: [{ name: 'line', type: 'text', required: true, localized: true }],
            },
            { name: 'heroText', type: 'text', localized: true },
            {
              name: 'heroActions',
              type: 'array',
              labels: { singular: { en: 'Action', ro: 'Buton' }, plural: { en: 'Actions', ro: 'Butoane' } },
              fields: actionFields,
            },
            { name: 'heroImage', type: 'upload', relationTo: 'media' },
          ],
        },
        {
          label: { en: 'About', ro: 'Despre' },
          fields: [
            { name: 'aboutTagline', type: 'text', localized: true },
            { name: 'aboutTitle', type: 'text', required: true, localized: true },
            { name: 'aboutIntro', type: 'textarea', required: true, localized: true },
            {
              name: 'aboutBullets',
              type: 'array',
              fields: [
                { name: 'title', type: 'text', required: true, localized: true },
                { name: 'description', type: 'textarea', required: true, localized: true },
              ],
            },
            { name: 'aboutCta', type: 'group', fields: actionFields },
            { name: 'aboutImage', type: 'upload', relationTo: 'media' },
          ],
        },
        {
          label: { en: 'Services section', ro: 'Secțiunea Servicii' },
          fields: [
            { name: 'servicesTitle', type: 'text', required: true, localized: true },
            { name: 'servicesDescription', type: 'textarea', required: true, localized: true },
            { name: 'servicesCta', type: 'group', fields: actionFields },
          ],
        },
        {
          label: { en: 'Subscriptions section', ro: 'Secțiunea Abonamente' },
          admin: { description: { en: 'The subscription cards themselves live in the Subscriptions collection.', ro: 'Cardurile de abonament sunt în colecția Abonamente (Subscriptions).' } },
          fields: [
            { name: 'subscriptionAction', type: 'group', fields: actionFields },
            {
              name: 'subscriptionDisclaimer',
              type: 'array',
              fields: [{ name: 'line', type: 'text', required: true, localized: true }],
              admin: { description: { en: 'Markdown links supported: [text](/return-policy)', ro: 'Linkuri markdown acceptate: [text](/return-policy)' } },
            },
          ],
        },
        {
          label: { en: 'Gift Card section', ro: 'Secțiunea Card Cadou' },
          fields: [
            { name: 'giftCardTitle', type: 'text', required: true, localized: true },
            {
              name: 'giftCardDescription',
              type: 'array',
              fields: [{ name: 'paragraph', type: 'textarea', required: true, localized: true }],
            },
            {
              name: 'giftCardFeatures',
              type: 'array',
              fields: [
                { name: 'icon', type: 'text', required: true },
                { name: 'title', type: 'text', required: true, localized: true },
                { name: 'description', type: 'textarea', required: true, localized: true },
              ],
            },
            { name: 'giftCardCta', type: 'group', fields: actionFields },
            { name: 'giftCardImage', type: 'upload', relationTo: 'media' },
            {
              name: 'giftCardDisclaimer',
              type: 'array',
              fields: [{ name: 'line', type: 'text', required: true, localized: true }],
              admin: { description: { en: 'Markdown links supported: [text](/return-policy)', ro: 'Linkuri markdown acceptate: [text](/return-policy)' } },
            },
          ],
        },
        {
          label: { en: 'Social section', ro: 'Secțiunea Social' },
          fields: [
            { name: 'socialTitle', type: 'text', required: true, localized: true },
            { name: 'socialSubtitle', type: 'textarea', localized: true },
            {
              name: 'socialLinks',
              type: 'array',
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'handle', type: 'text' },
                { name: 'href', type: 'text', required: true },
                { name: 'icon', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          label: { en: 'Call to Action', ro: 'Apel la Acțiune' },
          fields: [
            { name: 'ctaTitle', type: 'text', required: true, localized: true },
            { name: 'ctaSubtitle', type: 'textarea', required: true, localized: true },
            { name: 'ctaButton', type: 'group', fields: actionFields },
          ],
        },
        {
          label: { en: 'Location section', ro: 'Secțiunea Locație' },
          admin: { description: { en: 'The location cards themselves live in the Locations collection.', ro: 'Cardurile de locație sunt în colecția Locații (Locations).' } },
          fields: [
            { name: 'locationTitle', type: 'text', required: true, localized: true },
            { name: 'locationEmail', type: 'email' },
          ],
        },
      ],
    },
  ],
}
