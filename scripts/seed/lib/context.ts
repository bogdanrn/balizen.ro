import path from 'path'

// Shared context for seed scripts. `--remote` targets the real D1/R2 via
// wrangler remote bindings (payload.config.ts honors CF_REMOTE=1).
export const isRemote = process.argv.includes('--remote')
if (isRemote) process.env.CF_REMOTE = '1'
if (!process.env.PAYLOAD_SECRET) process.env.PAYLOAD_SECRET = 'ignore'

export const LEGACY_DIR = path.resolve(process.cwd(), '_legacy')
export const OUT_DIR = path.resolve(process.cwd(), 'scripts/seed/out')

export async function getSeedPayload() {
  const { getPayload } = await import('payload')
  const config = (await import('../../../src/payload.config')).default
  return getPayload({ config })
}

export async function getCloudflareEnv() {
  const { getPlatformProxy } = await import('wrangler')
  const proxy = await getPlatformProxy({
    environment: process.env.CLOUDFLARE_ENV,
    remoteBindings: isRemote,
  })
  return proxy.env as unknown as { R2: R2Bucket }
}

export function log(...args: unknown[]) {
  console.log(`[seed${isRemote ? ' REMOTE' : ''}]`, ...args)
}
