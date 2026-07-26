'use client'

import { Toggle as TogglePrimitive } from '@base-ui/react/toggle'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '~/lib/utils'

const toggleVariants = cva(
  "[&_svg]:-mx-0.5 relative inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-2 whitespace-nowrap rounded-lg border font-medium text-base color-base outline-none transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11 hover:bg-hover focus-visible:ring-2 focus-visible:ring-primary-500/40 disabled:pointer-events-none disabled:op65 data-[pressed]:bg-#8881 data-[pressed]:color-base sm:text-sm [&_svg:not([class*='opacity-'])]:opacity-80 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
    variants: {
      size: {
        default: 'h-9 min-w-9 px-[calc(0.5rem-1px)] sm:h-8 sm:min-w-8',
        lg: 'h-10 min-w-10 px-[calc(0.625rem-1px)] sm:h-9 sm:min-w-9',
        sm: 'h-8 min-w-8 px-[calc(0.375rem-1px)] sm:h-7 sm:min-w-7',
      },
      variant: {
        default: 'border-transparent',
        outline:
          'border-base bg-base shadow-xs not-disabled:not-active:not-data-[pressed]:before:shadow-[0_1px_rgba(0,0,0,0.04)] dark:bg-#8881 dark:data-[pressed]:bg-#8883 dark:hover:bg-#8881 dark:not-disabled:not-active:not-data-[pressed]:before:shadow-[0_-1px_rgba(255,255,255,0.06)] dark:not-disabled:not-data-[pressed]:before:shadow-[0_-1px_rgba(255,255,255,0.02)] [:disabled,:active,[data-pressed]]:shadow-none',
      },
    },
  }
)

function Toggle({
  className,
  variant,
  size,
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive
      className={cn(toggleVariants({ className, size, variant }))}
      data-slot="toggle"
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
