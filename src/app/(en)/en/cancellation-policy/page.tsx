import LegalPage from '@/components/LegalPage'
import * as doc from '@/content/legal/en/cancellation-policy'

export default function Page() {
  return <LegalPage lang="en" doc={doc} />
}
