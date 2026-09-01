import { NextRequest, NextResponse } from 'next/server'

// Locale routing: ro is default and unprefixed, en lives under /en.
// /ro/... is 308-redirected to its unprefixed twin to avoid duplicate URLs.
// No rewrites: unprefixed URLs are real static routes in the (ro) route group,
// so 404s never pass through a rewrite (a notFound() fired on a rewritten
// request redirects back to the original URL, which 404s again, a loop).
// The locale is stamped as a request header so the global 404 page
// (src/app/not-found.tsx) can render in the right language: during SSR of a
// 404, usePathname reports the internal /_not-found route, not the URL.
// The matcher excludes /admin, /api, /_next, and any path containing a dot
// (favicons, manifest, sitemap.xml, robots.txt, /images/*).
const DEFAULT_LOCALE = 'ro'
const LOCALE_HEADER = 'x-balizen-locale'

// Hosts that reach this app but are not the canonical origin: the hostname the
// site was deployed on before the balizen.ro cutover, and www. Both 308 to the
// apex so bookmarks, old links and any stale index entry land on one URL.
// An explicit set, not "anything that is not balizen.ro", so the container
// healthcheck (Host: localhost) and any future preview domain still resolve.
const CANONICAL_ORIGIN = 'https://balizen.ro'
const REDIRECT_HOSTS = new Set(['balizen.chuckle-cloud.com', 'www.balizen.ro'])

export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl

  const host = req.headers.get('host')
  if (host && REDIRECT_HOSTS.has(host)) {
    return NextResponse.redirect(`${CANONICAL_ORIGIN}${pathname}${search}`, 308)
  }

  const firstSegment = pathname.split('/')[1]

  if (firstSegment === DEFAULT_LOCALE) {
    const url = req.nextUrl.clone()
    url.pathname = pathname.replace(/^\/ro(?=\/|$)/, '') || '/'
    return NextResponse.redirect(url, 308)
  }

  const lang = firstSegment === 'en' ? 'en' : DEFAULT_LOCALE
  const headers = new Headers(req.headers)
  headers.set(LOCALE_HEADER, lang)
  return NextResponse.next({ request: { headers } })
}

export const config = {
  matcher: ['/((?!admin|api|_next|.*\\..*).*)'],
}
