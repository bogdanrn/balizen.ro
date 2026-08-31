import React from 'react'

type PricingRow = { duration?: number | null; price?: null | string }

// List-view column for Services: a one-line digest of the Pricing Tiers, so
// staff can scan prices without opening each service.
// Backed by a `ui` field, so nothing is stored and nothing reaches the API.
export const PricingSummaryCell: React.FC<{ rowData?: Record<string, unknown> }> = ({ rowData }) => {
  const rows = Array.isArray(rowData?.pricing) ? (rowData.pricing as PricingRow[]) : []

  if (rows.length === 0) {
    return <span style={{ opacity: 0.5 }}>—</span>
  }

  const shown = rows
    .slice(0, 3)
    .map((row) => `${row?.duration ?? '?'} min – ${row?.price ?? '?'} lei`)
    .join(' · ')

  const rest = rows.length - 3

  return (
    <span style={{ whiteSpace: 'nowrap' }}>
      {shown}
      {rest > 0 ? <span style={{ opacity: 0.6 }}>{` · +${rest}`}</span> : null}
    </span>
  )
}

export default PricingSummaryCell
