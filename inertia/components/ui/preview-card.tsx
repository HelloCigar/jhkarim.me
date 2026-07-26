'use client'

import { PreviewCard as PreviewCardPrimitive } from '@base-ui/react/preview-card'

import { cn } from '~/lib/utils'

const PreviewCard = PreviewCardPrimitive.Root

function PreviewCardTrigger({ ...props }: PreviewCardPrimitive.Trigger.Props) {
  return <PreviewCardPrimitive.Trigger data-slot="preview-card-trigger" {...props} />
}

function PreviewCardPopup({
  className,
  children,
  align = 'center',
  sideOffset = 4,
  anchor,
  ...props
}: PreviewCardPrimitive.Popup.Props & {
  align?: PreviewCardPrimitive.Positioner.Props['align']
  sideOffset?: PreviewCardPrimitive.Positioner.Props['sideOffset']
  anchor?: PreviewCardPrimitive.Positioner.Props['anchor']
}) {
  return (
    <PreviewCardPrimitive.Portal>
      <PreviewCardPrimitive.Positioner
        align={align}
        anchor={anchor}
        className="z-dropdown"
        data-slot="preview-card-positioner"
        sideOffset={sideOffset}
      >
        <PreviewCardPrimitive.Popup
          className={cn(
            'relative flex w-64 origin-[var(--transform-origin)] text-balance rounded-lg border bg-base p-4 color-base text-sm shadow-lg transition-[scale,opacity] before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_rgba(0,0,0,0.04)] data-[ending-style]:scale-98 data-[starting-style]:scale-98 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 dark:before:shadow-[0_-1px_rgba(255,255,255,0.06)]',
            className
          )}
          data-slot="preview-card-content"
          {...props}
        >
          {children}
        </PreviewCardPrimitive.Popup>
      </PreviewCardPrimitive.Positioner>
    </PreviewCardPrimitive.Portal>
  )
}

export {
  PreviewCard,
  PreviewCard as HoverCard,
  PreviewCardTrigger,
  PreviewCardTrigger as HoverCardTrigger,
  PreviewCardPopup,
  PreviewCardPopup as HoverCardContent,
}
