'use client'

import { Dialog as SheetPrimitive } from '@base-ui/react/dialog'
import { XIcon } from 'lucide-react'
import { cn } from '~/lib/utils'
import { Button } from '~/components/ui/button'
import { ScrollArea } from '~/components/ui/scroll-area'

const Sheet = SheetPrimitive.Root

const SheetPortal = SheetPrimitive.Portal

function SheetTrigger(props: SheetPrimitive.Trigger.Props) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose(props: SheetPrimitive.Close.Props) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetBackdrop({ className, ...props }: SheetPrimitive.Backdrop.Props) {
  return (
    <SheetPrimitive.Backdrop
      className={cn(
        'fixed inset-0 z-drawer-backdrop bg-black/30 backdrop-blur-sm transition-all duration-200 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0',
        className
      )}
      data-slot="sheet-backdrop"
      {...props}
    />
  )
}

function SheetViewport({
  className,
  side,
  variant = 'default',
  ...props
}: SheetPrimitive.Viewport.Props & {
  side?: 'right' | 'left' | 'top' | 'bottom'
  variant?: 'default' | 'inset'
}) {
  return (
    <SheetPrimitive.Viewport
      className={cn(
        'fixed inset-0 z-drawer-content grid',
        side === 'bottom' && 'grid grid-rows-[1fr_auto] pt-12',
        side === 'top' && 'grid grid-rows-[auto_1fr] pb-12',
        side === 'left' && 'flex justify-start',
        side === 'right' && 'flex justify-end',
        variant === 'inset' && 'sm:p-4'
      )}
      data-slot="sheet-viewport"
      {...props}
    />
  )
}

function SheetPopup({
  className,
  children,
  showCloseButton = true,
  side = 'right',
  variant = 'default',
  closeProps,
  ...props
}: SheetPrimitive.Popup.Props & {
  showCloseButton?: boolean
  side?: 'right' | 'left' | 'top' | 'bottom'
  variant?: 'default' | 'inset'
  closeProps?: SheetPrimitive.Close.Props
}) {
  return (
    <SheetPortal>
      <SheetBackdrop />
      <SheetViewport side={side} variant={variant}>
        <SheetPrimitive.Popup
          className={cn(
            'relative flex max-h-full min-h-0 w-full min-w-0 flex-col bg-base color-base shadow-lg transition-[opacity,translate] duration-200 ease-in-out will-change-transform data-[ending-style]:opacity-0 data-[starting-style]:opacity-0',
            side === 'bottom' &&
              'row-start-2 border-t border-base data-[ending-style]:translate-y-8 data-[starting-style]:translate-y-8',
            side === 'top' &&
              'data-[ending-style]:-translate-y-8 data-[starting-style]:-translate-y-8 border-b border-base',
            side === 'left' &&
              'data-[ending-style]:-translate-x-8 data-[starting-style]:-translate-x-8 w-[calc(100%-3rem)] max-w-md border-e border-base',
            side === 'right' &&
              'col-start-2 w-[calc(100%-3rem)] max-w-md border-s border-base data-[ending-style]:translate-x-8 data-[starting-style]:translate-x-8',
            variant === 'inset' && 'sm:rounded-lg sm:border sm:border-base',
            className
          )}
          data-slot="sheet-popup"
          {...props}
        >
          {children}
          {showCloseButton && (
            <SheetPrimitive.Close
              aria-label="Close"
              className="absolute end-2 top-2"
              render={<Button size="icon" variant="ghost" />}
              {...closeProps}
            >
              <XIcon />
            </SheetPrimitive.Close>
          )}
        </SheetPrimitive.Popup>
      </SheetViewport>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 p-6 pb-2',
        className
      )}
      data-slot="sheet-header"
      {...props}
    />
  )
}

function SheetFooter({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<'div'> & {
  variant?: 'default' | 'bare'
}) {
  return (
    <div
      className={cn(
        'flex flex-col-reverse gap-2 px-6 sm:flex-row sm:justify-end',
        variant === 'default' && 'border-t border-base bg-secondary py-4',
        variant === 'bare' && 'pt-2 pb-6',
        className
      )}
      data-slot="sheet-footer"
      {...props}
    />
  )
}

function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
  return (
    <SheetPrimitive.Title
      className={cn('font-semibold text-xl leading-none', className)}
      data-slot="sheet-title"
      {...props}
    />
  )
}

function SheetDescription({ className, ...props }: SheetPrimitive.Description.Props) {
  return (
    <SheetPrimitive.Description
      className={cn('color-muted text-sm', className)}
      data-slot="sheet-description"
      {...props}
    />
  )
}

function SheetPanel({
  className,
  scrollFade = true,
  ...props
}: React.ComponentProps<'div'> & { scrollFade?: boolean }) {
  return (
    <ScrollArea scrollFade={scrollFade}>
      <div
        className={cn(
          'px-6 py-2',
          className
        )}
        data-slot="sheet-panel"
        {...props}
      />
    </ScrollArea>
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetPortal,
  SheetClose,
  SheetBackdrop,
  SheetBackdrop as SheetOverlay,
  SheetPopup,
  SheetPopup as SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetPanel,
}
