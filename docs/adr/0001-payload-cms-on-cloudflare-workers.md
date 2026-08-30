# Payload CMS on Cloudflare Workers replaces Astro SSG on GitHub Pages

The site's real need was a CMS: non-technical staff must edit all customer-facing content (services, prices, contact details, homepage copy, reviews, FAQ, announcement banner, exceptional hours) in Romanian and English without a developer or a redeploy. We decided to rebuild the site as a single Next.js + Payload CMS v3 app deployed to Cloudflare Workers, using Payload's official D1 adapter for content and R2 adapter for uploads, replacing the Astro static site hosted on GitHub Pages.

**Status**: accepted

**Considered Options**:

- _Astro SSR on Workers + hand-built admin_: keeps the existing templates, but auth, validation, uploads, and the per-locale editing UI all have to be built and maintained by us. Rejected because the CMS was the actual goal and Payload provides all of it for free.
- _Astro site + Payload as a second Workers app_: keeps templates but splits the system into two deploys sharing one D1 schema. Rejected as more operational complexity than a single app.
- _SonicJS (edge-native CMS for Workers)_: its localization support was plan-stage at decision time. Rejected on maturity.
- _Git-based CMS (Decap/Tina/Pages CMS) with rebuild-on-save_: conflicts with the chosen "save = live in seconds" model and makes staff edits depend on CI. Rejected.
- _Hosted CMS (Sanity/Strapi/Directus)_: adds an external service or a VPS to run it. Rejected because the point was consolidating ops on Cloudflare.

**Consequences**:

- Astro is dropped; all templates are ported to React. Sections and content carry over 1:1 initially, with visual polish allowed.
- Runtime image optimization (sharp) is unavailable on Workers: images are served from R2 as-is, and the ~130 existing images are migrated once by script. Editors must upload web-sized images.
- Facts previously computed at build time (the "New" badge window, aggregate review rating) become runtime-computed, which silently fixes them being frozen at build date.
- Deploys run only from a local machine via a `deploy` script; there is no CI pipeline.
- The D1 schema is owned by Payload migrations; hand-editing it will break upgrades.
