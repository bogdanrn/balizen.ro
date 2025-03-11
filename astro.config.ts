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

const hasExternalScripts = true;
const whenExternalScripts = (items: (() => AstroIntegration) | (() => AstroIntegration)[] = []) =>
  hasExternalScripts ? (Array.isArray(items) ? items.map((item) => item()) : [items()]) : [];

export default defineConfig({
  output: 'static',

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
        config: { forward: ['dataLayer.push', 'gtag'] },
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
