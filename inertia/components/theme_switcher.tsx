import { MoonIcon, SunIcon } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { useTheme } from '~/hooks/use_theme'

/**
 * Light / dark toggle. Clicking it wipes the new theme in as a circle expanding
 * from the button, so the origin travels with wherever the switcher is mounted.
 */
export function ThemeSwitcher({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme()
  const Icon = theme === 'dark' ? MoonIcon : SunIcon

  return (
    <Button
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      className={className}
      size="icon-sm"
      variant="ghost"
      onClick={(event) => {
        const { left, top, width, height } = event.currentTarget.getBoundingClientRect()
        toggleTheme({ x: left + width / 2, y: top + height / 2 })
      }}
    >
      <Icon />
    </Button>
  )
}
