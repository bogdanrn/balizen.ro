import type { CollectionConfig } from 'payload'

// Named grouping of Services shown as a section of the catalog (CONTEXT.md).
export const ServiceCategories: CollectionConfig = {
  slug: 'service-categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'order'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      admin: { description: { en: 'E.g. "Masaje Full Body"', ro: 'Ex. "Masaje Full Body"' } },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 100,
      admin: {
        position: 'sidebar',
        description: { en: 'Lower shows first. Categories are then sorted A-Z on the site.', ro: 'Mai mic = mai devreme. Categoriile sunt apoi sortate alfabetic pe site.' },
      },
    },
  ],
}
