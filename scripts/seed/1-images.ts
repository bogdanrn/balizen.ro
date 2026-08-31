import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getBucketClient, getSeedPayload, LEGACY_DIR, log, OUT_DIR } from './lib/context'

// Migrates every image from the legacy Astro site into R2 + media docs.
// Generates 640/1280/1920w webp variants (sharp, dev-time only) and stores
// their keys on the media doc's `variants` field. Writes out/image-map.json
// keyed by original basename for 2-content.ts.
const IMAGE_DIRS = [path.join(LEGACY_DIR, 'src/assets/images'), path.join(LEGACY_DIR, 'public/images')]
const WIDTHS = [640, 1280, 1920]

type Variant = { key: string; width: number; height: number }

async function main() {
  const payload = await getSeedPayload()
  const { client, bucket } = await getBucketClient()

  const files = IMAGE_DIRS.flatMap((dir) =>
    fs
      .readdirSync(dir)
      .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
      .map((f) => path.join(dir, f)),
  )
  log(`found ${files.length} images`)

  const imageMap: Record<string, { id: string | number; filename: string; variants: Variant[] }> = {}

  for (const filePath of files) {
    const basename = path.basename(filePath)
    try {
      const doc = await payload.create({
        collection: 'media',
        data: { alt: basename.replace(/\.[a-z]+$/i, '').replace(/[_-]/g, ' ') },
        filePath,
      })

      const meta = await sharp(filePath).metadata()
      const variants: Variant[] = []
      if (meta.width && meta.height) {
        const stem = path.parse(String(doc.filename)).name
        for (const w of WIDTHS) {
          if (w >= meta.width) continue
          const key = `${stem}-${w}.webp`
          const buffer = await sharp(filePath).resize({ width: w }).webp({ quality: 82 }).toBuffer()
          await client.send(
            new PutObjectCommand({
              Bucket: bucket,
              Key: key,
              Body: buffer,
              ContentType: 'image/webp',
            }),
          )
          variants.push({ key, width: w, height: Math.round((meta.height * w) / meta.width) })
        }
      }

      if (variants.length > 0) {
        await payload.update({ collection: 'media', id: doc.id, data: { variants } })
      }

      imageMap[basename] = { id: doc.id, filename: String(doc.filename), variants }
      log(`${basename} -> ${doc.filename} (+${variants.length} variants)`)
    } catch (err) {
      console.error(`FAILED ${basename}:`, err)
      throw err
    }
  }

  fs.mkdirSync(OUT_DIR, { recursive: true })
  fs.writeFileSync(path.join(OUT_DIR, 'image-map.json'), JSON.stringify(imageMap, null, 2))
  log(`done. ${Object.keys(imageMap).length} media docs.`)

  // the postgres pool keeps the process alive; force-exit
  process.exit(0)
}

main()
