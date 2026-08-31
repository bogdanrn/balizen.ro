# balizen.ro

Bali Zen marketing site + CMS. Next.js 16 + Payload CMS 3, self-hosted on the chuckle-cloud VPS (Coolify + Docker), content in Postgres, images in the Cloudflare R2 bucket `balizen-media` over its S3 API.

- Romanian (default, unprefixed URLs) + English (`/en`).
- Admin: `/admin` (Payload). Staff log in with email + password.
- Content edits are live in seconds (pages render per request).

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Local dev against the local Postgres and the real R2 bucket |
| `pnpm build` | Production build (`next build --webpack`; do not remove `--webpack`, Turbopack breaks on drizzle-kit) |
| `pnpm migrate` | Apply pending migrations to whatever `DATABASE_URI` points at |
| `pnpm migrate:create <name>` | New migration after changing collections/globals |
| `pnpm seed:images` | Migrate `_legacy/` images to R2 + media docs |
| `pnpm seed:content` | Import `_legacy/` JSON content into Postgres |
| `pnpm seed:verify` | Sanity-check counts and media URLs |

Copy `env.example` to a local dotenv file and fill it in. Production values live in Coolify, not in the repo. First-time local setup:

```sh
~/.chuckle-cloud/scripts/local-db.sh create balizen_dev
pnpm migrate
```

Seed scripts talk to whatever the loaded env points at, so running them with production values writes to production. There is no `--remote` flag any more.

Drizzle's `push` is off in every environment: migrations own the schema. After changing a collection or global, run `pnpm migrate:create <name>` and `pnpm migrate` before the change works locally.

## Deploy

Coolify application on the chuckle-cloud VPS, built from the `Dockerfile` in this repo (Next standalone output, ~85MB of traced runtime deps). A push to the deploy branch triggers a build.

Migrations need no separate step: the Postgres adapter is configured with `prodMigrations`, so every container applies pending migrations when it connects with `NODE_ENV=production`. A failed migration fails the boot, which is the intended behavior.

Environment variables set in Coolify: `DATABASE_URI`, `PAYLOAD_SECRET`, `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`. See `env.example`.

Logs: `~/.chuckle-cloud/scripts/vps-logs.sh balizen` (Payload logs one JSON object per line in production).

## Images

Uploads go to R2 through the S3 API and are served back from this domain at `/api/media/file/<filename>`, which streams the object straight out of the bucket. Cloudflare caches that path at the edge for a week (`Cache-Control` is set in `next.config.ts`), so there is no separate CDN hostname to attach, and no cross-account custom-domain problem.

The pre-sized webp variants written by `pnpm seed:images` are plain bucket objects with no media doc; they resolve through the same route because the storage adapter keys files by filename alone.

If a file is ever deleted and re-uploaded under the exact same name, purge that path in the Cloudflare cache.

## MCP (talk to the CMS from Claude Code)

The `/api/mcp` endpoint lets an MCP client manage content conversationally: services, categories, subscriptions, reviews, FAQs, locations, exceptional hours, and the Homepage/Site settings globals. Images are read only over MCP (uploads still go through the admin panel), and admin accounts (`users`) are never exposed this way.

It runs in production as well as locally. It was disabled in production while the site ran on Cloudflare Workers, where the plugin's Streamable HTTP transport never resolved a response; on a Node server that limitation is gone.

**Create a key** in `/admin` under **MCP** > **API Keys** > **Create New**: pick the Payload user the key acts as, tick the collections/globals/operations it may use, tick **Enable API Key**, save, and copy the generated key immediately (it is shown once).

**Connect Claude Code** with an MCP server entry (this plugin version takes a plain bearer token, not Payload's usual `<collection> API-Key <key>` header):

```json
{ "type": "http", "url": "https://balizen.ro/api/mcp", "headers": { "Authorization": "Bearer <key>" } }
```

**Smoke test** with curl:

```sh
curl -s https://balizen.ro/api/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -H 'Authorization: Bearer <key>' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

A request with no `Authorization` header (or a wrong key) gets an unauthorized error before any tool runs.

## Backups

The database lives in the shared `postgres-main` container on the VPS and is covered by the scheduled backups that run there (databasus). For a one-off copy, e.g. before a risky migration:

```sh
~/.chuckle-cloud/scripts/vps-sql.sh --dump -d balizen > balizen.dump
```

Restore it into a local database to test a fix before touching production; see the `vps-prod-debug` skill for the full flow. R2 objects are not backed up: they are re-creatable from `_legacy/` via `pnpm seed:images` until that directory is deleted.

## Notes

- `drizzle-kit` is a runtime dependency on purpose: `payload migrate:create` and the Postgres adapter's migration path both need it resolvable.
- sharp runs on this host, so Payload fills in image dimensions on upload. Cropping and generated sizes are still off in `src/collections/Media.ts`; staff upload web-sized images (max ~1600px wide, under ~500KB).
- No email adapter: password-reset links are written to the container logs.
- The Astro site this replaced lives in `_legacy/` until cutover completes, then gets deleted. Git tag/history keeps it after that.
