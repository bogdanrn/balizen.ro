import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import icon from 'astro-icon';
import compress from 'astro-compress';
import type { AstroIntegration } from 'astro';

import astrowind from './vendor/integration';

import { readingTimeRemarkPlugin, responsiveTablesRehypePlugin, lazyImagesRehypePlugin } from './src/utils/frontmatter';

import cookieconsent from '@jop-software/astro-cookieconsent';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const hasExternalScripts = false;
const whenExternalScripts = (items: (() => AstroIntegration) | (() => AstroIntegration)[] = []) =>
  hasExternalScripts ? (Array.isArray(items) ? items.map((item) => item()) : [items()]) : [];

export default defineConfig({
  output: 'static',
  trailingSlash: 'ignore',
  i18n: {
    defaultLocale: 'ro',
    locales: ['ro', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap(),
    mdx(),
    icon({
      include: {
        tabler: ['*'],
        'flat-color-icons': [
          'template',
          'gallery',
          'approval',
          'document',
          'advertising',
          'currency-exchange',
          'voice-presentation',
          'business-contact',
          'database',
        ],
      },
    }),
    ...whenExternalScripts(() =>
      partytown({
        config: {
          forward: ['dataLayer.push', 'gtag'],
          resolveUrl: (url) => {
            // Handle Google Tag Manager URLs to avoid CORS issues
            if (url.hostname.includes('googletagmanager.com')) {
              const proxyUrl = new URL(url);
              // Remove the debug part from the URL to avoid CORS issues
              if (proxyUrl.pathname.includes('/debug/')) {
                proxyUrl.pathname = proxyUrl.pathname.replace('/debug/', '/');
              }
              return proxyUrl;
            }
            return url;
          },
        },
      })
    ),
    compress({
      CSS: true,
      HTML: {
        'html-minifier-terser': {
          removeAttributeQuotes: false,
        },
      },
      Image: false,
      JavaScript: true,
      SVG: false,
      Logger: 1,
    }),
    cookieconsent({
      categories: {
        necessary: {
          enabled: true,
          readOnly: true,
        },
        analytics: {
          enabled: true,
          readOnly: false,
        },
      },

      language: {
        default: 'ro',
        autoDetect: 'document',
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
                  description: 'They help us understand how our site is used so we can improve it. Data is anonymous.',
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
    }),
    astrowind({
      config: './src/config.yaml',
    }),
  ],

  image: {
    domains: ['cdn.pixabay.com'],
  },

  markdown: {
    remarkPlugins: [readingTimeRemarkPlugin],
    rehypePlugins: [responsiveTablesRehypePlugin, lazyImagesRehypePlugin],
  },

  vite: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
  },
});
