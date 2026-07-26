'use client'

import { Menu as MenuPrimitive } from '@base-ui/react/menu'
import { ChevronRightIcon } from 'lucide-react'
import type * as React from 'react'

import { cn } from '~/lib/utils'

const MenuCreateHandle = MenuPrimitive.createHandle

const Menu = MenuPrimitive.Root

const MenuPortal = MenuPrimitive.Portal

function MenuTrigger({ className, children, ...props }: MenuPrimitive.Trigger.Props) {
  return (
    <MenuPrimitive.Trigger className={className} data-slot="menu-trigger" {...props}>
      {children}
    </MenuPrimitive.Trigger>
  )
}

function MenuPopup({
  children,
  className,
  sideOffset = 4,
  align = 'center',
  alignOffset,
  side = 'bottom',
  anchor,
  ...props
}: MenuPrimitive.Popup.Props & {
  align?: MenuPrimitive.Positioner.Props['align']
  sideOffset?: MenuPrimitive.Positioner.Props['sideOffset']
  alignOffset?: MenuPrimitive.Positioner.Props['alignOffset']
  side?: MenuPrimitive.Positioner.Props['side']
  anchor?: MenuPrimitive.Positioner.Props['anchor']
}) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        className="z-dropdown"
        data-slot="menu-positioner"
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPrimitive.Popup
          className={cn(
            'relative flex min-w-32 origin-[var(--transform-origin)] rounded-lg border border-base bg-base color-base shadow-lg outline-none focus:outline-none',
            className
          )}
          data-slot="menu-popup"
          {...props}
        >
          <div className="max-h-[var(--available-height)] w-full overflow-y-auto p-1">
            {children}
          </div>
        </MenuPrimitive.Popup>
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
}

function MenuGroup(props: MenuPrimitive.Group.Props) {
  return <MenuPrimitive.Group data-slot="menu-group" {...props} />
}

function MenuItem({
  className,
  inset,
  variant = 'default',
  ...props
}: MenuPrimitive.Item.Props & {
  inset?: boolean
  variant?: 'default' | 'destructive'
}) {
  return (
    <MenuPrimitive.Item
      className={cn(
        "flex min-h-7 cursor-default select-none items-center gap-2 rounded-sm px-2 py-1 text-sm color-base outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-hover data-[inset]:ps-8 data-[variant=destructive]:color-scale-critical data-[disabled]:op50 [&>svg:not([class*='size-'])]:size-4 [&>svg]:pointer-events-none [&>svg]:shrink-0 [&>svg]:op80",
        className
      )}
      data-inset={inset}
      data-slot="menu-item"
      data-variant={variant}
      {...props}
    />
  )
}

function MenuCheckboxItem({
  className,
  children,
  checked,
  variant = 'default',
  ...props
}: MenuPrimitive.CheckboxItem.Props & {
  variant?: 'default' | 'switch'
}) {
  return (
    <MenuPrimitive.CheckboxItem
      checked={checked}
      className={cn(
        "grid min-h-7 cursor-default items-center gap-2 rounded-sm py-1 ps-2 text-sm color-base outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-hover data-[disabled]:op50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        variant === 'switch' ? 'grid-cols-[1fr_auto] gap-4 pe-1.5' : 'grid-cols-[.75rem_1fr] pe-4',
        className
      )}
      data-slot="menu-checkbox-item"
      {...props}
    >
      {variant === 'switch' ? (
        <>
          <span className="col-start-1">{children}</span>
          <MenuPrimitive.CheckboxItemIndicator
            className="inline-flex h-[calc(var(--thumb-size)+2px)] w-[calc(var(--thumb-size)*2-2px)] shrink-0 items-center rounded-full p-px outline-none transition-[background-color,box-shadow] duration-200 [--thumb-size:0.75rem] focus-visible:ring-2 focus-visible:ring-primary-500/40 data-[checked]:bg-primary-500 data-[unchecked]:bg-#8883 data-[disabled]:op50"
            keepMounted
          >
            <span className="pointer-events-none block aspect-square h-full rounded-full bg-white will-change-transform [transition:translate_.15s] [[data-slot=menu-checkbox-item][data-checked]_&]:translate-x-[calc(var(--thumb-size)-4px)]" />
          </MenuPrimitive.CheckboxItemIndicator>
        </>
      ) : (
        <>
          <MenuPrimitive.CheckboxItemIndicator className="-ms-0.5 col-start-1">
            <svg
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M5.252 12.7 10.2 18.63 18.748 5.37" />
            </svg>
          </MenuPrimitive.CheckboxItemIndicator>
          <span className="col-start-2">{children}</span>
        </>
      )}
    </MenuPrimitive.CheckboxItem>
  )
}

function MenuRadioGroup(props: MenuPrimitive.RadioGroup.Props) {
  return <MenuPrimitive.RadioGroup data-slot="menu-radio-group" {...props} />
}

function MenuRadioItem({ className, children, ...props }: MenuPrimitive.RadioItem.Props) {
  return (
    <MenuPrimitive.RadioItem
      className={cn(
        "grid min-h-7 cursor-default grid-cols-[.75rem_1fr] items-center gap-2 rounded-sm py-1 ps-2 pe-4 text-sm color-base outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-hover data-[disabled]:op50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      data-slot="menu-radio-item"
      {...props}
    >
      <MenuPrimitive.RadioItemIndicator className="-ms-0.5 col-start-1">
        <svg
          fill="none"
          height="24"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M5.252 12.7 10.2 18.63 18.748 5.37" />
        </svg>
      </MenuPrimitive.RadioItemIndicator>
      <span className="col-start-2">{children}</span>
    </MenuPrimitive.RadioItem>
  )
}

function MenuGroupLabel({
  className,
  inset,
  ...props
}: MenuPrimitive.GroupLabel.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.GroupLabel
      className={cn(
        'px-2 py-1.5 font-medium color-muted text-xs data-[inset]:ps-8',
        className
      )}
      data-inset={inset}
      data-slot="menu-label"
      {...props}
    />
  )
}

function MenuSeparator({ className, ...props }: MenuPrimitive.Separator.Props) {
  return (
    <MenuPrimitive.Separator
      className={cn('mx-2 my-1 h-px bg-#8882', className)}
      data-slot="menu-separator"
      {...props}
    />
  )
}

function MenuShortcut({ className, ...props }: React.ComponentProps<'kbd'>) {
  return (
    <kbd
      className={cn(
        'ms-auto font-mono font-medium color-faint text-xs tracking-widest',
        className
      )}
      data-slot="menu-shortcut"
      {...props}
    />
  )
}

function MenuSub(props: MenuPrimitive.SubmenuRoot.Props) {
  return <MenuPrimitive.SubmenuRoot data-slot="menu-sub" {...props} />
}

function MenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.SubmenuTrigger
      className={cn(
        "flex min-h-7 items-center gap-2 rounded-sm px-2 py-1 text-sm color-base outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-hover data-[popup-open]:bg-hover data-[inset]:ps-8 data-[disabled]:op50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none",
        className
      )}
      data-inset={inset}
      data-slot="menu-sub-trigger"
      {...props}
    >
      {children}
      <ChevronRightIcon className="-me-0.5 ms-auto opacity-80" />
    </MenuPrimitive.SubmenuTrigger>
  )
}

function MenuSubPopup({
  className,
  sideOffset = 0,
  alignOffset,
  align = 'start',
  ...props
}: MenuPrimitive.Popup.Props & {
  align?: MenuPrimitive.Positioner.Props['align']
  sideOffset?: MenuPrimitive.Positioner.Props['sideOffset']
  alignOffset?: MenuPrimitive.Positioner.Props['alignOffset']
}) {
  const defaultAlignOffset = align !== 'center' ? -5 : undefined

  return (
    <MenuPopup
      align={align}
      alignOffset={alignOffset ?? defaultAlignOffset}
      className={className}
      data-slot="menu-sub-content"
      side="inline-end"
      sideOffset={sideOffset}
      {...props}
    />
  )
}

export {
  MenuCreateHandle,
  MenuCreateHandle as DropdownMenuCreateHandle,
  Menu,
  Menu as DropdownMenu,
  MenuPortal,
  MenuPortal as DropdownMenuPortal,
  MenuTrigger,
  MenuTrigger as DropdownMenuTrigger,
  MenuPopup,
  MenuPopup as DropdownMenuContent,
  MenuGroup,
  MenuGroup as DropdownMenuGroup,
  MenuItem,
  MenuItem as DropdownMenuItem,
  MenuCheckboxItem,
  MenuCheckboxItem as DropdownMenuCheckboxItem,
  MenuRadioGroup,
  MenuRadioGroup as DropdownMenuRadioGroup,
  MenuRadioItem,
  MenuRadioItem as DropdownMenuRadioItem,
  MenuGroupLabel,
  MenuGroupLabel as DropdownMenuLabel,
  MenuSeparator,
  MenuSeparator as DropdownMenuSeparator,
  MenuShortcut,
  MenuShortcut as DropdownMenuShortcut,
  MenuSub,
  MenuSub as DropdownMenuSub,
  MenuSubTrigger,
  MenuSubTrigger as DropdownMenuSubTrigger,
  MenuSubPopup,
  MenuSubPopup as DropdownMenuSubContent,
}
