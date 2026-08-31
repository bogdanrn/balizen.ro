# Self-host on the chuckle-cloud VPS instead of Cloudflare Workers

Before the site ever went live, we moved the same Next.js + Payload app off Cloudflare Workers (OpenNext) and onto the existing chuckle-cloud VPS: a Coolify application built from a Dockerfile, content in the shared Postgres, uploads still in the R2 bucket `balizen-media` but reached over its S3 API. This supersedes the deployment half of [0001](0001-payload-cms-on-cloudflare-workers.md); the CMS choice itself (Payload over Astro + a hand-built admin) still stands.

**Status**: accepted (2026-08-31)

**Why the move**:

- The Workers path cost a running tax in workarounds: OpenNext's build step, `getPlatformProxy` juggling for the CLI and seed scripts, `serverExternalPackages` entries for packages that only break under workerd, and no sharp at runtime.
- The MCP endpoint could not ship. `@payloadcms/plugin-mcp`'s Streamable HTTP transport never resolves a response on workerd, so `/api/mcp` had to be disabled in production, which meant an advertised feature only worked on a laptop.
- Media was stuck: the `balizen.ro` zone lives on a different Cloudflare account than the R2 bucket, so `cdn.balizen.ro` could not attach to it. Serving through the app's own domain solves that and needs no cross-account change.
- The VPS already runs Coolify, a shared Postgres with scheduled backups, and the log/SQL tooling the rest of the projects use. One more app there is close to free operationally; the Workers deploy was a second, different operating model.

**Considered options**:

- _Stay on Workers, keep MCP local-only_: rejected, see above.
- _Workers + Postgres over Hyperdrive_: keeps the workerd constraints (no sharp, MCP still broken) while adding a component.
- _SQLite file on a VPS volume_: simplest, but the VPS already has a backed-up Postgres and the migration story from D1's sqlite dialect was not enough of a win to justify a second backup path.
- _Local disk for media_: rejected, images should survive a container rebuild without a restore step. R2 already holds them.

**Consequences**:

- Database is Postgres. The D1/sqlite migrations were deleted and regenerated as one Postgres initial migration; there is no D1 Time Travel, backups are the VPS ones (databasus + `vps-sql.sh --dump`).
- Migrations apply themselves on boot via the adapter's `prodMigrations`, so the runtime image carries no Payload CLI and a bad migration fails the deploy rather than half-applying.
- Uploads go through `@payloadcms/storage-s3` against the R2 S3 endpoint (path-style: R2's TLS cert does not cover `bucket.account.r2.cloudflarestorage.com`). Files, including the pre-sized webp variant keys, are served from `/api/media/file/<key>` on this domain, cached at the Cloudflare edge for a week via `Cache-Control` in `next.config.ts`.
- sharp is available again: Payload records real image dimensions on upload, and enabling crop or generated sizes is now a config change in `src/collections/Media.ts`.
- `/api/mcp` is enabled in production, gated by the same Payload API keys as before.
- Deploys are a git push to the Coolify app instead of a local `pnpm deploy`, which also ends the `CLOUDFLARE_ACCOUNT_ID` footgun from 0001.
- The R2 bucket is now the one Cloudflare dependency left in the runtime path, plus the zone's DNS and edge cache in front of the VPS.
