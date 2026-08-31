import type { GlobalConfig } from 'payload'

import { SETTINGS_GROUP } from '../collections/shared/groups'

// The dismissible strip at the very top of every page (CONTEXT.md:
// Announcement Banner). It lives in its own global rather than inside Site
// settings so staff find it in the sidebar the moment they need it, which is
// usually the day before a closure.
export const Announcement: GlobalConfig = {
  slug: 'announcement',
  label: { en: 'Announcement', ro: 'Anunț' },
  admin: {
    group: SETTINGS_GROUP,
    description: {
      en: 'A strip at the very top of the site for temporary messages: holiday closures, promotions. Visitors can dismiss it.',
      ro: 'O bandă în capul site-ului pentru mesaje temporare: zile libere, promoții. Vizitatorii o pot închide.',
    },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: false,
      label: { en: 'Show the banner', ro: 'Afișează bannerul' },
      admin: {
        description: {
          en: 'Untick to hide the banner without deleting its text.',
          ro: 'Debifează pentru a ascunde bannerul fără a-i șterge textul.',
        },
      },
    },
    // Message and Link stay visible whether or not the banner is on: hiding
    // them behind the checkbox made staff think the fields did not exist.
    {
      name: 'text',
      type: 'text',
      localized: true,
      label: { en: 'Message', ro: 'Mesaj' },
      admin: {
        description: {
          en: 'Keep it to one short sentence. The banner stays hidden while this is empty.',
          ro: 'Păstrează-l la o singură propoziție scurtă. Bannerul rămâne ascuns cât timp câmpul e gol.',
        },
      },
    },
    {
      name: 'link',
      type: 'text',
      label: { en: 'Link', ro: 'Link' },
      admin: {
        description: {
          en: 'Optional. If filled in, the whole banner becomes clickable.',
          ro: 'Opțional. Dacă e completat, tot bannerul devine clicabil.',
        },
      },
    },
  ],
}
