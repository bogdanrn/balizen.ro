import { getSeedPayload } from './lib/context'
async function main() {
  const payload = await getSeedPayload()
  const ro = await payload.findGlobal({ slug: 'homepage', locale: 'ro' })
  const en = await payload.findGlobal({ slug: 'homepage', locale: 'en' })
  console.log('ro heroSubtitle[0]:', (ro.heroSubtitle?.[0] as any)?.line)
  console.log('en heroSubtitle[0]:', (en.heroSubtitle?.[0] as any)?.line)
  console.log('ro heroActions[0].label:', (ro.heroActions?.[0] as any)?.label)
  console.log('en heroActions[0].label:', (en.heroActions?.[0] as any)?.label)
  const scRo = await payload.findGlobal({ slug: 'site-config', locale: 'ro' })
  const scEn = await payload.findGlobal({ slug: 'site-config', locale: 'en' })
  console.log('ro headerLink[0]:', (scRo.headerLinks?.[0] as any)?.label, '| en:', (scEn.headerLinks?.[0] as any)?.label)
  console.log('ro tagline:', scRo.tagline, '| en:', scEn.tagline)
  process.exit(0)
}
main()
