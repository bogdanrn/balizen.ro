import { ro } from 'payload/i18n/ro'

type RoTranslations = (typeof ro)['translations']

// Targeted patches to @payloadcms/translations' shipped Romanian pack (3.82.1).
// Payload deep-merges these over the built-in strings, so only the listed keys
// change. Typed against the real pack, so a key renamed upstream fails the
// build. Re-check after a Payload upgrade and drop entries that get fixed.
export const roAdminOverrides: {
  general: Partial<RoTranslations['general']>
  version: Partial<RoTranslations['version']>
} = {
  general: {
    // The Romanian pack translated the placeholder NAMES along with the text,
    // so these three strings render a literal `{{...}}` instead of a value.
    movingCount: 'Se mută {{count}} {{label}}',
    showAllLabel: 'Afișează toate {{label}}',
    sortByLabelDirection: 'Sortează după {{label}} {{direction}}',

    // "Locale" was translated as "Localitate" (a town) and "Locales" as
    // "Localuri" (pubs). This labels the language switcher — the control staff
    // use most in a bilingual admin.
    locale: 'Limbă',
    locales: 'Limbi',

    // Upstream is "Creați un nou {{label}}", which is masculine and reads
    // wrong for feminine entities ("un nou Întrebare frecventă"). "Adaugă" is
    // gender-neutral and fits every entity name we use.
    createNew: 'Adaugă',
    createNewLabel: 'Adaugă {{label}}',
  },
  version: {
    // Same broken-placeholder bug as above.
    noRowsSelected: 'Niciun {{label}} selectat',
  },
}
