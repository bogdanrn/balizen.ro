# balizen.ro

Bali Zen marketing site + CMS. Next.js 16 + Payload CMS 3 on Cloudflare Workers, content in D1, images in R2 served from `https://cdn.balizen.ro`.

- Romanian (default, unprefixed URLs) + English (`/en`).
- Admin: `/admin` (Payload). Staff log in with email + password.
- Content edits are live in seconds (pages render per request from D1).

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Local dev (Next dev, local D1/R2 via wrangler proxy) |
| `pnpm build` | Production build (`next build --webpack`; do not remove `--webpack`, Turbopack breaks on drizzle-kit) |
| `pnpm deploy` | Migrate prod D1, then build + deploy the worker |
| `pnpm preview` | Build + run in workerd locally (closest to prod) |
| `pnpm payload migrate:create <name>` | New migration after changing collections/globals |
| `pnpm seed:images [--remote]` | Migrate `_legacy/` images to R2 + media docs |
| `pnpm seed:content [--remote]` | Import `_legacy/` JSON content into D1 |
| `pnpm seed:verify [--remote]` | Sanity-check counts and media URLs |

Local secrets live in `.dev.vars` (gitignored). Prod secret: `wrangler secret put PAYLOAD_SECRET --name balizen`.

## Notes

- `drizzle-kit` is a devDependency on purpose: `payload migrate:create` and the worker bundling both need it resolvable.
- No server-side image resizing on Workers (no sharp at runtime): upload web-sized images (max ~1600px wide, under ~500KB).
- No email adapter: password-reset links are written to the worker logs (`wrangler tail balizen`).
- The Astro site this replaced lives in `_legacy/` until cutover completes, then gets deleted. Git tag/history keeps it after that.
