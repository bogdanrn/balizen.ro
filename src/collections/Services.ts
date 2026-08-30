import type { CollectionConfig } from 'payload'

// A massage offering a client can book. Has Pricing Tiers, an image, a display
// order, and a modified date that drives the "New" badge (CONTEXT.md).
export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'order', 'modifiedDate'],
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
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      localized: true,
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'service-categories',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'pricing',
      type: 'array',
      required: true,
      minRows: 1,
      labels: { singular: { en: 'Pricing Tier', ro: 'Tarif' }, plural: { en: 'Pricing Tiers', ro: 'Tarife' } },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'duration',
              type: 'number',
              required: true,
              admin: { width: '50%', description: { en: 'Minutes, e.g. 60', ro: 'Minute, ex. 60' } },
            },
            {
              name: 'price',
              type: 'text',
              required: true,
              admin: { width: '50%', description: { en: 'RON, digits only, e.g. "340"', ro: 'RON, doar cifre, ex. "340"' } },
            },
          ],
        },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        position: 'sidebar',
        description: { en: 'Web-sized image: max 1600px wide, under 500KB.', ro: 'Imagine optimizată: max 1600px lățime, sub 500KB.' },
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 100,
      admin: {
        position: 'sidebar',
        description: { en: 'Secondary sort within the category (lower first).', ro: 'Sortare secundară în categorie (mai mic = primul).' },
      },
    },
    {
      name: 'modifiedDate',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: 'sidebar',
        description: {
          en: 'Drives the "New" badge: shown for 2 months after this date. Bump it when a service is meaningfully updated.',
          ro: 'Controlează insigna "Nou": afișată 2 luni după această dată. Actualizează-o când serviciul se schimbă semnificativ.',
        },
      },
    },
  ],
}
