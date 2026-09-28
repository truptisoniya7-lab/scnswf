import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * ScrollToTop
 *
 * Ensures that whenever navigating to a different page/route, the window
 * automatically scrolls to the very top (0, 0) immediately.
 *
 * For same-page anchor links (e.g. #programs, #contact, #slug), it preserves
 * normal smooth scrolling to that anchor section instead of forcing the page to the top.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()
  const prevPathnameRef = useRef<string | null>(null)

  useEffect(() => {
    // If the path hasn't changed (e.g. same-page anchor navigation or hash change)
    if (prevPathnameRef.current === pathname) {
      if (hash) {
        const id = hash.replace('#', '')
        const element = document.getElementById(id)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }
      return
    }

    // Path changed to a different page/route
    prevPathnameRef.current = pathname

    // If navigating to a different page with an anchor hash
    if (hash) {
      const id = hash.replace('#', '')
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
        return
      }

      // If the target element is lazy-loaded and not in DOM yet, scroll to top first
      // then attempt to scroll to anchor once element mounts
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      const timer = setTimeout(() => {
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)

      return () => clearTimeout(timer)
    }

    // Standard navigation between separate pages/routes: immediately reset window to top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    })
  }, [pathname, hash])

  return null
}
