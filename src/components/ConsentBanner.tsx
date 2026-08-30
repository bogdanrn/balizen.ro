'use client'

import { useEffect } from 'react'

import type { Lang } from '@/i18n'

// vanilla-cookieconsent banner. Config ported 1:1 from the legacy
// astro.config.ts (@jop-software/astro-cookieconsent). Knowing the locale at
// render time removes the legacy window.CC.setLanguage retry hack.
export default function ConsentBanner({ lang }: { lang: Lang }): null {
  useEffect(() => {
    let mounted = true

    async function init() {
      const [ccModule] = await Promise.all([
        import('vanilla-cookieconsent'),
        import('vanilla-cookieconsent/dist/cookieconsent.css' as any),
      ])
      if (!mounted) return

      const CookieConsent = ('default' in ccModule ? ccModule.default : ccModule) as typeof ccModule
      CookieConsent.run({
        categories: {
          necessary: { enabled: true, readOnly: true },
          analytics: { enabled: true, readOnly: false },
        },
        language: {
          default: lang,
          translations: {
            ro: {
              consentModal: {
                title: 'Această pagină folosește cookie-uri',
                description:
                  'Folosim cookie-uri pentru a îmbunătăți experiența dumneavoastră pe site și pentru a analiza traficul. Puteți alege ce tipuri de cookie-uri acceptați.',
                acceptAllBtn: 'Accept toate',
                acceptNecessaryBtn: 'Doar necesare',
                showPreferencesBtn: 'Personalizează',
              },
              preferencesModal: {
                title: 'Preferințe cookie-uri',
                acceptAllBtn: 'Accept toate',
                acceptNecessaryBtn: 'Doar necesare',
                savePreferencesBtn: 'Salvează preferințele',
                closeIconLabel: 'Închide',
                sections: [
                  {
                    title: 'Cookie-uri necesare',
                    description:
                      'Aceste cookie-uri sunt esențiale pentru funcționarea corectă a site-ului și nu pot fi dezactivate.',
                    linkedCategory: 'necessary',
                  },
                  {
                    title: 'Cookie-uri analitice',
                    description:
                      'Ne ajută să înțelegem cum este folosit site-ul nostru, pentru a-l putea îmbunătăți. Datele sunt anonime.',
                    linkedCategory: 'analytics',
                  },
                  {
                    title: 'Mai multe informații',
                    description:
                      'Pentru întrebări legate de politica noastră de cookie-uri și alegerile dumneavoastră, vă rugăm să ne contactați.',
                  },
                ],
              },
            },
            en: {
              consentModal: {
                title: 'This page uses cookies',
                description:
                  'We use cookies to improve your experience on the site and to analyze traffic. You can choose what types of cookies you accept.',
                acceptAllBtn: 'Accept all',
                acceptNecessaryBtn: 'Necessary only',
                showPreferencesBtn: 'Customize',
              },
              preferencesModal: {
                title: 'Cookie preferences',
                acceptAllBtn: 'Accept all',
                acceptNecessaryBtn: 'Necessary only',
                savePreferencesBtn: 'Save preferences',
                closeIconLabel: 'Close',
                sections: [
                  {
                    title: 'Necessary cookies',
                    description:
                      'These cookies are essential for the proper functioning of the site and cannot be disabled.',
                    linkedCategory: 'necessary',
                  },
                  {
                    title: 'Analytics cookies',
                    description:
                      'They help us understand how our site is used so we can improve it. Data is anonymous.',
                    linkedCategory: 'analytics',
                  },
                  {
                    title: 'More information',
                    description: 'For questions related to our cookie policy and your choices, please contact us.',
                  },
                ],
              },
            },
          },
        },
      })
    }

    init()
    return () => {
      mounted = false
    }
  }, [lang])

  return null
}
