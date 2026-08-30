import type { CollectionConfig } from 'payload'

// A date-specific override to the regular opening hours (CONTEXT.md).
export const ExceptionalHours: CollectionConfig = {
  slug: 'exceptional-hours',
  admin: {
    useAsTitle: 'note',
    defaultColumns: ['date', 'closed', 'note'],
    description: {
      en: 'Date-specific overrides to opening hours, e.g. closed on December 25.',
      ro: 'Excepții de la programul normal, ex. închis pe 25 decembrie.',
    },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'closed',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar', description: { en: 'Checked = closed all day. Unchecked = custom hours below.', ro: 'Bifat = închis toată ziua. Nebifat = program special mai jos.' } },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'opensAt',
          type: 'text',
          admin: { width: '50%', condition: (_, data) => !data?.closed, description: { en: 'E.g. 10:00', ro: 'Ex. 10:00' } },
        },
        {
          name: 'closesAt',
          type: 'text',
          admin: { width: '50%', condition: (_, data) => !data?.closed, description: { en: 'E.g. 15:00', ro: 'Ex. 15:00' } },
        },
      ],
    },
    {
      name: 'note',
      type: 'text',
      localized: true,
      admin: { description: { en: 'Optional explanation shown on the site, e.g. "Crăciun"', ro: 'Explicație opțională afișată pe site, ex. "Crăciun"' } },
    },
  ],
}
