import 'dotenv/config'
import path from 'path'

// Shared context for seed scripts. They talk to whatever DATABASE_URI and R2
// credentials the loaded dotenv file points at, so targeting production means
// running them with the production env, not a flag.
if (!process.env.PAYLOAD_SECRET) process.env.PAYLOAD_SECRET = 'ignore'

export const LEGACY_DIR = path.resolve(process.cwd(), '_legacy')
export const OUT_DIR = path.resolve(process.cwd(), 'scripts/seed/out')

export async function getSeedPayload() {
  const { getPayload } = await import('payload')
  const config = (await import('../../../src/payload.config')).default
  return getPayload({ config })
}

// Raw bucket access, for the pre-sized webp variants: they are plain objects in
// R2 with no media doc of their own, so they cannot go through Payload.
export async function getBucketClient() {
  const { S3Client } = await import('@aws-sdk/client-s3')
  const client = new S3Client({
    region: process.env.R2_REGION || 'auto',
    endpoint:
      process.env.R2_ENDPOINT || `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
    forcePathStyle: true,
  })
  return { client, bucket: process.env.R2_BUCKET || 'balizen-media' }
}

export function log(...args: unknown[]) {
  console.log('[seed]', ...args)
}
