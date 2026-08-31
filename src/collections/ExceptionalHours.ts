import type { CollectionConfig } from 'payload'

import { SCHEDULE_GROUP } from './shared/groups'

// A date-specific override to the regular opening hours (CONTEXT.md).
export const ExceptionalHours: CollectionConfig = {
  slug: 'exceptional-hours',
  defaultSort: 'date',
  labels: {
    singular: { en: 'Exceptional Hours', ro: 'Zi cu program excepțional' },
    plural: { en: 'Exceptional Hours', ro: 'Program excepțional' },
  },
  admin: {
    group: SCHEDULE_GROUP,
    useAsTitle: 'date',
    defaultColumns: ['date', 'closed', 'opensAt', 'closesAt', 'note'],
    pagination: { defaultLimit: 50 },
    description: {
      en: 'One row per day that differs from the regular opening hours, e.g. closed on December 25. Add a row only for the exceptions; ordinary days need nothing here.',
      ro: 'Câte un rând pentru fiecare zi care diferă de programul obișnuit, ex. închis pe 25 decembrie. Adaugă un rând doar pentru excepții; zilele obișnuite nu au nevoie de nimic aici.',
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
      label: { en: 'Date', ro: 'Data' },
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMMM yyyy' },
        description: {
          en: 'The single day this applies to.',
          ro: 'Ziua la care se aplică.',
        },
      },
    },
    {
      name: 'closed',
      type: 'checkbox',
      defaultValue: true,
      label: { en: 'Closed all day', ro: 'Închis toată ziua' },
      admin: {
        position: 'sidebar',
        description: {
          en: 'Ticked = closed all day. Untick it to set special hours instead.',
          ro: 'Bifat = închis toată ziua. Debifează pentru a seta un program special.',
        },
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'opensAt',
          type: 'text',
          label: { en: 'Opens at', ro: 'Se deschide la' },
          admin: {
            width: '50%',
            condition: (_, data) => !data?.closed,
            placeholder: '10:00',
            description: { en: 'E.g. 10:00', ro: 'Ex. 10:00' },
          },
        },
        {
          name: 'closesAt',
          type: 'text',
          label: { en: 'Closes at', ro: 'Se închide la' },
          admin: {
            width: '50%',
            condition: (_, data) => !data?.closed,
            placeholder: '15:00',
            description: { en: 'E.g. 15:00', ro: 'Ex. 15:00' },
          },
        },
      ],
    },
    {
      name: 'note',
      type: 'text',
      localized: true,
      label: { en: 'Note', ro: 'Notă' },
      admin: {
        description: {
          en: 'Optional explanation shown on the site, e.g. "Crăciun".',
          ro: 'Explicație opțională afișată pe site, ex. „Crăciun”.',
        },
      },
    },
  ],
}
