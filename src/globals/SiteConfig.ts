import type { GlobalConfig } from 'payload'

import { SETTINGS_GROUP } from '../collections/shared/groups'

// The business's contact facts and site-wide chrome: header nav, footer link
// columns, and social links. The announcement strip has its own global, and
// locations live in their own collection; the footer reads from it.
export const SiteConfig: GlobalConfig = {
  slug: 'site-config',
  label: { en: 'Site settings', ro: 'Setări site' },
  admin: {
    group: SETTINGS_GROUP,
    description: {
      en: 'Contact details and the links in the header and footer. These appear on every page.',
      ro: 'Datele de contact și linkurile din header și footer. Apar pe fiecare pagină.',
    },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: { en: 'Brand', ro: 'Brand' },
          description: {
            en: 'How the business names and describes itself across the site and in search results.',
            ro: 'Cum se numește și se descrie afacerea pe site și în rezultatele căutării.',
          },
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              label: { en: 'Business name', ro: 'Numele afacerii' },
              admin: {
                description: {
                  en: 'Short name shown to visitors, e.g. Bali Zen. Not translated.',
                  ro: 'Numele scurt afișat vizitatorilor, ex. Bali Zen. Nu se traduce.',
                },
              },
            },
            {
              name: 'tagline',
              type: 'text',
              required: true,
              localized: true,
              label: { en: 'Tagline', ro: 'Slogan' },
            },
            {
              name: 'legalName',
              type: 'text',
              required: true,
              label: { en: 'Legal name', ro: 'Denumire legală' },
              admin: {
                description: {
                  en: 'The registered company name, used in legal pages and in the data sent to search engines.',
                  ro: 'Denumirea firmei din acte, folosită în paginile legale și în datele trimise motoarelor de căutare.',
                },
              },
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
              localized: true,
              label: { en: 'Description', ro: 'Descriere' },
              admin: {
                description: {
                  en: 'One or two sentences. Used as the page description in Google results and when the site is shared on social media.',
                  ro: 'Una-două propoziții. Apare ca descriere în rezultatele Google și când site-ul este distribuit pe rețelele sociale.',
                },
              },
            },
            {
              name: 'copyright',
              type: 'text',
              required: true,
              localized: true,
              label: { en: 'Copyright line', ro: 'Linia de copyright' },
              admin: {
                description: {
                  en: 'Bottom line of the footer. Write {year} where the current year should go.',
                  ro: 'Ultimul rând din footer. Scrie {year} acolo unde trebuie să apară anul curent.',
                },
              },
            },
          ],
        },
        {
          label: { en: 'Contact', ro: 'Contact' },
          description: {
            en: 'Used by the header, footer, and contact buttons across the site.',
            ro: 'Folosite de header, footer și de butoanele de contact din tot site-ul.',
          },
          fields: [
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
              required: true,
              label: { en: 'Email', ro: 'Email' },
            },
            {
              name: 'whatsappUrl',
              type: 'text',
              required: true,
              label: { en: 'WhatsApp link', ro: 'Link WhatsApp' },
              admin: {
                placeholder: 'https://wa.me/40733211325',
                description: {
                  en: 'E.g. https://wa.me/40733211325 — the number with no plus sign and no spaces.',
                  ro: 'Ex. https://wa.me/40733211325 — numărul fără plus și fără spații.',
                },
              },
            },
            {
              name: 'bookingUrl',
              type: 'text',
              required: true,
              label: { en: 'Booking app link', ro: 'Link aplicație programări' },
              admin: {
                placeholder: 'https://programari.balizen.ro',
                description: {
                  en: 'Where every "Book" button sends the visitor. Bookings are never taken on this site.',
                  ro: 'Unde duce fiecare buton „Programare”. Programările nu se fac niciodată pe acest site.',
                },
              },
            },
            {
              name: 'googleReviewsUrl',
              type: 'text',
              required: true,
              label: { en: 'Google reviews link', ro: 'Link recenzii Google' },
              admin: {
                description: {
                  en: 'The Google page where clients can leave a review.',
                  ro: 'Pagina Google unde clienții pot lăsa o recenzie.',
                },
              },
            },
          ],
        },
        {
          label: { en: 'Header', ro: 'Header' },
          description: {
            en: 'The menu at the top of every page.',
            ro: 'Meniul din partea de sus a fiecărei pagini.',
          },
          fields: [
            {
              name: 'headerLinks',
              type: 'array',
              label: { en: 'Menu links', ro: 'Linkuri din meniu' },
              labels: {
                singular: { en: 'Link', ro: 'Link' },
                plural: { en: 'Links', ro: 'Linkuri' },
              },
              admin: {
                description: {
                  en: 'Drag the rows to change the order they appear in the menu.',
                  ro: 'Trage rândurile pentru a schimba ordinea din meniu.',
                },
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      required: true,
                      localized: true,
                      label: { en: 'Text', ro: 'Text' },
                      admin: { width: '50%' },
                    },
                    {
                      name: 'href',
                      type: 'text',
                      required: true,
                      label: { en: 'Link', ro: 'Link' },
                      admin: {
                        width: '50%',
                        description: {
                          en: 'Anchor like /#servicii or a full address.',
                          ro: 'Ancoră gen /#servicii sau o adresă completă.',
                        },
                      },
                    },
                  ],
                },
                {
                  name: 'className',
                  type: 'text',
                  label: { en: 'Behaviour class', ro: 'Clasă de comportament' },
                  admin: {
                    description: {
                      en: 'Behaviour hooks only — just js-* classes (e.g. js-location-button) are honoured; any styling classes are ignored.',
                      ro: 'Doar clase de comportament — sunt folosite exclusiv clasele js-* (ex. js-location-button); clasele de stil sunt ignorate.',
                    },
                  },
                },
              ],
            },
            {
              name: 'primaryAction',
              type: 'group',
              label: { en: 'Booking button', ro: 'Butonul de programare' },
              admin: {
                description: {
                  en: 'The highlighted button on the right of the menu.',
                  ro: 'Butonul evidențiat din dreapta meniului.',
                },
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      required: true,
                      localized: true,
                      label: { en: 'Button text', ro: 'Text buton' },
                      admin: { width: '50%' },
                    },
                    {
                      name: 'href',
                      type: 'text',
                      required: true,
                      label: { en: 'Link', ro: 'Link' },
                      admin: { width: '50%' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: { en: 'Footer', ro: 'Footer' },
          description: {
            en: 'The link columns at the bottom of every page. Addresses and opening hours come from the Locations collection.',
            ro: 'Coloanele de linkuri din josul fiecărei pagini. Adresele și programul vin din colecția Locații.',
          },
          fields: [
            {
              name: 'footerColumns',
              type: 'array',
              label: { en: 'Link columns', ro: 'Coloane de linkuri' },
              labels: {
                singular: { en: 'Column', ro: 'Coloană' },
                plural: { en: 'Columns', ro: 'Coloane' },
              },
              admin: {
                description: {
                  en: 'Drag the rows to change the order of the columns.',
                  ro: 'Trage rândurile pentru a schimba ordinea coloanelor.',
                },
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  localized: true,
                  label: { en: 'Column heading', ro: 'Titlul coloanei' },
                },
                {
                  name: 'links',
                  type: 'array',
                  label: { en: 'Links', ro: 'Linkuri' },
                  labels: {
                    singular: { en: 'Link', ro: 'Link' },
                    plural: { en: 'Links', ro: 'Linkuri' },
                  },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'text',
                          type: 'text',
                          required: true,
                          localized: true,
                          label: { en: 'Text', ro: 'Text' },
                          admin: { width: '50%' },
                        },
                        {
                          name: 'href',
                          type: 'text',
                          required: true,
                          label: { en: 'Link', ro: 'Link' },
                          admin: { width: '50%' },
                        },
                      ],
                    },
                    {
                      name: 'className',
                      type: 'text',
                      label: { en: 'Behaviour class', ro: 'Clasă de comportament' },
                      admin: {
                        description: {
                          en: 'Behaviour hooks only — just js-* classes are honoured; any styling classes are ignored.',
                          ro: 'Doar clase de comportament — sunt folosite exclusiv clasele js-*; clasele de stil sunt ignorate.',
                        },
                      },
                    },
                  ],
                },
              ],
            },
            {
              name: 'socialLinks',
              type: 'array',
              label: { en: 'Social links', ro: 'Linkuri sociale' },
              labels: {
                singular: { en: 'Social link', ro: 'Link social' },
                plural: { en: 'Social links', ro: 'Linkuri sociale' },
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      required: true,
                      label: { en: 'Network', ro: 'Rețea' },
                      admin: { width: '33%', placeholder: 'Instagram' },
                    },
                    {
                      name: 'href',
                      type: 'text',
                      required: true,
                      label: { en: 'Link', ro: 'Link' },
                      admin: { width: '34%' },
                    },
                    {
                      name: 'icon',
                      type: 'text',
                      required: true,
                      label: { en: 'Icon', ro: 'Iconiță' },
                      admin: {
                        width: '33%',
                        placeholder: 'brand-instagram',
                        description: {
                          en: 'Tabler icon name, e.g. brand-instagram. Browse the names at tabler.io/icons.',
                          ro: 'Nume de iconiță Tabler, ex. brand-instagram. Numele se caută pe tabler.io/icons.',
                        },
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
