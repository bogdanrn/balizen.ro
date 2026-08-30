import ReactMarkdown from 'react-markdown'

import { getTranslations, type Lang } from '@/i18n'

type Props = {
  lang: Lang
  doc: { title: string; description: string; body: string }
}

// Port of the legacy MarkdownLayout: centered prose card on slate background.
export default function LegalPage({ lang, doc }: Props) {
  const t = getTranslations(lang)

  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white px-6 py-12 shadow-sm sm:px-12">
        <header className="mb-10 border-b border-slate-100 pb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">{t.legalDocument}</p>
          <h1 className="mt-3 font-heading text-4xl font-bold text-slate-900">{doc.title}</h1>
          {doc.description && <p className="mt-3 text-slate-600">{doc.description}</p>}
        </header>
        <article className="prose prose-slate max-w-none prose-headings:font-heading prose-a:text-primary">
          <ReactMarkdown>{doc.body}</ReactMarkdown>
        </article>
      </div>
    </section>
  )
}
