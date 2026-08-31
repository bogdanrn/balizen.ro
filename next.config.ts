import { withPayload } from '@payloadcms/next/withPayload'

import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Self-hosted: the Docker image runs `.next/standalone/server.js`, so the
  // build has to trace its own runtime deps instead of relying on node_modules
  // being present in the container.
  output: 'standalone',

  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
  },

  // Packages that break webpack's static bundling and are fine to require at
  // runtime instead: `drizzle-kit` (createRequire in the postgres adapter's
  // migration path), `pg-cloudflare` (an optional native-ish dep of `pg`),
  // and the MCP transport pair (`mcp-handler` + the MCP SDK), which reach for
  // Node's http/net at module load and monkey-patch global Request/Response.
  serverExternalPackages: ['drizzle-kit', 'pg-cloudflare', 'mcp-handler', '@modelcontextprotocol/sdk'],

  async headers() {
    return [
      {
        // Uploaded images stream out of R2 through Payload's file route, which
        // sets only an ETag. Filenames are immutable (Payload suffixes on
        // collision), so let Cloudflare hold them at the edge for a week and
        // browsers for an hour. Purge the zone cache if a file is ever
        // deleted and re-uploaded under the exact same name.
        source: '/api/media/file/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=604800, stale-while-revalidate=86400',
          },
        ],
      },
    ]
  },

  webpack: (webpackConfig: any) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
