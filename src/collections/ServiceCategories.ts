import type { CollectionConfig } from 'payload'

import { CONTENT_GROUP } from './shared/groups'

// Named grouping of Services shown as a section of the catalog (CONTEXT.md).
// Drag-and-drop ordered: Payload keeps a hidden `_order` key per row.
export const ServiceCategories: CollectionConfig = {
  slug: 'service-categories',
  orderable: true,
  labels: {
    singular: { en: 'Service Category', ro: 'Categorie de servicii' },
    plural: { en: 'Service Categories', ro: 'Categorii de servicii' },
  },
  admin: {
    group: CONTENT_GROUP,
    useAsTitle: 'name',
    // No defaultSort: `orderable` sets it to `_order`, which is what makes the
    // drag handle work. Setting it to anything else disables reordering.
    defaultColumns: ['name', 'updatedAt'],
    pagination: { defaultLimit: 50 },
    description: {
      en: 'Sections of the service catalog. Drag rows by the handle on the left to change the order they appear on the site.',
      ro: 'Secțiunile din lista de servicii. Trage rândurile de mânerul din stânga pentru a schimba ordinea în care apar pe site.',
    },
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
      label: { en: 'Name', ro: 'Nume' },
      admin: {
        description: {
          en: 'E.g. "Masaje Full Body"',
          ro: 'Ex. „Masaje Full Body”',
        },
      },
    },
  ],
}
