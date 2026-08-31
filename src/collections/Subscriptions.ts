import type { CollectionConfig } from 'payload'

import { CONTENT_GROUP } from './shared/groups'

// Prepaid bundle of sessions sold at a fixed price (abonament), promoted on the
// homepage (CONTEXT.md).
export const Subscriptions: CollectionConfig = {
  slug: 'subscriptions',
  orderable: true,
  labels: {
    singular: { en: 'Subscription', ro: 'Abonament' },
    plural: { en: 'Subscriptions', ro: 'Abonamente' },
  },
  admin: {
    group: CONTENT_GROUP,
    useAsTitle: 'title',
    // No defaultSort: `orderable` sets it to `_order`, which is what makes the
    // drag handle work. Setting it to anything else disables reordering.
    defaultColumns: ['title', 'summary', 'updatedAt'],
    pagination: { defaultLimit: 25 },
    description: {
      en: 'The subscription cards on the homepage. Drag rows by the handle on the left to change the order they appear in.',
      ro: 'Cardurile de abonament de pe prima pagină. Trage rândurile de mânerul din stânga pentru a schimba ordinea în care apar.',
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
      name: 'summary',
      type: 'textarea',
      required: true,
      localized: true,
      label: { en: 'Summary', ro: 'Rezumat' },
      admin: {
        description: {
          en: 'Short paragraph under the title.',
          ro: 'Paragraful scurt de sub titlu.',
        },
      },
    },
    {
      name: 'highlights',
      type: 'array',
      required: true,
      minRows: 1,
      label: { en: 'Bullet points', ro: 'Puncte cheie' },
      labels: {
        singular: { en: 'Bullet point', ro: 'Punct cheie' },
        plural: { en: 'Bullet points', ro: 'Puncte cheie' },
      },
      admin: {
        description: {
          en: 'The checkmark list on the card. Put the price line here too, as on the current site.',
          ro: 'Lista cu bife de pe card. Pune și linia de preț aici, ca pe site-ul actual.',
        },
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
          localized: true,
          label: { en: 'Text', ro: 'Text' },
        },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: { en: 'Image', ro: 'Imagine' },
      admin: {
        position: 'sidebar',
        description: {
          en: 'Web-sized image: max 1600px wide, under 500KB.',
          ro: 'Imagine optimizată: max 1600px lățime, sub 500KB.',
        },
      },
    },
  ],
}
