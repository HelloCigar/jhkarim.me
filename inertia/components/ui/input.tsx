'use client'

import { Input as InputPrimitive } from '@base-ui/react/input'
import type * as React from 'react'

import { cn } from '~/lib/utils'

type InputProps = Omit<InputPrimitive.Props & React.RefAttributes<HTMLInputElement>, 'size'> & {
  size?: 'sm' | 'default' | 'lg' | number
  unstyled?: boolean
  nativeInput?: boolean
}

function Input({
  className,
  size = 'default',
  unstyled = false,
  nativeInput = false,
  ...props
}: InputProps) {
  const inputClassName = cn(
    'h-8 w-full min-w-0 rounded-[inherit] bg-transparent px-3 leading-8 outline-none placeholder:color-faint',
    size === 'sm' && 'h-7 px-2.5 leading-7',
    size === 'lg' && 'h-9 leading-9',
    props.type === 'search' &&
      '[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none',
    props.type === 'file' &&
      'color-muted file:me-3 file:bg-transparent file:font-medium file:color-base file:text-sm'
  )

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
      data-slot="input-control"
    >
      {nativeInput ? (
        <input
          className={inputClassName}
          data-slot="input"
          size={typeof size === 'number' ? size : undefined}
          {...(props as React.ComponentProps<'input'>)}
        />
      ) : (
        <InputPrimitive
          className={inputClassName}
          data-slot="input"
          size={typeof size === 'number' ? size : undefined}
          {...props}
        />
      )}
    </span>
  )
}

export { Input, type InputProps }
