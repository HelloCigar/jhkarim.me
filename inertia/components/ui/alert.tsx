import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'

import { cn } from '~/lib/utils'

const alertVariants = cva(
  'relative grid w-full items-start gap-x-2 gap-y-0.5 rounded-lg border border-base px-3.5 py-3 color-base text-sm has-[>svg]:grid-cols-[1rem_1fr] has-[>svg]:gap-x-2 [&>svg]:h-5 [&>svg]:w-4',
  {
    defaultVariants: {
      variant: 'default',
    },
    variants: {
      variant: {
        default: 'bg-transparent dark:bg-#8881 [&>svg]:color-muted',
        error: 'border-error-500/40 bg-error-500/10 [&>svg]:color-scale-critical',
        info: 'border-blue-500/40 bg-blue-500/10 [&>svg]:text-blue-600 dark:[&>svg]:text-blue-300',
        success:
          'border-success-500/40 bg-success-500/10 [&>svg]:text-success-600 dark:[&>svg]:text-success-300',
        warning: 'border-warning-500/40 bg-warning-500/10 [&>svg]:color-scale-medium',
      },
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
  return (
    <div
      className={cn(alertVariants({ variant }), className)}
      data-slot="alert"
      role="alert"
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('font-medium [svg~&]:col-start-2', className)}
      data-slot="alert-title"
      {...props}
    />
  )
}

function AlertDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex flex-col gap-2.5 color-muted [svg~&]:col-start-2', className)}
      data-slot="alert-description"
      {...props}
    />
  )
}

function AlertAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex gap-1 max-sm:col-start-2 max-sm:mt-2 sm:row-start-1 sm:row-end-3 sm:self-center sm:[[data-slot=alert-description]~&]:col-start-2 sm:[[data-slot=alert-title]~&]:col-start-2 sm:[svg~&]:col-start-2 sm:[svg~[data-slot=alert-description]~&]:col-start-3 sm:[svg~[data-slot=alert-title]~&]:col-start-3',
        className
      )}
      data-slot="alert-action"
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, AlertAction }
