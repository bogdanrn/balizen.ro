import { notFound } from 'next/navigation'

// Any unmatched path inside a valid locale renders the styled 404.
export default function CatchAll() {
  notFound()
}
