import fs from 'fs'
import path from 'path'
import { getSeedPayload, isRemote, log, OUT_DIR } from './lib/context'
import { repairSubscriptions, seedGlobals, setImageMap } from './lib/seed-globals'

// Reruns ONLY the globals seed + repairs subscription highlights in place.
// Safe to re-run: the ro pass replaces child rows and the en pass patches the
// same rows by id.
async function main() {
  setImageMap(JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'image-map.json'), 'utf8')))
  const payload = await getSeedPayload()
  await seedGlobals(payload, log)
  await repairSubscriptions(payload, log)
  log(`globals reseed complete. remote=${isRemote}`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
