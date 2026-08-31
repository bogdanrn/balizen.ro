import type { CollectionConfig } from 'payload'

import { SYSTEM_GROUP } from './shared/groups'

export const Users: CollectionConfig = {
  slug: 'users',
  defaultSort: 'email',
  labels: {
    singular: { en: 'User', ro: 'Utilizator' },
    plural: { en: 'Users', ro: 'Utilizatori' },
  },
  admin: {
    group: SYSTEM_GROUP,
    useAsTitle: 'email',
    defaultColumns: ['email', 'updatedAt'],
    pagination: { defaultLimit: 25 },
    description: {
      en: 'People who can sign in to this admin panel. Everyone listed here can edit all content.',
      ro: 'Persoanele care se pot autentifica în acest panou. Toți cei de aici pot edita tot conținutul.',
    },
  },
  auth: true,
  fields: [
    // Email, password and session handling are added by `auth: true`.
  ],
  versions: false,
}
