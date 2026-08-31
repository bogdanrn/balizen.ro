import type { Location } from '@/payload-types'

type Coords = Pick<Location, 'geoLat' | 'geoLng'>

// Waze and Apple Maps do not accept a Google share link, so unlike mapsUrl
// (used verbatim) these build their own deep links: coordinates when the CMS
// has them, otherwise a free-text query as a fallback.

export function getWazeUrl(location: Coords & Pick<Location, 'address'>): string {
  const { geoLat, geoLng, address } = location
  if (geoLat != null && geoLng != null) {
    return `https://waze.com/ul?ll=${geoLat},${geoLng}&navigate=yes`
  }
  return `https://waze.com/ul?q=${encodeURIComponent(address)}`
}

export function getAppleMapsUrl(location: Coords & Pick<Location, 'name' | 'address'>): string {
  const { geoLat, geoLng, name, address } = location
  if (geoLat != null && geoLng != null) {
    return `https://maps.apple.com/?ll=${geoLat},${geoLng}&q=${encodeURIComponent(name)}`
  }
  return `https://maps.apple.com/?q=${encodeURIComponent(address)}`
}
