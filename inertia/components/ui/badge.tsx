'use client'

import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '~/lib/utils'

const badgeVariants = cva(
  "badge relative shrink-0 justify-center whitespace-nowrap border border-transparent outline-none transition focus-visible:ring-2 focus-visible:ring-primary-500/40 disabled:pointer-events-none disabled:op50 [&_svg:not([class*='size-'])]:size-3 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
    variants: {
      size: {
        default: '',
        lg: 'px-2 py-1 text-sm',
        sm: 'px-1 text-mini',
      },
      variant: {
        default: 'badge-active',
        destructive: 'bg-error-500 text-white',
        error: 'badge-color-red',
        info: 'badge-color-blue',
        outline: 'border-base bg-base color-muted',
        secondary: 'badge-muted',
        success: 'badge-color-green',
        warning: 'badge-color-amber',
      },
    },
  }
)

interface BadgeProps extends useRender.ComponentProps<'span'> {
  variant?: VariantProps<typeof badgeVariants>['variant']
  size?: VariantProps<typeof badgeVariants>['size']
}

function Badge({ className, variant, size, render, ...props }: BadgeProps) {
  const defaultProps = {
    'className': cn(badgeVariants({ className, size, variant })),
    'data-slot': 'badge',
  }

  return useRender({
    defaultTagName: 'span',
    props: mergeProps<'span'>(defaultProps, props),
    render,
  })
}

export { Badge, badgeVariants }
