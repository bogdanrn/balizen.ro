// Three independent overlays can lock body scroll (the mobile nav drawer, the
// booking consent modal, the service detail modal). Each toggling
// `overflow-hidden` directly meant whichever closed last unlocked the page even
// if another was still open. Locks are tracked per owner instead, and the class
// is only removed once nothing holds it.
const owners = new Set<string>()

export function setScrollLock(owner: string, locked: boolean): void {
  if (typeof document === 'undefined') return

  if (locked) owners.add(owner)
  else owners.delete(owner)

  document.body.classList.toggle('overflow-hidden', owners.size > 0)
}

export function releaseScrollLock(owner: string): void {
  setScrollLock(owner, false)
}
