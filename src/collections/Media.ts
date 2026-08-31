import type { CollectionConfig } from 'payload'

import { CONTENT_GROUP } from './shared/groups'

// Uploaded images stored in R2 (S3 API) and served back through Payload's own
// /api/media/file route on this domain. `variants` holds pre-sized webp
// renditions generated at seed time; images uploaded through the admin keep
// variants empty and the site renders the original.
export const Media: CollectionConfig = {
  slug: 'media',
  defaultSort: '-updatedAt',
  labels: {
    singular: { en: 'Image', ro: 'Imagine' },
    plural: { en: 'Images', ro: 'Imagini' },
  },
  admin: {
    group: CONTENT_GROUP,
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'alt', 'filesize', 'updatedAt'],
    pagination: { defaultLimit: 25 },
    listSearchableFields: ['filename', 'alt'],
    description: {
      en: 'Every image used on the site. Resize before uploading: max 1600px wide and under 500KB — images are stored exactly as uploaded, nothing is resized for you.',
      ro: 'Toate imaginile folosite pe site. Redimensionează înainte de încărcare: max 1600px lățime și sub 500KB — imaginile se salvează exact cum sunt încărcate, nimic nu se redimensionează automat.',
    },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      localized: true,
      label: { en: 'Alt text', ro: 'Text alternativ' },
      admin: {
        description: {
          en: 'Describe what the image shows, in a few words. Read out to visually impaired visitors and used by search engines.',
          ro: 'Descrie în câteva cuvinte ce se vede în imagine. Este citit vizitatorilor cu deficiențe de vedere și folosit de motoarele de căutare.',
        },
      },
    },
    {
      name: 'variants',
      type: 'json',
      admin: {
        // Machine field: written by scripts/seed/1-images.ts, never by hand.
        hidden: true,
        readOnly: true,
      },
    },
  ],
  upload: {
    // Deliberate: staff resize before uploading (see the description above),
    // so the admin does not offer cropping. sharp is available on this host,
    // so flipping these on is a config change, nothing more.
    crop: false,
    focalPoint: false,
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
  },
}
