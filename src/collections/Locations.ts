import type { CollectionConfig } from 'payload'

// Staff can add more studio locations over time. The Footer, LocationSection,
// and JSON-LD blocks all read from this collection.
export const Locations: CollectionConfig = {
  slug: 'locations',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'primary', 'order'],
    description: {
      en: 'Studio locations shown in the Contact/Location section, footer, and search-engine structured data.',
      ro: 'Locațiile studioului afișate în secțiunea Locație, footer și datele structurate pentru motoarele de căutare.',
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
      admin: {
        description: {
          en: 'Short display name, e.g. "Str. Gh Gr Cantacuzino 190 1B, Ploiești"',
          ro: 'Nume scurt afișat, ex. "Str. Gh Gr Cantacuzino 190 1B, Ploiești"',
        },
      },
    },
    {
      name: 'address',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'schedule',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: {
          en: 'Opening hours text, e.g. "Monday - Sunday: 10:00 - 21:00"',
          ro: 'Program afișat, ex. "Luni - Duminică: 10:00 - 21:00"',
        },
      },
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      admin: { description: { en: 'Display format, e.g. +40 733 211 325', ro: 'Format afișat, ex. +40 733 211 325' } },
    },
    {
      name: 'phoneHref',
      type: 'text',
      required: true,
      admin: { description: { en: 'tel: link, e.g. tel:+40733211325', ro: 'Link tel:, ex. tel:+40733211325' } },
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'mapsUrl',
      type: 'text',
      required: true,
      admin: { description: { en: 'Google Maps share link', ro: 'Link de partajare Google Maps' } },
    },
    {
      name: 'mapsEmbedUrl',
      type: 'textarea',
      localized: true,
      admin: {
        description: {
          en: 'Google Maps "Share > Embed a map" iframe URL. Keep the hl parameter matching the locale.',
          ro: 'URL-ul iframe din Google Maps "Share > Embed a map". Păstrează parametrul hl potrivit limbii.',
        },
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'geoLat',
          type: 'number',
          admin: { width: '50%', description: { en: 'Latitude for structured data, e.g. 44.9364', ro: 'Latitudine pentru date structurate, ex. 44.9364' } },
        },
        {
          name: 'geoLng',
          type: 'number',
          admin: { width: '50%', description: { en: 'Longitude for structured data, e.g. 26.0325', ro: 'Longitudine pentru date structurate, ex. 26.0325' } },
        },
      ],
    },
    {
      name: 'primary',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: {
          en: 'The primary location feeds the single-business structured data (JSON-LD). Exactly one should be primary.',
          ro: 'Locația principală alimentează datele structurate (JSON-LD). Exact una ar trebui să fie principală.',
        },
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 100,
      admin: { position: 'sidebar' },
    },
  ],
}
