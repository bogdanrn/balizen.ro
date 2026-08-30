import { Fragment } from 'react'

import type { Lang } from '@/i18n'

import { resolveLocalizedHref } from './LocalizedLink'

type Segment = { type: 'text'; value: string } | { type: 'link'; text: string; href: string }

// Ported verbatim from _legacy/src/components/common/Disclaimer.astro:
// inline [text](href) markdown links inside plain disclaimer lines.
function parseLine(line: string): Segment[] {
  const segments: Segment[] = []
  const re = /\[([^\]]+)\]\(([^)]+)\)/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(line)) !== null) {
    if (m.index > last) segments.push({ type: 'text', value: line.slice(last, m.index) })
    segments.push({ type: 'link', text: m[1], href: m[2] })
    last = re.lastIndex
  }
  if (last < line.length) segments.push({ type: 'text', value: line.slice(last) })
  return segments
}

type Props = {
  items: string[]
  lang: Lang
  className?: string
  linkClass?: string
}

export default function Disclaimer({ items, lang, className, linkClass }: Props) {
  if (!items || items.length === 0) return null

  return (
    <p className={className}>
      {items.map((line, i) => (
        <Fragment key={i}>
          {parseLine(line).map((seg, j) =>
            seg.type === 'text' ? (
              <span key={j}>{seg.value}</span>
            ) : (
              <a
                key={j}
                href={resolveLocalizedHref(seg.href, lang)}
                className={linkClass ?? 'underline underline-offset-2 hover:opacity-80'}
              >
                {seg.text}
              </a>
            ),
          )}
          {i < items.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </p>
  )
}
