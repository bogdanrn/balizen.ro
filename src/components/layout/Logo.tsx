import { getLocalizedPath, type Lang } from '@/i18n'

type Props = {
  lang: Lang
  name: string
  tagline: string
}

export default function Logo({ lang, name, tagline }: Props) {
  return (
    <a
      href={getLocalizedPath('/', lang)}
      className="focus-ring inline-flex items-center gap-3 rounded-lg"
      aria-label={lang === 'ro' ? 'Bali Zen acasă' : 'Bali Zen home'}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/balizen_logo_color.png"
        alt="Sigla Bali Zen"
        className="h-14 w-14 object-contain"
        loading="eager"
        decoding="async"
      />
      <div className="flex-col text-left leading-tight flex">
        <span className="font-heading text-xl font-semibold text-ink">{name}</span>
        <span className="hidden text-xs font-medium uppercase tracking-widest text-muted-warm custom-xl:inline">
          {tagline}
        </span>
      </div>
    </a>
  )
}
