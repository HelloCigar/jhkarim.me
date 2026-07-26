import { ReactElement } from 'react'
import { Data } from '@generated/data'
import { MenuIcon } from 'lucide-react'
import { Logo } from '~/components/logo'
import { usePage } from '@inertiajs/react'
import { useFlashToasts } from '~/hooks/use_flash'
import { Form, Link } from '@adonisjs/inertia/react'
import { Button } from '~/components/ui/button'
import { ThemeSwitcher } from '~/components/theme_switcher'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '~/components/ui/menu'
import { AnchoredToastProvider, ToastProvider } from '~/components/ui/toast'

export default function Layout({ children }: { children: ReactElement }) {
  const { user } = usePage<Data.SharedProps>().props
  useFlashToasts()

  return (
    <div className="flex min-h-dvh flex-col">
      {/* h-18 (4.5rem) is assumed by full-height pages such as the globe —
          keep it identical across breakpoints if you touch it. */}
      <header className="sticky top-0 z-nav bg-base px-4 sm:px-5">
        <div className="container mx-auto flex h-18 items-center justify-between gap-3">
          <Logo className="h-7 w-auto sm:h-9" />

          <div className="flex items-center gap-1 sm:gap-5">
            {/* Phones only have room for the logo and two buttons, so the
                links move into the dropdown below. */}
            <nav className="hidden items-center gap-5 color-muted sm:flex">
              <Link route="home" className="hover:color-base transition-colors">
                Timeline
              </Link>
              <Link route="blog.globe" className="hover:color-base transition-colors">
                Globe
              </Link>
              <Link route="uploads.index" className="hover:color-base transition-colors">
                Photos
              </Link>
              {user && (
                <>
                  <Link route="admin.index" className="hover:color-base transition-colors">
                    Admin
                  </Link>
                  <Form route="session.destroy">
                    <button type="submit" className="hover:color-base transition-colors">
                      Logout
                    </button>
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
          <main className="flex-1">{children}</main>
        </AnchoredToastProvider>
      </ToastProvider>
    </div>
  )
}
