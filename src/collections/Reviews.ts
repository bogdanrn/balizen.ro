import type { CollectionConfig } from 'payload'

// Curated client testimonial. Single-language by design, shown on all locales;
// ratings aggregate into structured data (CONTEXT.md).
export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'author',
    defaultColumns: ['author', 'rating', 'date'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'author',
      type: 'text',
      required: true,
    },
    {
      name: 'text',
      type: 'textarea',
      required: true,
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
      defaultValue: 5,
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: { position: 'sidebar' },
    },
  ],
}
