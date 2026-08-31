import path from 'path'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
// Re-exported by `payload` itself, so no direct @payloadcms/translations dep.
import { ro } from 'payload/i18n/ro'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { s3Storage } from '@payloadcms/storage-s3'
import { mcpPlugin } from '@payloadcms/plugin-mcp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { ServiceCategories } from './collections/ServiceCategories'
import { Services } from './collections/Services'
import { Reviews } from './collections/Reviews'
import { Faqs } from './collections/Faqs'
import { Subscriptions } from './collections/Subscriptions'
import { ExceptionalHours } from './collections/ExceptionalHours'
import { Locations } from './collections/Locations'
import { Announcement } from './globals/Announcement'
import { SiteConfig } from './globals/SiteConfig'
import { Homepage } from './globals/Homepage'
import { roAdminOverrides } from './admin-i18n'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const isProduction = process.env.NODE_ENV === 'production'

const createLog =
  (level: string, fn: typeof console.log) => (objOrMsg: object | string, msg?: string) => {
    if (typeof objOrMsg === 'string') {
      fn(JSON.stringify({ level, msg: objOrMsg }))
    } else {
      fn(JSON.stringify({ level, ...objOrMsg, msg: msg ?? (objOrMsg as { msg?: string }).msg }))
    }
  }

// One JSON object per line: `docker logs` / Coolify show them raw, and they
// stay greppable once shipped anywhere else.
const jsonLogger = {
  level: process.env.PAYLOAD_LOG_LEVEL || 'info',
  trace: createLog('trace', console.debug),
  debug: createLog('debug', console.debug),
  info: createLog('info', console.log),
  warn: createLog('warn', console.warn),
  error: createLog('error', console.error),
  fatal: createLog('fatal', console.error),
  silent: () => {},
} as any // Use PayloadLogger type when it's exported

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    avatar: 'default',
    meta: {
      // Payload already puts a space before the suffix; don't add a second one.
      titleSuffix: '— Bali Zen',
      description: 'Administrarea conținutului balizen.ro',
      // No OG image generation for a private admin panel.
      defaultOGImageType: 'off',
      // Without this Payload falls back to its own favicon
      // (@payloadcms/next `generateMetadata`), so the admin tab has to point at
      // the real icons in /public itself.
      icons: [
        { rel: 'icon', url: '/favicon.ico', sizes: 'any' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', url: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', url: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', url: '/apple-touch-icon.png' },
      ],
    },
    components: {
      graphics: {
        Icon: '/components-admin/BrandIcon#BrandIcon',
        Logo: '/components-admin/BrandLogo#BrandLogo',
      },
    },
  },
  // Sidebar groups render in the order their first member appears here
  // (collections first, then globals), so this order is the nav order:
  // Conținut · Program & locații · Sistem · Configurare.
  collections: [
    Services,
    ServiceCategories,
    Subscriptions,
    Reviews,
    Faqs,
    Media,
    Locations,
    ExceptionalHours,
    Users,
  ],
  globals: [Homepage, Announcement, SiteConfig],
  // Admin panel chrome (buttons, menus, validation messages) in Romanian.
  // Content locales are configured separately, under `localization`.
  //
  // Romanian is the ONLY supported language on purpose. Payload resolves the
  // admin language as cookie -> Accept-Language -> fallbackLanguage, so listing
  // `en` here would hand an English-configured browser an English panel, which
  // is exactly what the salon staff must never get. Add `en` back to
  // `supportedLanguages` if a language switcher is ever wanted.
  i18n: {
    supportedLanguages: { ro },
    fallbackLanguage: 'ro',
    translations: { ro: roAdminOverrides },
  },
  localization: {
    locales: [
      { code: 'ro', label: { en: 'Romanian', ro: 'Română' } },
      { code: 'en', label: { en: 'English', ro: 'Engleză' } },
    ],
    defaultLocale: 'ro',
    fallback: true,
  },
  graphQL: {
    disable: true,
  },
  editor: lexicalEditor(),
  // Available now that this runs on Node: fills in width/height/filesize on
  // upload and backs any future imageSizes/crop config.
  sharp,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI || '' },
    migrationDir: path.resolve(dirname, 'migrations'),
    // Migrations own the schema in every environment. With `push` left on,
    // dev would sync the schema behind their back and leave a dev marker row
    // in payload_migrations, which makes the next production boot stop at an
    // interactive prompt and hang the container.
    push: false,
    // Applied on connect when NODE_ENV=production, so a deploy migrates itself
    // and the runtime image needs no Payload CLI. Locally, run `pnpm migrate`.
    prodMigrations: migrations,
  }),
  logger: isProduction ? jsonLogger : undefined,
  plugins: [
    // R2 over its S3-compatible API (the app is a plain Node server now, so
    // there is no R2 binding to use). Files are served back through Payload's
    // own /api/media/file route on this domain, which the storage adapter
    // streams straight from the bucket by key, so the pre-sized webp variant
    // keys written by the seed script resolve too, even though they have no
    // media doc of their own. Long edge caching for that route is set in
    // next.config.ts.
    s3Storage({
      bucket: process.env.R2_BUCKET || 'balizen-media',
      config: {
        // R2 wants 'auto'; a local MinIO wants a real region name.
        region: process.env.R2_REGION || 'auto',
        endpoint:
          process.env.R2_ENDPOINT || `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
        },
        // R2's TLS cert does not cover bucket.account.r2.cloudflarestorage.com,
        // so keep the bucket in the path instead of the hostname.
        forcePathStyle: true,
      },
      collections: {
        media: true,
      },
    }),
    // Lets an editor point an MCP client (e.g. Claude Code) at this site's own
    // /api/mcp endpoint to manage content conversationally. Gated by a Payload
    // API key created in the admin (see README): the endpoint requires a valid
    // key on every request, and each key's own checkboxes (set when the key is
    // created) additionally gate which of the operations enabled below it can
    // actually use. `users` is never listed here on purpose: exposing it would
    // let an MCP caller read or edit admin accounts. `experimental.tools` is
    // left unset (all off) on purpose too: those tools can rewrite source files
    // and change auth, which is not acceptable on a production endpoint.
    mcpPlugin({
      collections: {
        services: {
          description: 'Massages clients can book. Each has a title, description, category, image, one or more Pricing Tiers (duration/price pairs), and a display order.',
          enabled: { find: true, create: true, update: true, delete: true },
        },
        'service-categories': {
          description: 'Named groupings of Services shown as sections of the catalog, e.g. "Masaje Full Body".',
          enabled: { find: true, create: true, update: true, delete: true },
        },
        subscriptions: {
          description: 'Prepaid bundles of sessions (abonamente) sold at a fixed price, shown as cards on the homepage.',
          enabled: { find: true, create: true, update: true, delete: true },
        },
        reviews: {
          description: 'Curated client testimonials (author, text, rating, date) shown on the site, newest first.',
          enabled: { find: true, create: true, update: true, delete: true },
        },
        faqs: {
          description: 'Per-locale question/answer pairs shown on the site and sent to search engines as FAQ structured data.',
          enabled: { find: true, create: true, update: true, delete: true },
        },
        locations: {
          description: 'Physical studios where clients receive services: address, schedule, phone, and map links. One is marked primary.',
          enabled: { find: true, create: true, update: true, delete: true },
        },
        'exceptional-hours': {
          description: 'Date-specific overrides to the regular opening hours, e.g. closed on a holiday.',
          enabled: { find: true, create: true, update: true, delete: true },
        },
        // Find only: uploads need real file handling (multipart data, R2
        // storage), which the plugin's generic create/update tools do not do.
        media: {
          description: 'Images already uploaded to the site (read only; new images must be uploaded through the admin panel).',
          enabled: { find: true },
        },
      },
      globals: {
        homepage: {
          description: 'Homepage section copy: hero, service highlights, subscriptions, locations, and reviews.',
          enabled: { find: true, update: true },
        },
        'site-config': {
          description: "The business's contact facts and site-wide chrome: phone, WhatsApp, email, opening hours, booking URL, header/footer links, announcement banner.",
          enabled: { find: true, update: true },
        },
      },
    }),
  ],
})
