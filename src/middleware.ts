import { NextRequest, NextResponse } from 'next/server'

// Locale routing: ro is default and unprefixed, en lives under /en.
// /ro/... is 308-redirected to its unprefixed twin to avoid duplicate URLs.
// The matcher excludes /admin, /api, /_next, and any path containing a dot
// (favicons, manifest, sitemap.xml, robots.txt, /images/*).
const LOCALES = ['ro', 'en'] as const
const DEFAULT_LOCALE = 'ro'

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const firstSegment = pathname.split('/')[1]

  if (firstSegment === DEFAULT_LOCALE) {
    const url = req.nextUrl.clone()
    url.pathname = pathname.replace(/^\/ro(?=\/|$)/, '') || '/'
    return NextResponse.redirect(url, 308)
  }

  if (LOCALES.includes(firstSegment as (typeof LOCALES)[number])) {
    return NextResponse.next()
  }

  const url = req.nextUrl.clone()
  url.pathname = `/${DEFAULT_LOCALE}${pathname === '/' ? '' : pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: ['/((?!admin|api|_next|.*\\..*).*)'],
}
