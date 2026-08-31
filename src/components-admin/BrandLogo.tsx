import React from 'react'

// Wordmark shown on the admin login screen. Colours follow Payload's theme
// variables so it reads correctly in both the light and dark admin themes.
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
    <svg
      viewBox="0 0 40 40"
      width="56"
      height="56"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Bali Zen"
    >
      <rect width="40" height="40" rx="11" fill="#33291F" />
      <path d="M20 9c6 4.6 9 9 9 13.2A9 9 0 0 1 11 22.2C11 18 14 13.6 20 9Z" fill="#FFAF73" />
      <path
        d="M20 12.5v18"
        stroke="#33291F"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.85"
      />
    </svg>
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          color: 'var(--theme-elevation-1000)',
          fontSize: '1.75rem',
          fontWeight: 600,
          letterSpacing: '0.14em',
          lineHeight: 1.1,
          textTransform: 'uppercase',
        }}
      >
        Bali Zen
      </div>
      <div
        style={{
          color: 'var(--theme-elevation-600)',
          fontSize: '0.8125rem',
          letterSpacing: '0.06em',
          marginTop: '0.35rem',
        }}
      >
        Administrare
      </div>
    </div>
  </div>
)

export default BrandLogo
