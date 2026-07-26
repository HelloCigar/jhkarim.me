'use client'

import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'

import { cn } from '~/lib/utils'

const buttonVariants = cva(
  "relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded border border-transparent font-medium text-sm outline-none transition disabled:pointer-events-none disabled:op50 focus-visible:ring-2 focus-visible:ring-primary-500/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
    variants: {
      size: {
        'default': 'h-8 px-3',
        'icon': 'size-8',
        'icon-lg': 'size-9',
        'icon-sm': 'size-7',
        'icon-xl': "size-10 [&_svg:not([class*='size-'])]:size-5",
        'icon-xs': "size-6 [&_svg:not([class*='size-'])]:size-3.5",
        'lg': 'h-9 px-3.5',
        'sm': 'h-7 gap-1.5 px-2.5',
        'xl': "h-10 px-4 text-base [&_svg:not([class*='size-'])]:size-5",
        'xs': "h-6 gap-1 px-2 text-xs [&_svg:not([class*='size-'])]:size-3.5",
      },
      variant: {
        'default':
          'bg-primary-500 text-white hover:bg-primary-600 data-[pressed]:bg-primary-600',
        'destructive':
          'bg-error-500 text-white hover:bg-error-600 data-[pressed]:bg-error-600',
        'destructive-outline':
          'border-base color-scale-critical hover:bg-error-500/10 hover:border-error-500/40 data-[pressed]:bg-error-500/10',
        'ghost': 'color-base op75 hover:op100 hover:bg-hover data-[pressed]:bg-hover',
        'link': 'color-active underline-offset-4 hover:underline data-[pressed]:underline',
        'outline':
          'border-base bg-base color-base op75 hover:op100 hover:bg-hover data-[pressed]:bg-hover',
        'secondary': 'bg-secondary color-base hover:bg-hover data-[pressed]:bg-hover',
      },
    },
  }
)

interface ButtonProps extends useRender.ComponentProps<'button'> {
  variant?: VariantProps<typeof buttonVariants>['variant']
  size?: VariantProps<typeof buttonVariants>['size']
}

function Button({ className, variant, size, render, ...props }: ButtonProps) {
  const typeValue: React.ButtonHTMLAttributes<HTMLButtonElement>['type'] = render
    ? undefined
    : 'button'

  const defaultProps = {
    'className': cn(buttonVariants({ className, size, variant })),
    'data-slot': 'button',
    'type': typeValue,
  }

  return useRender({
    defaultTagName: 'button',
    props: mergeProps<'button'>(defaultProps, props),
    render,
  })
}

export { Button, buttonVariants }
