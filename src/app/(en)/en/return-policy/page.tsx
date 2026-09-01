import LegalPage from '@/components/LegalPage'
import * as doc from '@/content/legal/en/return-policy'

export default function Page() {
  return <LegalPage lang="en" doc={doc} />
}
