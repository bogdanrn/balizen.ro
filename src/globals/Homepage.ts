import type { Field, GlobalConfig } from 'payload'

import { SETTINGS_GROUP } from '../collections/shared/groups'

// Homepage section copy, mirroring the legacy homepage.json 1:1. The services
// list, subscriptions, locations, and reviews live in their own collections;
// this global holds the copy for each section.

const IMAGE_HELP = {
  en: 'Web-sized image: max 1600px wide, under 500KB. It is not resized for you.',
  ro: 'Imagine optimizată: max 1600px lățime, sub 500KB. Nu este redimensionată automat.',
}

const ICON_HELP = {
  en: 'Tabler icon name, e.g. calendar. Leave empty for no icon. Browse the names at tabler.io/icons.',
  ro: 'Nume de iconiță Tabler, ex. calendar. Lasă gol pentru niciun icon. Numele se caută pe tabler.io/icons.',
}

// Behaviour-only class hook. Wording deliberately left as-is: it is the
// agreed explanation that styling classes are ignored.
const classNameField = (example: string): Field => ({
  name: 'className',
  type: 'text',
  label: { en: 'Behaviour class', ro: 'Clasă de comportament' },
  admin: {
    description: {
      en: `Behaviour hooks only — just js-* classes (e.g. ${example}) are honoured; any styling classes are ignored. Use Style to change how the button looks.`,
      ro: `Doar clase de comportament — sunt folosite exclusiv clasele js-* (ex. ${example}); clasele de stil sunt ignorate. Folosește Stil pentru aspectul butonului.`,
    },
  },
})

const actionFields: Field[] = [
  {
    type: 'row',
    fields: [
      {
        name: 'label',
        type: 'text',
        required: true,
        localized: true,
        label: { en: 'Button text', ro: 'Text buton' },
        admin: { width: '50%' },
      },
      {
        name: 'href',
        type: 'text',
        required: true,
        label: { en: 'Link', ro: 'Link' },
        admin: {
          width: '50%',
          description: {
            en: 'Anchor like /#servicii, a page like /return-policy, or a full https:// address.',
            ro: 'Ancoră gen /#servicii, o pagină gen /return-policy sau o adresă https:// completă.',
          },
        },
      },
    ],
  },
  {
    type: 'row',
    fields: [
      {
        name: 'variant',
        type: 'select',
        defaultValue: 'primary',
        label: { en: 'Style', ro: 'Stil' },
        options: [
          { label: { en: 'Primary (filled)', ro: 'Principal (plin)' }, value: 'primary' },
          { label: { en: 'Secondary (outline)', ro: 'Secundar (contur)' }, value: 'secondary' },
        ],
        admin: { width: '50%' },
      },
      {
        name: 'icon',
        type: 'text',
        label: { en: 'Icon', ro: 'Iconiță' },
        admin: { width: '50%', placeholder: 'calendar', description: ICON_HELP },
      },
    ],
  },
  {
    type: 'collapsible',
    label: { en: 'Advanced', ro: 'Avansat' },
    admin: { initCollapsed: true },
    fields: [
      {
        name: 'target',
        type: 'select',
        defaultValue: '_self',
        label: { en: 'Opens in', ro: 'Se deschide în' },
        options: [
          { label: { en: 'Same tab', ro: 'Aceeași filă' }, value: '_self' },
          { label: { en: 'New tab', ro: 'Filă nouă' }, value: '_blank' },
        ],
      },
      classNameField('js-programari-button'),
    ],
  },
]

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: { en: 'Homepage', ro: 'Prima pagină' },
  admin: {
    group: SETTINGS_GROUP,
    description: {
      en: 'The text of every section on the homepage, per language. Services, subscriptions, locations, and reviews are edited in their own collections.',
      ro: 'Textele fiecărei secțiuni de pe prima pagină, pentru fiecare limbă. Serviciile, abonamentele, locațiile și recenziile se editează în colecțiile lor.',
    },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: { en: 'Hero', ro: 'Antet' },
          description: {
            en: 'The first thing a visitor sees, at the top of the page.',
            ro: 'Primul lucru pe care îl vede un vizitator, în capul paginii.',
          },
          fields: [
            {
              // Rendered with `whitespace-pre-line`, so real line breaks in the
              // value show up on the page. A single-line text input gave staff
              // no way to type one; a textarea maps to the same `text` column.
              name: 'heroTitle',
              type: 'textarea',
              required: true,
              localized: true,
              label: { en: 'Title', ro: 'Titlu' },
              admin: {
                rows: 2,
                description: {
                  en: 'Press Enter where you want the title to break onto a new line.',
                  ro: 'Apasă Enter acolo unde vrei ca titlul să treacă pe rând nou.',
                },
              },
            },
            {
              name: 'heroSubtitle',
              type: 'array',
              required: true,
              minRows: 1,
              label: { en: 'Subtitle lines', ro: 'Rânduri subtitlu' },
              labels: {
                singular: { en: 'Line', ro: 'Rând' },
                plural: { en: 'Lines', ro: 'Rânduri' },
              },
              admin: {
                description: {
                  en: 'One row per line of the subtitle.',
                  ro: 'Câte un rând pentru fiecare linie din subtitlu.',
                },
              },
              fields: [
                {
                  name: 'line',
                  type: 'text',
                  required: true,
                  localized: true,
                  label: { en: 'Line', ro: 'Rând' },
                },
              ],
            },
            {
              name: 'heroText',
              type: 'text',
              localized: true,
              label: { en: 'Intro text', ro: 'Text introductiv' },
              admin: {
                description: {
                  en: 'Optional short sentence under the subtitle.',
                  ro: 'Propoziție scurtă opțională, sub subtitlu.',
                },
              },
            },
            {
              name: 'heroActions',
              type: 'array',
              label: { en: 'Buttons', ro: 'Butoane' },
              labels: {
                singular: { en: 'Button', ro: 'Buton' },
                plural: { en: 'Buttons', ro: 'Butoane' },
              },
              admin: {
                description: {
                  en: 'Drag the rows to change the order the buttons appear in.',
                  ro: 'Trage rândurile pentru a schimba ordinea butoanelor.',
                },
              },
              fields: actionFields,
            },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              label: { en: 'Image', ro: 'Imagine' },
              admin: { description: IMAGE_HELP },
            },
          ],
        },
        {
          label: { en: 'About', ro: 'Despre' },
          fields: [
            {
              name: 'aboutTagline',
              type: 'text',
              localized: true,
              label: { en: 'Tagline', ro: 'Supratitlu' },
              admin: {
                description: {
                  en: 'Small line above the section title.',
                  ro: 'Rândul mic de deasupra titlului de secțiune.',
                },
              },
            },
            {
              name: 'aboutTitle',
              type: 'text',
              required: true,
              localized: true,
              label: { en: 'Title', ro: 'Titlu' },
            },
            {
              name: 'aboutIntro',
              type: 'textarea',
              required: true,
              localized: true,
              label: { en: 'Intro text', ro: 'Text introductiv' },
            },
            {
              name: 'aboutBullets',
              type: 'array',
              label: { en: 'Points', ro: 'Puncte' },
              labels: {
                singular: { en: 'Point', ro: 'Punct' },
                plural: { en: 'Points', ro: 'Puncte' },
              },
              admin: {
                description: {
                  en: 'Drag the rows to change the order.',
                  ro: 'Trage rândurile pentru a schimba ordinea.',
                },
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  localized: true,
                  label: { en: 'Title', ro: 'Titlu' },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  required: true,
                  localized: true,
                  label: { en: 'Description', ro: 'Descriere' },
                },
              ],
            },
            {
              name: 'aboutCta',
              type: 'group',
              label: { en: 'Button', ro: 'Buton' },
              fields: actionFields,
            },
            {
              name: 'aboutImage',
              type: 'upload',
              relationTo: 'media',
              label: { en: 'Image', ro: 'Imagine' },
              admin: { description: IMAGE_HELP },
            },
          ],
        },
        {
          label: { en: 'Services section', ro: 'Secțiunea Servicii' },
          description: {
            en: 'Only the heading of the section. The service cards come from the Services collection.',
            ro: 'Doar antetul secțiunii. Cardurile de servicii vin din colecția Servicii.',
          },
          fields: [
            {
              name: 'servicesTitle',
              type: 'text',
              required: true,
              localized: true,
              label: { en: 'Title', ro: 'Titlu' },
            },
            {
              name: 'servicesDescription',
              type: 'textarea',
              required: true,
              localized: true,
              label: { en: 'Description', ro: 'Descriere' },
            },
            {
              name: 'servicesCta',
              type: 'group',
              label: { en: 'Button', ro: 'Buton' },
              fields: actionFields,
            },
          ],
        },
        {
          label: { en: 'Subscriptions section', ro: 'Secțiunea Abonamente' },
          description: {
            en: 'The subscription cards themselves are edited in the Subscriptions collection.',
            ro: 'Cardurile de abonament se editează în colecția Abonamente.',
          },
          fields: [
            {
              name: 'subscriptionAction',
              type: 'group',
              label: { en: 'Button', ro: 'Buton' },
              fields: actionFields,
            },
            {
              name: 'subscriptionDisclaimer',
              type: 'array',
              label: { en: 'Small print', ro: 'Mențiuni' },
              labels: {
                singular: { en: 'Line', ro: 'Rând' },
                plural: { en: 'Lines', ro: 'Rânduri' },
              },
              fields: [
                {
                  name: 'line',
                  type: 'text',
                  required: true,
                  localized: true,
                  label: { en: 'Line', ro: 'Rând' },
                },
              ],
              admin: {
                description: {
                  en: 'Fine print under the cards. Links are written as [text](/return-policy).',
                  ro: 'Textul mărunt de sub carduri. Linkurile se scriu ca [text](/return-policy).',
                },
              },
            },
          ],
        },
        {
          label: { en: 'Gift Card section', ro: 'Secțiunea Card Cadou' },
          fields: [
            {
              name: 'giftCardTitle',
              type: 'text',
              required: true,
              localized: true,
              label: { en: 'Title', ro: 'Titlu' },
            },
            {
              name: 'giftCardDescription',
              type: 'array',
              label: { en: 'Paragraphs', ro: 'Paragrafe' },
              labels: {
                singular: { en: 'Paragraph', ro: 'Paragraf' },
                plural: { en: 'Paragraphs', ro: 'Paragrafe' },
              },
              fields: [
                {
                  name: 'paragraph',
                  type: 'textarea',
                  required: true,
                  localized: true,
                  label: { en: 'Paragraph', ro: 'Paragraf' },
                },
              ],
            },
            {
              name: 'giftCardFeatures',
              type: 'array',
              label: { en: 'Features', ro: 'Avantaje' },
              labels: {
                singular: { en: 'Feature', ro: 'Avantaj' },
                plural: { en: 'Features', ro: 'Avantaje' },
              },
              fields: [
                {
                  name: 'icon',
                  type: 'text',
                  required: true,
                  label: { en: 'Icon', ro: 'Iconiță' },
                  admin: { placeholder: 'gift', description: ICON_HELP },
                },
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  localized: true,
                  label: { en: 'Title', ro: 'Titlu' },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  required: true,
                  localized: true,
                  label: { en: 'Description', ro: 'Descriere' },
                },
              ],
            },
            {
              name: 'giftCardCta',
              type: 'group',
              label: { en: 'Button', ro: 'Buton' },
              fields: actionFields,
            },
            {
              name: 'giftCardImage',
              type: 'upload',
              relationTo: 'media',
              label: { en: 'Image', ro: 'Imagine' },
              admin: { description: IMAGE_HELP },
            },
            {
              name: 'giftCardDisclaimer',
              type: 'array',
              label: { en: 'Small print', ro: 'Mențiuni' },
              labels: {
                singular: { en: 'Line', ro: 'Rând' },
                plural: { en: 'Lines', ro: 'Rânduri' },
              },
              fields: [
                {
                  name: 'line',
                  type: 'text',
                  required: true,
                  localized: true,
                  label: { en: 'Line', ro: 'Rând' },
                },
              ],
              admin: {
                description: {
                  en: 'Fine print under the section. Links are written as [text](/return-policy).',
                  ro: 'Textul mărunt de sub secțiune. Linkurile se scriu ca [text](/return-policy).',
                },
              },
            },
          ],
        },
        {
          label: { en: 'Social section', ro: 'Secțiunea Social' },
          fields: [
            {
              name: 'socialTitle',
              type: 'text',
              required: true,
              localized: true,
              label: { en: 'Title', ro: 'Titlu' },
            },
            {
              name: 'socialSubtitle',
              type: 'textarea',
              localized: true,
              label: { en: 'Subtitle', ro: 'Subtitlu' },
            },
            {
              name: 'socialLinks',
              type: 'array',
              label: { en: 'Social links', ro: 'Linkuri sociale' },
              labels: {
                singular: { en: 'Social link', ro: 'Link social' },
                plural: { en: 'Social links', ro: 'Linkuri sociale' },
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      required: true,
                      label: { en: 'Network', ro: 'Rețea' },
                      admin: { width: '50%', placeholder: 'Instagram' },
                    },
                    {
                      name: 'handle',
                      type: 'text',
                      label: { en: 'Handle', ro: 'Nume de utilizator' },
                      admin: { width: '50%', placeholder: '@balizen.ro' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'href',
                      type: 'text',
                      required: true,
                      label: { en: 'Link', ro: 'Link' },
                      admin: { width: '50%' },
                    },
                    {
                      name: 'icon',
                      type: 'text',
                      required: true,
                      label: { en: 'Icon', ro: 'Iconiță' },
                      admin: {
                        width: '50%',
                        placeholder: 'brand-instagram',
                        description: ICON_HELP,
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: { en: 'Call to Action', ro: 'Apel la Acțiune' },
          description: {
            en: 'The closing band that invites the visitor to book.',
            ro: 'Banda de final care invită vizitatorul să facă o programare.',
          },
          fields: [
            {
              name: 'ctaTitle',
              type: 'text',
              required: true,
              localized: true,
              label: { en: 'Title', ro: 'Titlu' },
            },
            {
              name: 'ctaSubtitle',
              type: 'textarea',
              required: true,
              localized: true,
              label: { en: 'Subtitle', ro: 'Subtitlu' },
            },
            {
              name: 'ctaButton',
              type: 'group',
              label: { en: 'Button', ro: 'Buton' },
              fields: actionFields,
            },
          ],
        },
        {
          label: { en: 'Location section', ro: 'Secțiunea Locație' },
          description: {
            en: 'The location cards themselves are edited in the Locations collection.',
            ro: 'Cardurile de locație se editează în colecția Locații.',
          },
          fields: [
            {
              name: 'locationTitle',
              type: 'text',
              required: true,
              localized: true,
              label: { en: 'Title', ro: 'Titlu' },
            },
            {
              name: 'locationEmail',
              type: 'email',
              label: { en: 'Contact email', ro: 'Email de contact' },
              admin: {
                description: {
                  en: 'Shown next to the location cards.',
                  ro: 'Apare lângă cardurile de locație.',
                },
              },
            },
          ],
        },
      ],
    },
  ],
}
