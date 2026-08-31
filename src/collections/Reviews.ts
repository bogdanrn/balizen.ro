import type { CollectionConfig } from 'payload'

import { CONTENT_GROUP } from './shared/groups'

// Curated client testimonial. Single-language by design, shown on all locales;
// ratings aggregate into structured data (CONTEXT.md).
export const Reviews: CollectionConfig = {
  slug: 'reviews',
  defaultSort: '-date',
  labels: {
    singular: { en: 'Review', ro: 'Recenzie' },
    plural: { en: 'Reviews', ro: 'Recenzii' },
  },
  admin: {
    group: CONTENT_GROUP,
    useAsTitle: 'author',
    defaultColumns: ['author', 'rating', 'date', 'text'],
    pagination: { defaultLimit: 25 },
    listSearchableFields: ['author', 'text'],
    description: {
      en: 'Client testimonials shown on the site, newest first. They are not translated: the same text is shown in both languages.',
      ro: 'Recenziile clienților afișate pe site, cele mai noi primele. Nu se traduc: același text apare în ambele limbi.',
    },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'author',
      type: 'text',
      required: true,
      label: { en: 'Author', ro: 'Autor' },
      admin: {
        description: {
          en: 'Name as it should appear on the site, e.g. "Andreea M."',
          ro: 'Numele așa cum apare pe site, ex. „Andreea M.”',
        },
      },
    },
    {
      name: 'text',
      type: 'textarea',
      required: true,
      label: { en: 'Review', ro: 'Recenzie' },
      admin: {
        description: {
          en: 'The testimonial itself. Not translated — write it in the language the client used.',
          ro: 'Textul recenziei. Nu se traduce — scrie-l în limba folosită de client.',
        },
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'rating',
          type: 'number',
          required: true,
          min: 1,
          max: 5,
          defaultValue: 5,
          label: { en: 'Rating', ro: 'Notă' },
          admin: {
            width: '50%',
            step: 1,
            description: {
              en: 'Whole stars, 1 to 5. Feeds the average rating shown in search results.',
              ro: 'Stele întregi, de la 1 la 5. Alimentează media afișată în rezultatele căutării.',
            },
          },
        },
        {
          name: 'date',
          type: 'date',
          required: true,
          label: { en: 'Date', ro: 'Data' },
          admin: {
            width: '50%',
            date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMMM yyyy' },
            description: {
              en: 'When the review was left. Newest reviews are shown first.',
              ro: 'Când a fost lăsată recenzia. Recenziile noi apar primele.',
            },
          },
        },
      ],
    },
  ],
}
