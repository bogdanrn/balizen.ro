import SiteShell from '@/components/layout/SiteShell'

// English lives under /en. This tree only matches exact static routes, so
// anything else under /en is served by app/global-not-found.tsx.
// force-dynamic keeps CMS edits visible within seconds.
export const dynamic = 'force-dynamic'

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell lang="en">{children}</SiteShell>
}
