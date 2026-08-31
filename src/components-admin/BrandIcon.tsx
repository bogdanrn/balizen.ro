import React from 'react'

// Small mark shown in the admin sidebar / nav header.
// Real brand mark, same file the browser tab uses (transparent PNG, 192px
// source rendered at 26px so it stays crisp on high-DPI screens).
export const BrandIcon: React.FC = () => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    className="graphic-icon"
    src="/android-chrome-192x192.png"
    alt="Bali Zen"
    width={26}
    height={26}
    style={{ display: 'block', height: 26, width: 26 }}
  />
)

export default BrandIcon
