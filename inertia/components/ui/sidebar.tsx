'use client'

import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { cva, type VariantProps } from 'class-variance-authority'
import { PanelLeftIcon } from 'lucide-react'
import * as React from 'react'
import { useIsMobile } from '~/hooks/use_mobile'
import { cn } from '~/lib/utils'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { ScrollArea } from '~/components/ui/scroll-area'
import { Separator } from '~/components/ui/separator'
import { Sheet, SheetDescription, SheetHeader, SheetPopup, SheetTitle } from '~/components/ui/sheet'
import { Skeleton } from '~/components/ui/skeleton'
import { Tooltip, TooltipPopup, TooltipTrigger } from '~/components/ui/tooltip'

const SIDEBAR_COOKIE_NAME = 'sidebar_state'
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = '16rem'
const SIDEBAR_WIDTH_MOBILE = '18rem'
const SIDEBAR_WIDTH_ICON = '3rem'
const SIDEBAR_KEYBOARD_SHORTCUT = 'b'

type SidebarContextProps = {
  state: 'expanded' | 'collapsed'
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextProps | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.')
  }

  return context
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = React.useState(false)

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = React.useState(defaultOpen)
  const open = openProp ?? _open
  const setOpen = React.useCallback(
    async (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === 'function' ? value(open) : value
      if (setOpenProp) {
        setOpenProp(openState)
      } else {
        _setOpen(openState)
      }

      // This sets the cookie to keep the sidebar state.
      await cookieStore.set({
        expires: Date.now() + SIDEBAR_COOKIE_MAX_AGE * 1000,
        name: SIDEBAR_COOKIE_NAME,
        path: '/',
        value: String(openState),
      })
    },
    [setOpenProp, open]
  )

  // Helper to toggle the sidebar.
  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open)
  }, [isMobile, setOpen])

  // Adds a keyboard shortcut to toggle the sidebar.
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        toggleSidebar()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggleSidebar])

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  const state = open ? 'expanded' : 'collapsed'

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      isMobile,
      open,
      openMobile,
      setOpen,
      setOpenMobile,
      state,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, toggleSidebar]
  )

  return (
    <SidebarContext.Provider value={contextValue}>
      <div
        className={cn(
          'group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-secondary',
          className
        )}
        data-slot="sidebar-wrapper"
        style={
          {
            '--sidebar-width': SIDEBAR_WIDTH,
            '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
            ...style,
          } as React.CSSProperties
        }
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

function Sidebar({
  side = 'left',
  variant = 'sidebar',
  collapsible = 'offcanvas',
  className,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  side?: 'left' | 'right'
  variant?: 'sidebar' | 'floating' | 'inset'
  collapsible?: 'offcanvas' | 'icon' | 'none'
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

  if (collapsible === 'none') {
    return (
      <div
        className={cn(
          'flex h-full w-[var(--sidebar-width)] flex-col bg-secondary color-base',
          className
        )}
        data-slot="sidebar"
        {...props}
      >
        {children}
      </div>
    )
  }

  if (isMobile) {
    return (
      <Sheet onOpenChange={setOpenMobile} open={openMobile} {...props}>
        <SheetPopup
          className="w-[var(--sidebar-width)] bg-secondary p-0 color-base [&>button]:hidden"
          data-mobile="true"
          data-sidebar="sidebar"
          data-slot="sidebar"
          side={side}
          style={
            {
              '--sidebar-width': SIDEBAR_WIDTH_MOBILE,
            } as React.CSSProperties
          }
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetPopup>
      </Sheet>
    )
  }

  return (
    <div
      className="group peer hidden color-base md:block"
      data-collapsible={state === 'collapsed' ? collapsible : ''}
      data-side={side}
      data-slot="sidebar"
      data-state={state}
      data-variant={variant}
    >
      {/* This is what handles the sidebar gap on desktop */}
      <div
        className={cn(
          'relative w-[var(--sidebar-width)] bg-transparent transition-[width] duration-200 ease-linear',
          '[[data-collapsible=offcanvas]_&]:w-0',
          '[[data-side=right]_&]:rotate-180',
          variant === 'floating' || variant === 'inset'
            ? '[[data-collapsible=icon]_&]:w-[calc(var(--sidebar-width-icon)+1rem)]'
            : '[[data-collapsible=icon]_&]:w-[var(--sidebar-width-icon)]'
        )}
        data-slot="sidebar-gap"
      />
      <div
        className={cn(
          'fixed inset-y-0 z-nav hidden h-svh w-[var(--sidebar-width)] transition-[left,right,width] duration-200 ease-linear md:flex',
          side === 'left'
            ? 'left-0 [[data-collapsible=offcanvas]_&]:left-[calc(var(--sidebar-width)*-1)]'
            : 'right-0 [[data-collapsible=offcanvas]_&]:right-[calc(var(--sidebar-width)*-1)]',
          // Adjust the padding for floating and inset variants.
          variant === 'floating' || variant === 'inset'
            ? 'p-2 [[data-collapsible=icon]_&]:w-[calc(var(--sidebar-width-icon)+1rem+2px)]'
            : '[[data-collapsible=icon]_&]:w-[var(--sidebar-width-icon)] [[data-side=left]_&]:border-r [[data-side=right]_&]:border-l [[data-side=left]_&]:border-base [[data-side=right]_&]:border-base',
          className
        )}
        data-slot="sidebar-container"
        {...props}
      >
        <div
          className="flex h-full w-full flex-col bg-secondary [[data-variant=floating]_&]:rounded-lg [[data-variant=floating]_&]:border [[data-variant=floating]_&]:border-base [[data-variant=floating]_&]:shadow-sm"
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
        >
          {children}
        </div>
      </div>
    </div>
  )
}

function SidebarTrigger({ className, onClick, ...props }: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      className={cn('size-7', className)}
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      size="icon"
      variant="ghost"
      {...props}
    >
      <PanelLeftIcon />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
}

function SidebarRail({ className, ...props }: React.ComponentProps<'button'>) {
  const { toggleSidebar } = useSidebar()

  return (
    <button
      aria-label="Toggle Sidebar"
      className={cn(
        '-translate-x-1/2 [[data-side=left]_&]:-right-4 absolute inset-y-0 z-nav hidden w-4 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-#8882 [[data-side=right]_&]:left-0 sm:flex',
        '[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize',
        '[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize',
        '[[data-collapsible=offcanvas]_&]:translate-x-0 [[data-collapsible=offcanvas]_&]:hover:bg-secondary [[data-collapsible=offcanvas]_&]:after:left-full',
        '[[data-side=left][data-collapsible=offcanvas]_&]:-right-2',
        '[[data-side=right][data-collapsible=offcanvas]_&]:-left-2',
        className
      )}
      data-sidebar="rail"
      data-slot="sidebar-rail"
      onClick={toggleSidebar}
      tabIndex={-1}
      title="Toggle Sidebar"
      type="button"
      {...props}
    />
  )
}

function SidebarInset({ className, ...props }: React.ComponentProps<'main'>) {
  return (
    <main
      className={cn(
        'relative flex w-full flex-1 flex-col bg-base',
        'md:[[data-variant=inset]~&]:m-2 md:[[data-variant=inset]~&]:ms-0 md:[[data-variant=inset][data-state=collapsed]~&]:ms-2 md:[[data-variant=inset]~&]:rounded-lg md:[[data-variant=inset]~&]:border md:[[data-variant=inset]~&]:border-base',
        className
      )}
      data-slot="sidebar-inset"
      {...props}
    />
  )
}

function SidebarInput({ className, ...props }: React.ComponentProps<typeof Input>) {
  return (
    <Input
      className={cn('h-8 w-full bg-base shadow-none', className)}
      data-sidebar="input"
      data-slot="sidebar-input"
      {...props}
    />
  )
}

function SidebarHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex flex-col gap-2 p-2', className)}
      data-sidebar="header"
      data-slot="sidebar-header"
      {...props}
    />
  )
}

function SidebarFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex flex-col gap-2 p-2', className)}
      data-sidebar="footer"
      data-slot="sidebar-footer"
      {...props}
    />
  )
}

function SidebarSeparator({ className, ...props }: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      className={cn('mx-2 w-auto bg-#8882', className)}
      data-sidebar="separator"
      data-slot="sidebar-separator"
      {...props}
    />
  )
}

function SidebarContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <ScrollArea className="[&_[data-slot=scroll-area-scrollbar]]:hidden" scrollFade>
      <div
        className={cn(
          'flex min-h-0 flex-1 flex-col gap-2 overflow-auto [[data-collapsible=icon]_&]:overflow-hidden',
          className
        )}
        data-sidebar="content"
        data-slot="sidebar-content"
        {...props}
      />
    </ScrollArea>
  )
}

function SidebarGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('relative flex w-full min-w-0 flex-col p-2', className)}
      data-sidebar="group"
      data-slot="sidebar-group"
      {...props}
    />
  )
}

function SidebarGroupLabel({ className, render, ...props }: useRender.ComponentProps<'div'>) {
  const defaultProps = {
    'className': cn(
      'flex h-8 shrink-0 items-center rounded-md px-2 font-medium color-muted text-xs outline-none transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 focus-visible:ring-primary-500/40 [&>svg]:size-4 [&>svg]:shrink-0',
      '[[data-collapsible=icon]_&]:-mt-8 [[data-collapsible=icon]_&]:opacity-0',
      className
    ),
    'data-sidebar': 'group-label',
    'data-slot': 'sidebar-group-label',
  }

  return useRender({
    defaultTagName: 'div',
    props: mergeProps(defaultProps, props),
    render,
  })
}

function SidebarGroupAction({ className, render, ...props }: useRender.ComponentProps<'button'>) {
  const defaultProps = {
    'className': cn(
      "absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 color-muted outline-none transition-transform hover:bg-hover hover:color-base focus-visible:ring-2 focus-visible:ring-primary-500/40 [&>svg:not([class*='size-'])]:size-4 [&>svg]:shrink-0",
      // Increases the hit area of the button on mobile.
      'after:-inset-2 after:absolute md:after:hidden',
      '[[data-collapsible=icon]_&]:hidden',
      className
    ),
    'data-sidebar': 'group-action',
    'data-slot': 'sidebar-group-action',
  }

  return useRender({
    defaultTagName: 'button',
    props: mergeProps(defaultProps, props),
    render,
  })
}

function SidebarGroupContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('w-full text-sm', className)}
      data-sidebar="group-content"
      data-slot="sidebar-group-content"
      {...props}
    />
  )
}

function SidebarMenu({ className, ...props }: React.ComponentProps<'ul'>) {
  return (
    <ul
      className={cn('flex w-full min-w-0 flex-col gap-1', className)}
      data-sidebar="menu"
      data-slot="sidebar-menu"
      {...props}
    />
  )
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<'li'>) {
  return (
    <li
      className={cn('group/menu-item relative', className)}
      data-sidebar="menu-item"
      data-slot="sidebar-menu-item"
      {...props}
    />
  )
}

const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm color-base op75 hover:op100 outline-none transition-[width,height,padding] hover:bg-hover focus-visible:ring-2 focus-visible:ring-primary-500/40 active:bg-hover disabled:pointer-events-none disabled:op50 aria-disabled:pointer-events-none aria-disabled:op50 data-[active=true]:bg-active data-[active=true]:font-medium data-[active=true]:color-active data-[active=true]:op100 data-[state=open]:hover:bg-hover [[data-collapsible=icon]_&]:size-8! [[data-collapsible=icon]_&]:p-2! [&>span:last-child]:truncate [&>svg:not([class*='size-'])]:size-4 [&>svg]:shrink-0",
  {
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
    variants: {
      size: {
        default: 'h-8 text-sm',
        lg: 'h-12 text-sm [[data-collapsible=icon]_&]:p-0!',
        sm: 'h-7 text-xs',
      },
      variant: {
        default: '',
        outline: 'bg-base border border-base hover:bg-hover',
      },
    },
  }
)

function SidebarMenuButton({
  isActive = false,
  variant = 'default',
  size = 'default',
  tooltip,
  className,
  render,
  ...props
}: useRender.ComponentProps<'button'> & {
  isActive?: boolean
  tooltip?: string | React.ComponentProps<typeof TooltipPopup>
} & VariantProps<typeof sidebarMenuButtonVariants>) {
  const { isMobile, state } = useSidebar()

  const defaultProps = {
    'className': cn(sidebarMenuButtonVariants({ size, variant }), className),
    'data-active': isActive,
    'data-sidebar': 'menu-button',
    'data-size': size,
    'data-slot': 'sidebar-menu-button',
  }

  const buttonProps = mergeProps<'button'>(defaultProps, props)

  const buttonElement = useRender({
    defaultTagName: 'button',
    props: buttonProps,
    render,
  })

  if (!tooltip) {
    return buttonElement
  }

  if (typeof tooltip === 'string') {
    tooltip = {
      children: tooltip,
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger render={buttonElement as React.ReactElement<Record<string, unknown>>} />
      <TooltipPopup
        align="center"
        hidden={state !== 'collapsed' || isMobile}
        side="right"
        {...tooltip}
      />
    </Tooltip>
  )
}

function SidebarMenuAction({
  className,
  showOnHover = false,
  render,
  ...props
}: useRender.ComponentProps<'button'> & {
  showOnHover?: boolean
}) {
  const defaultProps = {
    'className': cn(
      "absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 color-muted outline-none transition-transform hover:bg-hover hover:color-base focus-visible:ring-2 focus-visible:ring-primary-500/40 [&>svg:not([class*='size-'])]:size-4 [&>svg]:shrink-0",
      // Increases the hit area of the button on mobile.
      'after:-inset-2 after:absolute md:after:hidden',
      '[[data-size=sm]~&]:top-1',
      '[[data-size=default]~&]:top-1.5',
      '[[data-size=lg]~&]:top-2.5',
      '[[data-collapsible=icon]_&]:hidden',
      showOnHover &&
        '[[data-slot=sidebar-menu-item]:focus-within_&]:opacity-100 [[data-slot=sidebar-menu-item]:hover_&]:opacity-100 data-[state=open]:opacity-100 md:opacity-0',
      className
    ),
    'data-sidebar': 'menu-action',
    'data-slot': 'sidebar-menu-action',
  }

  return useRender({
    defaultTagName: 'button',
    props: mergeProps<'button'>(defaultProps, props),
    render,
  })
}

function SidebarMenuBadge({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute right-1 flex h-5 min-w-5 select-none items-center justify-center rounded-md px-1 font-mono font-medium color-muted text-xs tabular-nums',
        '[[data-size=sm]~&]:top-1',
        '[[data-size=default]~&]:top-1.5',
        '[[data-size=lg]~&]:top-2.5',
        '[[data-collapsible=icon]_&]:hidden',
        className
      )}
      data-sidebar="menu-badge"
      data-slot="sidebar-menu-badge"
      {...props}
    />
  )
}

function SidebarMenuSkeleton({
  className,
  showIcon = false,
  ...props
}: React.ComponentProps<'div'> & {
  showIcon?: boolean
}) {
  // Random width between 50 to 90%.
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`
  }, [])

  return (
    <div
      className={cn('flex h-8 items-center gap-2 rounded-md px-2', className)}
      data-sidebar="menu-skeleton"
      data-slot="sidebar-menu-skeleton"
      {...props}
    >
      {showIcon && <Skeleton className="size-4 rounded-md" data-sidebar="menu-skeleton-icon" />}
      <Skeleton
        className="h-4 max-w-[var(--skeleton-width)] flex-1"
        data-sidebar="menu-skeleton-text"
        style={
          {
            '--skeleton-width': width,
          } as React.CSSProperties
        }
      />
    </div>
  )
}

function SidebarMenuSub({ className, ...props }: React.ComponentProps<'ul'>) {
  return (
    <ul
      className={cn(
        'mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-base border-l px-2.5 py-0.5',
        '[[data-collapsible=icon]_&]:hidden',
        className
      )}
      data-sidebar="menu-sub"
      data-slot="sidebar-menu-sub"
      {...props}
    />
  )
}

function SidebarMenuSubItem({ className, ...props }: React.ComponentProps<'li'>) {
  return (
    <li
      className={cn('group/menu-sub-item relative', className)}
      data-sidebar="menu-sub-item"
      data-slot="sidebar-menu-sub-item"
      {...props}
    />
  )
}

function SidebarMenuSubButton({
  size = 'md',
  isActive = false,
  className,
  render,
  ...props
}: useRender.ComponentProps<'a'> & {
  size?: 'sm' | 'md'
  isActive?: boolean
}) {
  const defaultProps = {
    'className': cn(
      "-translate-x-px flex h-7 min-w-0 items-center gap-2 overflow-hidden rounded-md px-2 color-base op75 hover:op100 outline-none hover:bg-hover focus-visible:ring-2 focus-visible:ring-primary-500/40 active:bg-hover disabled:pointer-events-none disabled:op50 aria-disabled:pointer-events-none aria-disabled:op50 [&>span:last-child]:truncate [&>svg:not([class*='size-'])]:size-4 [&>svg]:shrink-0",
      'data-[active=true]:bg-active data-[active=true]:color-active data-[active=true]:op100',
      size === 'sm' && 'text-xs',
      size === 'md' && 'text-sm',
      '[[data-collapsible=icon]_&]:hidden',
      className
    ),
    'data-active': isActive,
    'data-sidebar': 'menu-sub-button',
    'data-size': size,
    'data-slot': 'sidebar-menu-sub-button',
  }

  return useRender({
    defaultTagName: 'a',
    props: mergeProps<'a'>(defaultProps, props),
    render,
  })
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
}
