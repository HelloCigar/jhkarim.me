import { ReactElement } from 'react'
import { Data } from '@generated/data'
import { GlobeIcon, HomeIcon, ImageIcon, LayoutDashboardIcon, LogOutIcon, MenuIcon } from 'lucide-react'
import { Logo } from '~/components/logo'
import { usePage } from '@inertiajs/react'
import { useFlashToasts } from '~/hooks/use_flash'
import { Form, Link } from '@adonisjs/inertia/react'
import { Button } from '~/components/ui/button'
import { ThemeSwitcher } from '~/components/theme_switcher'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '~/components/ui/menu'
import { Tooltip, TooltipPopup, TooltipTrigger } from '~/components/ui/tooltip'
import { AnchoredToastProvider, ToastProvider } from '~/components/ui/toast'
import { BranchesBackground } from '~/components/branches_background'

/**
 * Shared by the icon links so they read as one row rather than five buttons.
 * The padding buys back the click target the text labels used to provide; the
 * matching negative margin keeps the icons spaced as if it were not there.
 */
const NAV_LINK = '-m-2 flex items-center p-2 transition-colors hover:color-base'

/**
 * An icon on its own says little, so every nav item carries both a tooltip for
 * pointers and an `aria-label` on the control itself for screen readers - the
 * tooltip alone would leave the link unnamed.
 */
function NavTip({
  label,
  children,
}: {
  label: string
  children: ReactElement<Record<string, unknown>>
}) {
  return (
    <Tooltip>
      <TooltipTrigger render={children} />
      <TooltipPopup side="bottom">{label}</TooltipPopup>
    </Tooltip>
  )
}

type LayoutProps = {
  children: ReactElement
  /**
   * Opt out of the branch canvas. Pages that paint their own full-bleed surface
   * (the globe) would hide it anyway, so there is no point animating it.
   */
  background?: boolean
}

export default function Layout({ children, background = true }: LayoutProps) {
  const { user } = usePage<Data.SharedProps>().props
  useFlashToasts()

  return (
    <div className="flex min-h-dvh flex-col">
      {/* First in tree order, so everything positioned below stacks over it. */}
      {background && <BranchesBackground />}

      {/* h-18 (4.5rem) is assumed by full-height pages such as the globe —
          keep it identical across breakpoints if you touch it.

          Translucent rather than `bg-base`: an opaque bar would slice the
          branches off in a hard line across the top of every page. The blur
          keeps content legible as it scrolls underneath. */}
      <header className="sticky top-0 z-nav bg-white/70 px-4 backdrop-blur-md sm:px-5 dark:bg-#111/70">
        <div className="container mx-auto flex h-18 items-center justify-between gap-3">
          <Logo className="h-7 w-auto sm:h-9" />

          <div className="flex items-center gap-1 sm:gap-5">
            {/* Phones only have room for the logo and two buttons, so the
                links move into the dropdown below. */}
            <nav className="hidden items-center gap-4 color-muted sm:flex">
              <NavTip label="Timeline">
                <Link route="home" aria-label="Timeline" className={NAV_LINK}>
                  <HomeIcon className="size-4.5" />
                </Link>
              </NavTip>
              <NavTip label="Globe">
                <Link route="blog.globe" aria-label="Globe" className={NAV_LINK}>
                  <GlobeIcon className="size-4.5" />
                </Link>
              </NavTip>
              <NavTip label="Photos">
                <Link route="uploads.index" aria-label="Photos" className={NAV_LINK}>
                  <ImageIcon className="size-4.5" />
                </Link>
              </NavTip>
              {user && (
                <>
                  <NavTip label="Admin">
                    <Link route="admin.index" aria-label="Admin" className={NAV_LINK}>
                      <LayoutDashboardIcon className="size-4.5" />
                    </Link>
                  </NavTip>
                  <Form route="session.destroy">
                    <NavTip label="Logout">
                      <button type="submit" aria-label="Logout" className={NAV_LINK}>
                        <LogOutIcon className="size-4.5" />
                      </button>
                    </NavTip>
                  </Form>
                </>
              )}
            </nav>

            <ThemeSwitcher />

            <div className="sm:hidden">
              <Menu>
                <MenuTrigger
                  render={<Button aria-label="Open menu" size="icon-sm" variant="ghost" />}
                >
                  <MenuIcon />
                </MenuTrigger>
                <MenuPopup align="end" className="min-w-40">
                  <MenuItem render={<Link route="home" />}>Timeline</MenuItem>
                  <MenuItem render={<Link route="blog.globe" />}>Globe</MenuItem>
                  <MenuItem render={<Link route="uploads.index" />}>Photos</MenuItem>
                  {user && (
                    <>
                      <MenuItem render={<Link route="admin.index" />}>Admin</MenuItem>
                      <Form route="session.destroy">
                        <MenuItem
                          render={<button type="submit" className="w-full text-left" />}
                        >
                          Logout
                        </MenuItem>
                      </Form>
                    </>
                  )}
                </MenuPopup>
              </Menu>
            </div>
          </div>
        </div>
      </header>
      <ToastProvider position="top-center">
        <AnchoredToastProvider>
          {/* `relative` lifts every page above the branch canvas in one place. */}
          <main className="relative flex-1">{children}</main>
        </AnchoredToastProvider>
      </ToastProvider>
    </div>
  )
}
