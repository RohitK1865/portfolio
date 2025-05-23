"use client"

import { useState, useEffect } from "react"

export function useScrollSpy(sectionIds: string[], options: { offset?: number } = {}) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const { offset = 0 } = options

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: `${-offset}px 0px 0px 0px`,
        threshold: 0.2,
      },
    )

    sectionIds.forEach((id) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      sectionIds.forEach((id) => {
        const element = document.getElementById(id)
        if (element) {
          observer.unobserve(element)
        }
      })
    }
  }, [sectionIds, offset])

  return activeId
}
