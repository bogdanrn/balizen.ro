import fs from 'fs'
import path from 'path'
import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
// Re-exported by `payload` itself, so no direct @payloadcms/translations dep.
import { ro } from 'payload/i18n/ro'
import { fileURLToPath } from 'url'
import { CloudflareContext, getCloudflareContext } from '@opennextjs/cloudflare'
import { GetPlatformProxyOptions } from 'wrangler'
import { r2Storage } from '@payloadcms/storage-r2'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { ServiceCategories } from './collections/ServiceCategories'
import { Services } from './collections/Services'
import { Reviews } from './collections/Reviews'
import { Faqs } from './collections/Faqs'
import { Subscriptions } from './collections/Subscriptions'
import { ExceptionalHours } from './collections/ExceptionalHours'
import { Locations } from './collections/Locations'
import { SiteConfig } from './globals/SiteConfig'
import { Homepage } from './globals/Homepage'
import { roAdminOverrides } from './admin-i18n'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const realpath = (value: string) => (fs.existsSync(value) ? fs.realpathSync(value) : undefined)

const isCLI = process.argv.some((value) => {
  const resolved = realpath(value)
  return resolved ? resolved.endsWith(path.join('payload', 'bin.js')) : false
})
const isProduction = process.env.NODE_ENV === 'production'

const createLog =
  (level: string, fn: typeof console.log) => (objOrMsg: object | string, msg?: string) => {
    if (typeof objOrMsg === 'string') {
      fn(JSON.stringify({ level, msg: objOrMsg }))
    } else {
      fn(JSON.stringify({ level, ...objOrMsg, msg: msg ?? (objOrMsg as { msg?: string }).msg }))
    }
  }

const cloudflareLogger = {
  level: process.env.PAYLOAD_LOG_LEVEL || 'info',
  trace: createLog('trace', console.debug),
  debug: createLog('debug', console.debug),
  info: createLog('info', console.log),
  warn: createLog('warn', console.warn),
  error: createLog('error', console.error),
  fatal: createLog('fatal', console.error),
  silent: () => {},
} as any // Use PayloadLogger type when it's exported

const cloudflare =
  isCLI || !isProduction
    ? await getCloudflareContextFromWrangler()
    : await getCloudflareContext({ async: true })

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
  globals: [Homepage, SiteConfig],
  // Admin panel chrome (buttons, menus, validation messages) in Romanian.
  // Content locales are configured separately, under `localization`.
  //
  // Romanian is the ONLY supported language on purpose. Payload resolves the
  // admin language as cookie -> Accept-Language -> fallbackLanguage, so listing
  // `en` here would hand an English-configured browser an English panel — which
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
  secret: process.env.PAYLOAD_SECRET || (cloudflare.env as unknown as Record<string, unknown>).PAYLOAD_SECRET as string || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteD1Adapter({ binding: cloudflare.env.D1 }),
  logger: isProduction ? cloudflareLogger : undefined,
  plugins: [
    r2Storage({
      bucket: cloudflare.env.R2,
      collections: {
        media: {
          // Prod reads images from the public CDN hostname; locally (and in
          // seed scripts) fall back to Payload's file route so dev works
          // before the custom domain exists.
          ...(isProduction
            ? { generateFileURL: ({ filename }: { filename: string }) => `https://cdn.balizen.ro/${filename}` }
            : {}),
        },
      },
    }),
  ],
})

// Adapted from https://github.com/opennextjs/opennextjs-cloudflare/blob/d00b3a13e42e65aad76fba41774815726422cc39/packages/cloudflare/src/api/cloudflare-context.ts#L328C36-L328C46
function getCloudflareContextFromWrangler(): Promise<CloudflareContext> {
  return import(/* webpackIgnore: true */ `${'__wrangler'.replaceAll('_', '')}`).then(
    ({ getPlatformProxy }) =>
      getPlatformProxy({
        environment: process.env.CLOUDFLARE_ENV,
        // CF_REMOTE=1 forces remote bindings for one-off scripts (seeds) even
        // outside production: `CF_REMOTE=1 pnpm tsx scripts/seed/1-images.ts`
        remoteBindings: isProduction || process.env.CF_REMOTE === '1',
      } satisfies GetPlatformProxyOptions),
  )
}
