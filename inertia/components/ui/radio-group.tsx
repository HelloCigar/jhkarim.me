'use client'

import { Radio as RadioPrimitive } from '@base-ui/react/radio'
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group'

import { cn } from '~/lib/utils'

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      className={cn('flex flex-col gap-3', className)}
      data-slot="radio-group"
      {...props}
    />
  )
}

function Radio({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      className={cn(
        'relative inline-flex size-4.5 shrink-0 items-center justify-center rounded-full border border-base bg-base shadow-xs outline-none transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-full not-data-[disabled]:not-data-[checked]:not-aria-invalid:before:shadow-[0_1px_rgba(0,0,0,0.04)] focus-visible:ring-2 focus-visible:ring-primary-500/40 aria-invalid:border-error-500/40 focus-visible:aria-invalid:border-error-500/40 focus-visible:aria-invalid:ring-error-500/30 data-[disabled]:op65 sm:size-4 dark:not-data-[checked]:bg-#8881 dark:aria-invalid:ring-error-500/30 dark:not-data-[disabled]:not-data-[checked]:not-aria-invalid:before:shadow-[0_-1px_rgba(255,255,255,0.06)] [[data-disabled],[data-checked],[aria-invalid]]:shadow-none',
        className
      )}
      data-slot="radio"
      {...props}
    >
      <RadioPrimitive.Indicator
        className="-inset-px absolute flex size-4.5 items-center justify-center rounded-full before:size-2 before:rounded-full before:bg-white data-[unchecked]:hidden data-[checked]:bg-primary-500 sm:size-4 sm:before:size-1.5"
        data-slot="radio-indicator"
      />
    </RadioPrimitive.Root>
  )
}

export { RadioGroup, Radio, Radio as RadioGroupItem }
