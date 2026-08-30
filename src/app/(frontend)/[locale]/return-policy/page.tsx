import { notFound } from 'next/navigation'

import LegalPage from '@/components/LegalPage'
import type { Lang } from '@/i18n'

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (locale !== 'ro' && locale !== 'en') notFound()
  const doc = await import(`@/content/legal/${locale}/return-policy`)
  return <LegalPage lang={locale as Lang} doc={doc} />
}
