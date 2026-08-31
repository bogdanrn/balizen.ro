import React from 'react'

// Wordmark shown on the admin login screen. The brand mark already contains
// the "bali zen" wordmark, so only the panel subtitle is added below it.
// Colours follow Payload's theme variables so the subtitle reads correctly in
// both the light and dark admin themes.
export const BrandLogo: React.FC = () => (
  <div
    className="graphic-logo"
    style={{
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    }}
  >
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src="/android-chrome-192x192.png"
      alt="Bali Zen"
      width={96}
      height={96}
      style={{ display: 'block', height: 96, width: 96 }}
    />
    <div
      style={{
        color: 'var(--theme-elevation-600)',
        fontSize: '0.8125rem',
        letterSpacing: '0.06em',
        textAlign: 'center',
        textTransform: 'uppercase',
      }}
    >
      Administrare
    </div>
  </div>
)

export default BrandLogo
