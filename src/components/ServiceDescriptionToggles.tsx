'use client'

import { useEffect } from 'react'

// Behavior-only component: show-more/less toggles for service descriptions.
// Verbatim port of the legacy ServicesSection.astro script: clone-measure
// decides whether each toggle shows, click toggles .is-expanded, resize
// re-measures via rAF. The markup contract (js-service-description /
// js-service-description-toggle + aria-controls) is rendered by
// ServicesSection.tsx.
export default function ServiceDescriptionToggles(): null {
  useEffect(() => {
    const measureHeight = (element: HTMLElement, expanded: boolean) => {
      const clone = element.cloneNode(true) as HTMLElement
      clone.removeAttribute('id')
      clone.classList.toggle('is-expanded', expanded)
      clone.style.position = 'absolute'
      clone.style.visibility = 'hidden'
      clone.style.pointerEvents = 'none'
      clone.style.height = 'auto'
      clone.style.maxHeight = 'none'
      clone.style.width = `${element.getBoundingClientRect().width}px`
      clone.style.left = '0'
      clone.style.top = '0'

      document.body.appendChild(clone)
      const height = clone.getBoundingClientRect().height
      clone.remove()

      return height
    }

    const refresh = () => {
      document.querySelectorAll<HTMLButtonElement>('.js-service-description-toggle').forEach((button) => {
        const targetId = button.getAttribute('aria-controls')
        if (!targetId) return
        const description = document.getElementById(targetId)
        if (!description) return

        const labelMore = button.dataset.labelMore || 'Show more'
        const labelLess = button.dataset.labelLess || 'Show less'

        const fullHeight = measureHeight(description, true)
        const clampedHeight = measureHeight(description, false)
        const needsToggle = fullHeight > clampedHeight + 1

        const isExpanded = description.classList.contains('is-expanded')
        const shouldShowToggle = needsToggle || isExpanded

        button.classList.toggle('hidden', !shouldShowToggle)
        button.setAttribute('aria-expanded', isExpanded ? 'true' : 'false')
        button.textContent = isExpanded ? labelLess : labelMore
      })
    }

    const onClick = (event: MouseEvent) => {
      const button = (event.target as Element).closest?.('.js-service-description-toggle') as HTMLButtonElement | null
      if (!button) return
      const targetId = button.getAttribute('aria-controls')
      if (!targetId) return
      const description = document.getElementById(targetId)
      if (!description) return

      const labelMore = button.dataset.labelMore || 'Show more'
      const labelLess = button.dataset.labelLess || 'Show less'

      const isExpanded = button.getAttribute('aria-expanded') === 'true'
      const nextExpanded = !isExpanded

      description.classList.toggle('is-expanded', nextExpanded)
      button.setAttribute('aria-expanded', nextExpanded ? 'true' : 'false')
      button.textContent = nextExpanded ? labelLess : labelMore

      refresh()
    }

    let resizeRaf = 0
    const onResize = () => {
      if (resizeRaf) cancelAnimationFrame(resizeRaf)
      resizeRaf = requestAnimationFrame(refresh)
    }

    document.addEventListener('click', onClick)
    window.addEventListener('resize', onResize)
    refresh()

    return () => {
      document.removeEventListener('click', onClick)
      window.removeEventListener('resize', onResize)
      if (resizeRaf) cancelAnimationFrame(resizeRaf)
    }
  }, [])

  return null
}
