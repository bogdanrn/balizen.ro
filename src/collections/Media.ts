import type { CollectionConfig } from 'payload'

// Uploaded images stored in R2, served from the cdn.balizen.ro public hostname.
// `variants` holds pre-sized webp renditions generated at seed time
// (sharp is unavailable on Workers, so runtime uploads keep variants empty and
// the site renders the original).
export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'filename',
    description: {
      en: 'Upload web-sized images: max 1600px wide, under 500KB. There is no server-side resizing.',
      ro: 'Încarcă imagini optimizate: max 1600px lățime, sub 500KB. Nu există redimensionare pe server.',
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
    },
    {
      name: 'variants',
      type: 'json',
      admin: {
        readOnly: true,
        description: { en: 'Pre-sized renditions, set by the image migration script.', ro: 'Variante pre-dimensionate, setate de scriptul de migrare.' },
      },
    },
  ],
  upload: {
    // These are not supported on Workers yet due to lack of sharp
    crop: false,
    focalPoint: false,
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
  },
}
