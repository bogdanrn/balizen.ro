'use client'

import { useState } from 'react'

import { getTranslations, type Lang } from '@/i18n'
import type { Announcement } from '@/payload-types'

import Icon from './Icon'

type Props = {
  lang: Lang
  announcement: Announcement
}

// Dismissible top-of-site announcement bar driven by the Announcement global.
// Client component only because of the local dismissed state.
export default function AnnouncementBanner({ lang, announcement }: Props) {
  const t = getTranslations(lang)
  const [dismissed, setDismissed] = useState(false)

  if (dismissed || !announcement.enabled || !announcement.text) return null

  const text = announcement.text
  const link = announcement.link

  return (
    <div className="relative bg-ink px-4 py-2 text-center text-sm text-cream">
      <span>
        {link ? (
          <a href={link} className="underline underline-offset-2 hover:text-accent">
            {text}
          </a>
        ) : (
          text
        )}
      </span>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label={t.announcement.dismiss}
        className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-cream/70 transition hover:bg-white/10 hover:text-cream"
      >
        <Icon name="x" className="h-4 w-4" />
      </button>
    </div>
  )
}
