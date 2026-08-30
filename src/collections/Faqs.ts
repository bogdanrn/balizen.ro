import type { CollectionConfig } from 'payload'

// Per-locale Q&A pairs emitted as FAQPage structured data (CONTEXT.md).
export const Faqs: CollectionConfig = {
  slug: 'faqs',
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'order'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'answer',
      type: 'textarea',
      required: true,
      localized: true,
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 100,
      admin: { position: 'sidebar' },
    },
  ],
}
