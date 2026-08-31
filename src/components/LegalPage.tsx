import ReactMarkdown from 'react-markdown'

import { getTranslations, type Lang } from '@/i18n'

import SectionEyebrow from './SectionEyebrow'

type Props = {
  lang: Lang
  doc: { title: string; description: string; body: string }
}

// Port of the legacy MarkdownLayout: centered prose card, now white on the
// cream page with a hairline ring instead of a shadow.
export default function LegalPage({ lang, doc }: Props) {
  const t = getTranslations(lang)

  return (
    <section className="bg-cream py-16 lg:py-24">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white px-6 py-12 ring-1 ring-ink/10 sm:px-12">
        <header className="mb-10 border-b border-ink/10 pb-8">
          <SectionEyebrow>{t.legalDocument}</SectionEyebrow>
          <h1 className="mt-4 font-heading text-4xl font-semibold leading-[1.1] text-ink sm:text-5xl">{doc.title}</h1>
          {doc.description && <p className="mt-4 max-w-prose text-muted-warm">{doc.description}</p>}
        </header>
        <article className="prose prose-stone max-w-none text-muted-warm prose-headings:font-heading prose-headings:text-ink prose-strong:text-ink prose-a:text-ink prose-a:underline-offset-4">
          <ReactMarkdown>{doc.body}</ReactMarkdown>
        </article>
      </div>
    </section>
  )
}
