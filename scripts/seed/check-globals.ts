import { getSeedPayload, isRemote } from './lib/context'

// Diagnostic: compare ro vs en array row counts on both globals.
async function main() {
  const payload = await getSeedPayload()
  for (const slug of ['homepage', 'site-config'] as const) {
    const ro = await payload.findGlobal({ slug, locale: 'ro' })
    const en = await payload.findGlobal({ slug, locale: 'en' })
    const count = (obj: Record<string, unknown>) =>
      Object.fromEntries(
        Object.entries(obj)
          .filter(([, v]) => Array.isArray(v))
          .map(([k, v]) => [k, (v as unknown[]).length]),
      )
    console.log(`${slug} ro:`, JSON.stringify(count(ro as unknown as Record<string, unknown>)))
    console.log(`${slug} en:`, JSON.stringify(count(en as unknown as Record<string, unknown>)))
  }
  console.log('remote =', isRemote)
  process.exit(0)
}

main()
