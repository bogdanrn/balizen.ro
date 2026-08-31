import React from 'react'

// Small mark shown in the admin sidebar / nav header.
// Bali Zen palette: #FFAF73 peach on #33291F ink.
export const BrandIcon: React.FC = () => (
  <svg
    className="graphic-icon"
    viewBox="0 0 40 40"
    width="26"
    height="26"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Bali Zen"
  >
    <rect width="40" height="40" rx="11" fill="#33291F" />
    {/* Leaf */}
    <path
      d="M20 9c6 4.6 9 9 9 13.2A9 9 0 0 1 11 22.2C11 18 14 13.6 20 9Z"
      fill="#FFAF73"
    />
    {/* Midrib */}
    <path
      d="M20 12.5v18"
      stroke="#33291F"
      strokeWidth="1.6"
      strokeLinecap="round"
      opacity="0.85"
    />
  </svg>
)

export default BrandIcon
