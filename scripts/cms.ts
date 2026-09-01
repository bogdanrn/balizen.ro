import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'

// Thin CLI over Payload's REST API, for content edits from the terminal.
//
// It is the counterpart to the MCP endpoint, not a replacement: MCP is for
// conversational edits, this is for scripts, one-offs, and the things MCP
// cannot do at all. Image upload is the main one, since the MCP plugin's
// generic create tool has no multipart handling (see `media` in the plugin
// config), so before this the only way to add an image was the admin panel.
//
// Everything is passed through verbatim: the target is a URL path segment, so
// `services`, `globals/site-config` and anything added later all work with no
// change here. Unrecognised flags become query params, which is how `where`,
// `select` and friends get their bracket notation across.

// Media docs are stored exactly as uploaded (no resizing, see the collection
// description), so an oversized file here is a slow page in production.
const MAX_KB = 500

// Payload validates the uploaded part's own content type against the
// collection's `mimeTypes`, and a Blob built from a buffer has none, so it has
// to be set from the extension. Keep in sync with src/collections/Media.ts.
const MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
}

const USAGE = `Usage: pnpm cms <get|create|update|delete> <target> [id] [flags]

  target      collection slug, or globals/<slug>

  --data '<json>'         document fields (create, update)
  --data:<locale> '<json>'  same, applied as a follow-up patch in that locale
  --file <path>           image to upload (create, update on media)
  --force                 upload a file over the ${MAX_KB}KB limit anyway
  --<anything> <value>    passed through as a query param, verbatim

Examples:
  pnpm cms get services --locale all --depth 1
  pnpm cms get services '--where[title][contains]' Thai   (quote brackets in zsh)
  pnpm cms create media --file ./hands.jpg --data '{"alt":"Masaj de maini"}'
  pnpm cms create services --data '{"title":"Ritual",...}' --data:en '{"title":"Ritual"}'
  pnpm cms update services 27 --data '{"pricing":[{"duration":45,"price":"160"}]}'
  pnpm cms update globals/site-config --data '{"phone":"+40..."}'

Env: CMS_URL, CMS_API_KEY, CMS_API_KEY_COLLECTION.
     \`pnpm prod:cms\` sets CMS_TARGET=prod, which reads CMS_PROD_URL and
     CMS_PROD_API_KEY instead, so the two environments cannot share a key.`

// Two sets of variables rather than one, so that pointing at production is
// something you type (`pnpm prod:cms`) and never something you inherit from a
// stale shell export.
// Neither has a default host: which domain is production changes at cutover,
// and a stale guess baked in here would silently talk to the wrong site.
const PROD = process.env.CMS_TARGET === 'prod'
const BASE = (PROD ? process.env.CMS_PROD_URL || '' : process.env.CMS_URL || '').replace(/\/+$/, '')
const KEY = PROD ? process.env.CMS_PROD_API_KEY : process.env.CMS_API_KEY
// Keys live in the MCP plugin's own auth collection; nothing else on this site
// has `useAPIKey` turned on.
const KEY_COLLECTION = process.env.CMS_API_KEY_COLLECTION || 'payload-mcp-api-keys'

function die(msg: string): never {
  console.error(msg)
  process.exit(1)
}

const BOOLEAN_FLAGS = new Set(['force', 'help'])

function parseArgs(argv: string[]) {
  const flags: Record<string, string> = {}
  const positional: string[] = []
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (!arg.startsWith('--')) {
      positional.push(arg)
      continue
    }
    const eq = arg.indexOf('=')
    if (eq > -1) {
      flags[arg.slice(2, eq)] = arg.slice(eq + 1)
      continue
    }
    const name = arg.slice(2)
    // Everything else takes a value, so a boolean flag has to be known by name:
    // guessing from "is the next token a flag?" makes `--force ./f.jpg` eat the
    // filename.
    if (BOOLEAN_FLAGS.has(name)) flags[name] = 'true'
    else flags[name] = argv[++i] ?? ''
  }
  return { flags, positional }
}

function parseJson(label: string, raw: string): Record<string, unknown> {
  try {
    return JSON.parse(raw)
  } catch (err) {
    die(`${label} is not valid JSON: ${(err as Error).message}`)
  }
}

async function request(method: string, url: string, body?: BodyInit, json = true) {
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `${KEY_COLLECTION} API-Key ${KEY}`,
      ...(json ? { 'Content-Type': 'application/json' } : {}),
    },
    body,
  })
  const text = await res.text()
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    parsed = text
  }
  if (!res.ok) {
    console.error(`${method} ${url} -> ${res.status}`)
    console.error(typeof parsed === 'string' ? parsed : JSON.stringify(parsed, null, 2))
    process.exit(1)
  }
  return parsed as Record<string, unknown>
}

async function main() {
  const { flags, positional } = parseArgs(process.argv.slice(2))
  const [verb, target, id] = positional

  if (!verb || verb === 'help' || flags.help) return console.log(USAGE)
  if (!target) die(USAGE)
  if (!BASE) die('CMS_URL is not set. Point it at a server, or use `pnpm prod:cms`.')
  if (!KEY) {
    die(
      PROD
        ? 'CMS_PROD_API_KEY is not set. Create a key in /admin under MCP > API Keys.'
        : 'CMS_API_KEY is not set. Run `pnpm cms:key` for a local one.',
    )
  }
  // Which environment a write landed in is the one thing worth never guessing.
  if (verb !== 'get') console.error(`[cms] ${verb} on ${BASE}${PROD ? ' (PRODUCTION)' : ''}`)

  const isGlobal = target.startsWith('globals/')
  // Locale patches are pulled out first so they never reach the query string.
  const localeData: [string, Record<string, unknown>][] = []
  const data = flags.data ? parseJson('--data', flags.data) : undefined
  const filePath = flags.file

  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(flags)) {
    if (key === 'data' || key === 'file' || key === 'force' || key === 'help') continue
    if (key.startsWith('data:')) {
      localeData.push([key.slice(5), parseJson(`--${key}`, value)])
      continue
    }
    query.append(key, value)
  }
  const qs = query.size > 0 ? `?${query}` : ''

  const collectionUrl = `${BASE}/api/${target}`
  const docUrl = id ? `${collectionUrl}/${id}` : collectionUrl

  let result: Record<string, unknown>

  if (verb === 'get') {
    result = await request('GET', `${docUrl}${qs}`)
  } else if (verb === 'delete') {
    if (!id) die('delete needs an id')
    result = await request('DELETE', `${docUrl}${qs}`)
  } else if (verb === 'create' || verb === 'update') {
    if (verb === 'update' && !id && !isGlobal) die('update needs an id')
    if (!data && !filePath) die(`${verb} needs --data or --file`)

    let body: BodyInit
    let json = true
    if (filePath) {
      const bytes = fs.statSync(filePath).size
      if (bytes > MAX_KB * 1024 && flags.force !== 'true') {
        die(
          `${filePath} is ${Math.round(bytes / 1024)}KB, over the ${MAX_KB}KB limit. ` +
            'Resize it (max 1600px wide) or pass --force.',
        )
      }
      const type = MIME[path.extname(filePath).toLowerCase()]
      if (!type) die(`${filePath} is not one of ${Object.keys(MIME).join(', ')}`)
      const form = new FormData()
      form.append('file', new Blob([fs.readFileSync(filePath)], { type }), path.basename(filePath))
      if (data) form.append('_payload', JSON.stringify(data))
      body = form
      json = false // fetch sets the multipart boundary itself
    } else {
      body = JSON.stringify(data)
    }

    // Globals have no id and are updated with POST, not PATCH.
    const method = verb === 'create' || isGlobal ? 'POST' : 'PATCH'
    const url = verb === 'create' ? `${collectionUrl}${qs}` : `${docUrl}${qs}`
    result = await request(method, url, body, json)
  } else {
    die(`Unknown command "${verb}".\n\n${USAGE}`)
  }

  // Localized fields are per-request in Payload, so a second locale is a second
  // call against the doc that was just written.
  const doc = (result.doc ?? result) as Record<string, unknown>
  for (const [locale, patch] of localeData) {
    const patchUrl = isGlobal ? collectionUrl : `${collectionUrl}/${doc.id ?? id}`
    result = await request(
      isGlobal ? 'POST' : 'PATCH',
      `${patchUrl}?locale=${encodeURIComponent(locale)}`,
      JSON.stringify(patch),
    )
  }

  console.log(JSON.stringify(result, null, 2))
}

main()
