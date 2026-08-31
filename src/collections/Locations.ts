import type { CollectionConfig } from 'payload'

import { SCHEDULE_GROUP } from './shared/groups'

// Staff can add more studio locations over time. The Footer, LocationSection,
// and JSON-LD blocks all read from this collection.
export const Locations: CollectionConfig = {
  slug: 'locations',
  orderable: true,
  labels: {
    singular: { en: 'Location', ro: 'Locație' },
    plural: { en: 'Locations', ro: 'Locații' },
  },
  admin: {
    group: SCHEDULE_GROUP,
    useAsTitle: 'name',
    // No defaultSort: `orderable` sets it to `_order`, which is what makes the
    // drag handle work. Setting it to anything else disables reordering.
    defaultColumns: ['name', 'phone', 'primary', 'updatedAt'],
    pagination: { defaultLimit: 25 },
    description: {
      en: 'The studios shown in the Location section, in the footer, and in the data sent to search engines. Drag rows by the handle on the left to change the order.',
      ro: 'Studiourile afișate în secțiunea Locație, în footer și în datele trimise motoarelor de căutare. Trage rândurile de mânerul din stânga pentru a schimba ordinea.',
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
      label: { en: 'Name', ro: 'Nume' },
      admin: {
        description: {
          en: 'Short display name, e.g. "Str. Gh Gr Cantacuzino 190 1B, Ploiești"',
          ro: 'Nume scurt afișat, ex. „Str. Gh Gr Cantacuzino 190 1B, Ploiești”',
        },
      },
    },
    {
      name: 'address',
      type: 'text',
      required: true,
      localized: true,
      label: { en: 'Address', ro: 'Adresă' },
      admin: {
        description: {
          en: 'Full address as clients should read it.',
          ro: 'Adresa completă, așa cum o citesc clienții.',
        },
      },
    },
    {
      name: 'schedule',
      type: 'text',
      required: true,
      localized: true,
      label: { en: 'Opening hours', ro: 'Program' },
      admin: {
        description: {
          en: 'Free text, e.g. "Monday - Sunday: 10:00 - 21:00". One-off closures go in Exceptional Hours.',
          ro: 'Text liber, ex. „Luni - Duminică: 10:00 - 21:00”. Zilele speciale se adaugă la Program excepțional.',
        },
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'phone',
          type: 'text',
          required: true,
          label: { en: 'Phone (displayed)', ro: 'Telefon (afișat)' },
          admin: {
            width: '50%',
            placeholder: '+40 733 211 325',
            description: {
              en: 'Display format, e.g. +40 733 211 325',
              ro: 'Format afișat, ex. +40 733 211 325',
            },
          },
        },
        {
          name: 'phoneHref',
          type: 'text',
          required: true,
          label: { en: 'Phone (tap-to-call link)', ro: 'Telefon (link de apelare)' },
          admin: {
            width: '50%',
            placeholder: 'tel:+40733211325',
            description: {
              en: 'Same number as a tel: link, no spaces. E.g. tel:+40733211325',
              ro: 'Același număr, ca link tel:, fără spații. Ex. tel:+40733211325',
            },
          },
        },
      ],
    },
    {
      name: 'email',
      type: 'email',
      label: { en: 'Email', ro: 'Email' },
      admin: {
        description: {
          en: 'Optional. Leave empty to use the site-wide contact email.',
          ro: 'Opțional. Lasă gol pentru a folosi adresa de contact a site-ului.',
        },
      },
    },
    {
      type: 'collapsible',
      label: { en: 'Map & coordinates', ro: 'Hartă & coordonate' },
      admin: {
        initCollapsed: true,
        description: {
          en: 'Rarely changes. Only touch this if the studio moves.',
          ro: 'Se schimbă rar. Modifică doar dacă studioul se mută.',
        },
      },
      fields: [
        {
          name: 'mapsUrl',
          type: 'text',
          required: true,
          label: { en: 'Google Maps link', ro: 'Link Google Maps' },
          admin: {
            description: {
              en: 'In Google Maps: Share > Copy link. This is what the "Open in Maps" button uses.',
              ro: 'În Google Maps: Distribuie > Copiază linkul. Este linkul folosit de butonul „Deschide în Maps”.',
            },
          },
        },
        {
          name: 'mapsEmbedUrl',
          type: 'textarea',
          localized: true,
          label: { en: 'Embedded map (iframe URL)', ro: 'Hartă încorporată (URL iframe)' },
          admin: {
            description: {
              en: 'In Google Maps: Share > Embed a map > copy only the src="..." address. Keep the hl parameter matching the language.',
              ro: 'În Google Maps: Distribuie > Încorporează o hartă > copiază doar adresa din src="...". Păstrează parametrul hl potrivit limbii.',
            },
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'geoLat',
              type: 'number',
              label: { en: 'Latitude', ro: 'Latitudine' },
              admin: {
                width: '50%',
                placeholder: '44.9364',
                description: {
                  en: 'Sent to search engines. E.g. 44.9364',
                  ro: 'Trimisă motoarelor de căutare. Ex. 44.9364',
                },
              },
            },
            {
              name: 'geoLng',
              type: 'number',
              label: { en: 'Longitude', ro: 'Longitudine' },
              admin: {
                width: '50%',
                placeholder: '26.0325',
                description: {
                  en: 'Sent to search engines. E.g. 26.0325',
                  ro: 'Trimisă motoarelor de căutare. Ex. 26.0325',
                },
              },
            },
          ],
        },
      ],
    },
    {
      name: 'primary',
      type: 'checkbox',
      defaultValue: false,
      label: { en: 'Primary location', ro: 'Locație principală' },
      admin: {
        position: 'sidebar',
        description: {
          en: 'The primary location is the one search engines treat as the business address. Exactly one location should be ticked.',
          ro: 'Locația principală este cea pe care motoarele de căutare o consideră adresa firmei. Exact o locație trebuie bifată.',
        },
      },
    },
  ],
}
