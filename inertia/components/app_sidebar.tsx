import * as React from 'react'
import { Data } from '@generated/data'
import { usePage } from '@inertiajs/react'
import { GlobeIcon, LayoutDashboard, NewspaperIcon, PenLineIcon } from 'lucide-react'
import { Link, Form } from '@adonisjs/inertia/react'
import { Logo } from '~/components/logo'
import { ThemeSwitcher } from '~/components/theme_switcher'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '~/components/ui/sidebar'
import { Menu, MenuTrigger, MenuItem, MenuPopup } from '~/components/ui/menu'
import { urlFor } from '~/client'

const navItems = [
  {
    title: 'Dashboard',
    href: urlFor('admin.index'),
    icon: LayoutDashboard,
  },
  {
    title: 'Articles',
    href: urlFor('articles.index'),
    icon: PenLineIcon,
  },
  {
    title: 'View blog',
    href: urlFor('home'),
    icon: NewspaperIcon,
  },
  {
    title: 'View globe',
    href: urlFor('blog.globe'),
    icon: GlobeIcon,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = usePage<Data.SharedProps>().props
  const { url } = usePage()

  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader className="px-4 py-5 h-15 leading-7">
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  render={<Link href={item.href} />}
                  isActive={url.split('?')[0] === item.href}
                >
                  <item.icon />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator className="mx-0" />
      <SidebarFooter>
        <div className="flex items-center gap-1">
          <Menu>
            <MenuTrigger
              render={
                <button className="inline-flex min-w-0 flex-1 items-center gap-2 rounded-lg px-3 py-2 text-sm color-muted hover:color-base hover:bg-hover transition-colors cursor-pointer" />
              }
            >
              {user && (
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-500 text-white text-xs font-medium">
                  {user.initials}
                </span>
              )}
              <span className="truncate">{user?.fullName ?? 'Account'}</span>
            </MenuTrigger>
            <MenuPopup>
              <MenuItem>
                <Form route="session.destroy">
                  <button className="" type="submit">
                    Logout
                  </button>
                </Form>
              </MenuItem>
            </MenuPopup>
          </Menu>
          <ThemeSwitcher />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
