import 'dotenv/config'
import crypto from 'node:crypto'

// Bootstraps a local admin user and an API key, so `pnpm cms` (and MCP) can
// point at a dev server. Production keys are made in /admin under MCP > API
// Keys; this exists because a freshly seeded local database has no user to log
// in as, which makes that route circular.
//
// Local only, and enforced: it creates an account with a known password, which
// would be a backdoor anywhere else.
const EMAIL = process.env.CMS_DEV_EMAIL || 'dev@balizen.local'
const PASSWORD = process.env.CMS_DEV_PASSWORD || 'localdev'

async function main() {
  const uri = process.env.DATABASE_URI || ''
  if (!/@(localhost|127\.0\.0\.1)[:/]/.test(uri)) {
    console.error(`DATABASE_URI is not local (${uri.replace(/:[^:@]+@/, ':***@')}).`)
    console.error('This script only runs against a local database. Use /admin for real keys.')
    process.exit(1)
  }

  if (!process.env.PAYLOAD_SECRET) process.env.PAYLOAD_SECRET = 'ignore'
  const { getPayload } = await import('payload')
  const config = (await import('../src/payload.config')).default
  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: EMAIL } },
    limit: 1,
  })
  const user =
    existing.docs[0] ??
    (await payload.create({ collection: 'users', data: { email: EMAIL, password: PASSWORD } }))
  console.log(`user: ${EMAIL} / ${PASSWORD} (id ${user.id})`)

  // Every checkbox on the collection is a per-operation MCP permission; a dev
  // key gets all of them rather than a list here that rots as collections move.
  const fields = payload.collections['payload-mcp-api-keys']?.config.fields ?? []
  const permissions: Record<string, boolean> = {}
  for (const field of fields) {
    if (field.type === 'checkbox' && 'name' in field) permissions[field.name] = true
  }

  const apiKey = crypto.randomUUID()
  const key = await payload.create({
    collection: 'payload-mcp-api-keys',
    data: {
      ...permissions,
      user: user.id,
      label: 'local dev',
      description: 'Created by pnpm cms:key',
      enableAPIKey: true,
      apiKey,
    },
  })

  console.log(`key id ${key.id}\n`)
  console.log('Add to your dotenv file:\n')
  console.log(`CMS_URL=http://localhost:3000`)
  console.log(`CMS_API_KEY=${apiKey}`)

  // the postgres pool keeps the process alive; force-exit
  process.exit(0)
}

main()
