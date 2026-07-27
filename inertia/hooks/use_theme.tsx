import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { flushSync } from 'react-dom'

export type Theme = 'light' | 'dark'

/** Viewport coordinates the reveal circle grows from - usually the switcher itself. */
export type Origin = { x: number; y: number }

type ThemeContext = {
  theme: Theme
  setTheme: (theme: Theme, origin?: Origin) => void
  toggleTheme: (origin?: Origin) => void
}

const ThemeContext = createContext<ThemeContext | undefined>(undefined)

const REVEAL_DURATION = 550

function readStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'

  const stored = localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark') return stored

  // No explicit choice yet - dark is the default look.
  return 'dark'
}

function canAnimate() {
  return (
    typeof document.startViewTransition === 'function' &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/**
 * Dark grows in, light shrinks back out - so the dark snapshot is always the one
 * that moves, expanding out of `origin` on the way in and contracting into it on
 * the way out. Whichever snapshot is animating has to be the one on top, which
 * `app.css` keys off the `dark` class the swap has already applied.
 */
function circleFrom({ x, y }: Origin, next: Theme) {
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
  const closed = `circle(0px at ${x}px ${y}px)`
  const open = `circle(${radius}px at ${x}px ${y}px)`
  const expanding = next === 'dark'

  document.documentElement.animate(
    { clipPath: expanding ? [closed, open] : [open, closed] },
    {
      duration: REVEAL_DURATION,
      easing: 'cubic-bezier(0.65, 0, 0.35, 1)',
      // Expanding reveals the incoming theme; contracting wipes the outgoing one.
      pseudoElement: expanding ? '::view-transition-new(root)' : '::view-transition-old(root)',
    }
  )
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readStoredTheme)

  const setTheme = useCallback((next: Theme, origin?: Origin) => {
    localStorage.setItem('theme', next)

    if (!origin || !canAnimate()) {
      setThemeState(next)
      return
    }

    // The class flip has to land inside the callback so the view transition
    // snapshots the new theme - the effect below would run a tick too late.
    const paint = () => {
      document.documentElement.classList.toggle('dark', next === 'dark')
      flushSync(() => setThemeState(next))
    }

    document.startViewTransition(paint).ready.then(
      () => circleFrom(origin, next),
      () => {}
    )
  }, [])

  const toggleTheme = useCallback(
    (origin?: Origin) => setTheme(theme === 'dark' ? 'light' : 'dark', origin),
    [theme, setTheme]
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme])

  return <ThemeContext value={value}>{children}</ThemeContext>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
