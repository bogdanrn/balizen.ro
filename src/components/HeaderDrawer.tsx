'use client'

import { useEffect } from 'react'

// Behavior-only component: wires the header mobile drawer rendered by
// SiteHeader (data-nav-toggle / data-nav-drawer). Port of the legacy
// Header.astro script: toggle, close on link click, close on resize >=1024px.
export default function HeaderDrawer(): null {
  useEffect(() => {
    const toggle = document.querySelector<HTMLButtonElement>('[data-nav-toggle]')
    const drawer = document.querySelector<HTMLElement>('[data-nav-drawer]')
    if (!toggle || !drawer) return

    const hamburger = toggle.querySelector('[data-icon-hamburger]')
    const closeIcon = toggle.querySelector('[data-icon-close]')

    const setOpen = (open: boolean) => {
      drawer.classList.toggle('hidden', !open)
      toggle.setAttribute('aria-expanded', String(open))
      hamburger?.classList.toggle('hidden', open)
      closeIcon?.classList.toggle('hidden', !open)
      document.body.classList.toggle('overflow-hidden', open && window.innerWidth < 1024)
    }

    const onToggleClick = () => setOpen(drawer.classList.contains('hidden'))
    const onDrawerClick = (event: MouseEvent) => {
      if ((event.target as Element).closest('a')) setOpen(false)
    }
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false)
    }

    toggle.addEventListener('click', onToggleClick)
    drawer.addEventListener('click', onDrawerClick)
    window.addEventListener('resize', onResize)

    return () => {
      toggle.removeEventListener('click', onToggleClick)
      drawer.removeEventListener('click', onDrawerClick)
      window.removeEventListener('resize', onResize)
      document.body.classList.remove('overflow-hidden')
    }
  }, [])

  return null
}
