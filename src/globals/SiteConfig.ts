import type { GlobalConfig } from 'payload'

// The business's contact facts and site-wide chrome: header nav, footer link
// columns, social links, and the Announcement Banner (CONTEXT.md). Locations
// live in their own collection; the footer reads from it.
export const SiteConfig: GlobalConfig = {
  slug: 'site-config',
  admin: {
    description: { en: 'Contact details, header/footer links, announcement banner.', ro: 'Date de contact, linkuri header/footer, banner de anunțuri.' },
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
          fields: [
            { name: 'name', type: 'text', required: true },
            { name: 'tagline', type: 'text', required: true, localized: true },
            { name: 'legalName', type: 'text', required: true },
            { name: 'description', type: 'textarea', required: true, localized: true },
            { name: 'copyright', type: 'text', required: true, localized: true, admin: { description: { en: 'Use {year} for the current year.', ro: 'Folosește {year} pentru anul curent.' } } },
          ],
        },
        {
          label: { en: 'Contact', ro: 'Contact' },
          fields: [
            { name: 'phone', type: 'text', required: true, admin: { description: { en: 'Display format, e.g. +40 733 211 325', ro: 'Format afișat, ex. +40 733 211 325' } } },
            { name: 'phoneHref', type: 'text', required: true, admin: { description: { en: 'tel: link, e.g. tel:+40733211325', ro: 'Link tel:, ex. tel:+40733211325' } } },
            { name: 'whatsappUrl', type: 'text', required: true, admin: { description: { en: 'E.g. https://wa.me/40733211325', ro: 'Ex. https://wa.me/40733211325' } } },
            { name: 'email', type: 'email', required: true },
            { name: 'bookingUrl', type: 'text', required: true, admin: { description: { en: 'External booking app, e.g. https://programari.balizen.ro', ro: 'Aplicația externă de programări, ex. https://programari.balizen.ro' } } },
            { name: 'googleReviewsUrl', type: 'text', required: true },
          ],
        },
        {
          label: { en: 'Header', ro: 'Header' },
          fields: [
            {
              name: 'headerLinks',
              type: 'array',
              fields: [
                { name: 'label', type: 'text', required: true, localized: true },
                { name: 'href', type: 'text', required: true, admin: { description: { en: 'Anchor like /#servicii or full URL.', ro: 'Ancoră gen /#servicii sau URL complet.' } } },
                { name: 'className', type: 'text', admin: { description: { en: 'Optional CSS/JS hook classes (e.g. js-location-button).', ro: 'Clase CSS/JS opționale (ex. js-location-button).' } } },
              ],
            },
            {
              name: 'primaryAction',
              type: 'group',
              fields: [
                { name: 'label', type: 'text', required: true, localized: true },
                { name: 'href', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          label: { en: 'Footer', ro: 'Footer' },
          fields: [
            {
              name: 'footerColumns',
              type: 'array',
              fields: [
                { name: 'title', type: 'text', required: true, localized: true },
                {
                  name: 'links',
                  type: 'array',
                  fields: [
                    { name: 'text', type: 'text', required: true, localized: true },
                    { name: 'href', type: 'text', required: true },
                    { name: 'className', type: 'text' },
                  ],
                },
              ],
            },
            {
              name: 'socialLinks',
              type: 'array',
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'icon', type: 'text', required: true, admin: { description: { en: 'Tabler icon name, e.g. brand-instagram', ro: 'Nume iconiță Tabler, ex. brand-instagram' } } },
                { name: 'href', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          label: { en: 'Announcement Banner', ro: 'Banner Anunțuri' },
          fields: [
            {
              name: 'announcementEnabled',
              type: 'checkbox',
              defaultValue: false,
              admin: { description: { en: 'Show a dismissible banner at the top of the site.', ro: 'Afișează un banner dismissible în partea de sus a site-ului.' } },
            },
            { name: 'announcementText', type: 'text', localized: true, admin: { condition: (_, data) => Boolean(data?.announcementEnabled) } },
            { name: 'announcementLink', type: 'text', admin: { condition: (_, data) => Boolean(data?.announcementEnabled), description: { en: 'Optional URL the banner links to.', ro: 'URL opțional pe care duce bannerul.' } } },
          ],
        },
      ],
    },
  ],
}
