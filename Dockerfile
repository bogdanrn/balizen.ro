# Next.js standalone build for the Coolify app on the chuckle-cloud VPS.
# Migrations are NOT run here: the postgres adapter applies `prodMigrations`
# when it connects with NODE_ENV=production (see src/payload.config.ts).

FROM node:24-slim AS base
ENV PNPM_HOME="/pnpm" \
    PATH="/pnpm:$PATH" \
    NEXT_TELEMETRY_DISABLED=1
RUN corepack enable
WORKDIR /app

# ---- dependencies -----------------------------------------------------------
FROM base AS deps
COPY package.json pnpm-lock.yaml .npmrc ./
# --ignore-workspace: this repo is standalone but sits under a directory that
# may contain a pnpm workspace on a dev machine; keep both installs identical.
RUN pnpm install --frozen-lockfile --ignore-workspace

# ---- build ------------------------------------------------------------------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# No database is reachable at build time and none is needed: every content page
# is dynamic, so nothing queries Payload during `next build`.
RUN pnpm build

# ---- runtime ----------------------------------------------------------------
FROM base AS runner
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

COPY --from=builder --chown=node:node /app/public ./public
# `server.js` plus the traced subset of node_modules (sharp and the AWS SDK
# included), ~85MB rather than the full install.
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node
EXPOSE 3000
CMD ["node", "server.js"]
