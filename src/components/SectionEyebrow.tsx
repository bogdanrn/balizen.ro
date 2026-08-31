import type { ReactNode } from 'react'

// Shared section eyebrow: small uppercase label with a 24px hairline rule.
// Used by every section heading for a consistent rhythm.
//
// The peach primary is never used as a text color (it fails contrast on cream);
// it survives only as the hairline rule. `tone` swaps the label color for bands
// where muted-warm would sink into the background — "cream" for the ink footer
// and gift-card band, "ink" for the peach CTA band.
type Tone = 'default' | 'ink' | 'cream'

const TONES: Record<Tone, { text: string; rule: string }> = {
  default: { text: 'text-muted-warm', rule: 'border-primary/60' },
  ink: { text: 'text-ink', rule: 'border-ink/40' },
  cream: { text: 'text-cream/70', rule: 'border-primary/70' },
}

export default function SectionEyebrow({ children, tone = 'default' }: { children: ReactNode; tone?: Tone }) {
  const { text, rule } = TONES[tone]

  return (
    <p className={`text-xs font-semibold uppercase tracking-widest ${text}`}>
      <span aria-hidden="true" className={`mr-3 inline-block w-6 border-t ${rule} align-middle`} />
      {children}
    </p>
  )
}
