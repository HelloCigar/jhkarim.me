'use client'

import { Field as FieldPrimitive } from '@base-ui/react/field'
import { mergeProps } from '@base-ui/react/merge-props'
import type * as React from 'react'

import { cn } from '~/lib/utils'

type TextareaProps = React.ComponentProps<'textarea'> & {
  size?: 'sm' | 'default' | 'lg' | number
  unstyled?: boolean
}

function Textarea({ className, size = 'default', unstyled = false, ...props }: TextareaProps) {
  return (
    <span
      className={
        cn(
          !unstyled &&
            'relative inline-flex w-full rounded border border-base bg-base color-base text-sm transition focus-within:ring-2 focus-within:ring-primary-500/40 has-[[aria-invalid]]:border-error-500/60 focus-within:has-[[aria-invalid]]:ring-error-500/30 has-[:disabled]:op50 has-[:disabled]:pointer-events-none',
          className
        ) || undefined
      }
      data-size={size}
      data-slot="textarea-control"
    >
      <FieldPrimitive.Control
        render={(defaultProps) => (
          <textarea
            className={cn(
              'field-sizing-content min-h-17.5 w-full rounded-[inherit] bg-transparent px-3 py-1.5 outline-none placeholder:color-faint',
              size === 'sm' && 'min-h-16.5 px-2.5 py-1',
              size === 'lg' && 'min-h-18.5 py-2'
            )}
            data-slot="textarea"
            {...mergeProps(defaultProps, props)}
          />
        )}
      />
    </span>
  )
}

export { Textarea, type TextareaProps }
