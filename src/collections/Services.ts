import type { CollectionConfig } from 'payload'

import { CONTENT_GROUP } from './shared/groups'

// A massage offering a client can book. Has Pricing Tiers, an image, a manual
// order, and a modified date that drives the "New" badge (CONTEXT.md).
//
// Site ordering (src/lib/payload.ts) is unchanged by the move to drag-and-drop:
// recently modified services still come first inside their category, and the
// manual order decides between services sharing a modified date.
export const Services: CollectionConfig = {
  slug: 'services',
  orderable: true,
  labels: {
    singular: { en: 'Service', ro: 'Serviciu' },
    plural: { en: 'Services', ro: 'Servicii' },
  },
  admin: {
    group: CONTENT_GROUP,
    useAsTitle: 'title',
    // No defaultSort: `orderable` sets it to `_order`, which is what makes the
    // drag handle work. Setting it to anything else disables reordering.
    defaultColumns: ['title', 'category', 'pricingSummary', 'modifiedDate'],
    pagination: { defaultLimit: 50 },
    listSearchableFields: ['title', 'description'],
    description: {
      en: 'Every massage in the catalog. Drag rows by the handle on the left to set the order. On the site, recently updated services come first inside their category; this order decides between services with the same date.',
      ro: 'Toate masajele din catalog. Trage rândurile de mânerul din stânga pentru a stabili ordinea. Pe site, serviciile actualizate recent apar primele în categoria lor, iar ordinea de aici decide între serviciile cu aceeași dată.',
    },
  },
  access: {
    read: () => true,
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
      admin: {
        description: {
          en: 'Shown on the service card, under the title.',
          ro: 'Apare pe cardul serviciului, sub titlu.',
        },
      },
    },
    {
      name: 'pricing',
      type: 'array',
      required: true,
      minRows: 1,
      label: { en: 'Pricing Tiers', ro: 'Tarife' },
      labels: {
        singular: { en: 'Pricing Tier', ro: 'Tarif' },
        plural: { en: 'Pricing Tiers', ro: 'Tarife' },
      },
      admin: {
        description: {
          en: 'One row per duration the service is offered at. Drag the rows to change the order they are listed in.',
          ro: 'Câte un rând pentru fiecare durată la care se oferă serviciul. Trage rândurile pentru a schimba ordinea.',
        },
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'duration',
              type: 'number',
              required: true,
              min: 1,
              label: { en: 'Duration (minutes)', ro: 'Durată (minute)' },
              admin: {
                width: '50%',
                placeholder: '60',
                description: { en: 'Minutes, e.g. 60', ro: 'Minute, ex. 60' },
              },
            },
            {
              name: 'price',
              type: 'text',
              required: true,
              label: { en: 'Price (RON)', ro: 'Preț (RON)' },
              admin: {
                width: '50%',
                placeholder: '340',
                description: {
                  en: 'Digits only, no "RON" and no spaces. E.g. 340',
                  ro: 'Doar cifre, fără „RON” și fără spații. Ex. 340',
                },
              },
            },
          ],
        },
      ],
    },
    // Admin-only column: a one-line summary of the Pricing Tiers for the list
    // view. `ui` fields are never stored and never appear in API responses.
    {
      name: 'pricingSummary',
      type: 'ui',
      label: { en: 'Prices', ro: 'Tarife' },
      admin: {
        components: {
          Cell: '/components-admin/PricingSummaryCell#PricingSummaryCell',
        },
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'service-categories',
      required: true,
      label: { en: 'Category', ro: 'Categorie' },
      admin: {
        position: 'sidebar',
        description: {
          en: 'Which section of the catalog this service appears under.',
          ro: 'Secțiunea din catalog în care apare acest serviciu.',
        },
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: { en: 'Image', ro: 'Imagine' },
      admin: {
        position: 'sidebar',
        description: {
          en: 'Web-sized image: max 1600px wide, under 500KB. It is not resized for you.',
          ro: 'Imagine optimizată: max 1600px lățime, sub 500KB. Nu este redimensionată automat.',
        },
      },
    },
    {
      name: 'modifiedDate',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      label: { en: 'Last updated on', ro: 'Actualizat la' },
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMMM yyyy' },
        description: {
          en: 'Drives the "New" badge: shown for 2 months after this date, and pushes the service to the top of its category. Bump it when a service is meaningfully updated.',
          ro: 'Controlează insigna „Nou”: apare 2 luni după această dată și urcă serviciul în capul categoriei. Actualizeaz-o când serviciul se schimbă semnificativ.',
        },
      },
    },
  ],
}
