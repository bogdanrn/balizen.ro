import type { CollectionConfig } from 'payload'

// Prepaid bundle of sessions sold at a fixed price (abonament), promoted on the
// homepage (CONTEXT.md).
export const Subscriptions: CollectionConfig = {
  slug: 'subscriptions',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'order'],
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
      name: 'summary',
      type: 'textarea',
      required: true,
      localized: true,
    },
    {
      name: 'highlights',
      type: 'array',
      required: true,
      minRows: 1,
      admin: { description: { en: 'Checkmark list items. Put the price line here too, as in the current site.', ro: 'Elemente ale listei cu bifă. Pune și linia de preț aici, ca pe site-ul actual.' } },
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
          localized: true,
        },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { position: 'sidebar' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 100,
      admin: { position: 'sidebar' },
    },
  ],
}
