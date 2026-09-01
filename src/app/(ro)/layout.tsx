import SiteShell from '@/components/layout/SiteShell'

// Romanian is the default locale and lives at unprefixed URLs. This tree only
// matches exact static routes, so anything else (typos, deep paths) matches no
// route at all and is served by app/global-not-found.tsx. force-dynamic keeps
// CMS edits visible within seconds.
export const dynamic = 'force-dynamic'

export default function RoLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell lang="ro">{children}</SiteShell>
}
