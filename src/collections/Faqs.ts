import type { CollectionConfig } from 'payload'

import { CONTENT_GROUP } from './shared/groups'

// Per-locale Q&A pairs emitted as FAQPage structured data (CONTEXT.md).
export const Faqs: CollectionConfig = {
  slug: 'faqs',
  orderable: true,
  labels: {
    singular: { en: 'FAQ', ro: 'Întrebare frecventă' },
    plural: { en: 'FAQs', ro: 'Întrebări frecvente' },
  },
  admin: {
    group: CONTENT_GROUP,
    useAsTitle: 'question',
    // No defaultSort: `orderable` sets it to `_order`, which is what makes the
    // drag handle work. Setting it to anything else disables reordering.
    defaultColumns: ['question', 'updatedAt'],
    pagination: { defaultLimit: 50 },
    listSearchableFields: ['question', 'answer'],
    description: {
      en: 'Questions and answers shown on the site and sent to search engines. Drag rows by the handle on the left to change the order.',
      ro: 'Întrebările și răspunsurile afișate pe site și trimise motoarelor de căutare. Trage rândurile de mânerul din stânga pentru a schimba ordinea.',
    },
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
      label: { en: 'Question', ro: 'Întrebare' },
    },
    {
      name: 'answer',
      type: 'textarea',
      required: true,
      localized: true,
      label: { en: 'Answer', ro: 'Răspuns' },
      admin: {
        description: {
          en: 'Plain text, no links. Search engines show this answer directly in results, so keep it complete on its own.',
          ro: 'Text simplu, fără linkuri. Motoarele de căutare afișează răspunsul direct în rezultate, deci scrie-l ca să se înțeleagă de sine stătător.',
        },
      },
    },
  ],
}
