'use client'

import { ChevronLeftIcon, ChevronRightIcon, ChevronsUpDownIcon } from 'lucide-react'
import type * as React from 'react'
import { DayPicker } from 'react-day-picker'

import { cn } from '~/lib/utils'

const buttonClassNames =
  "relative flex size-[var(--cell-size)] text-base sm:text-sm items-center justify-center rounded-lg color-base not-in-data-[selected]:hover:bg-hover disabled:pointer-events-none disabled:op65 [&_svg:not([class*='opacity-'])]:opacity-80 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  components: userComponents,
  mode = 'single',
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const defaultClassNames = {
    button_next: buttonClassNames,
    button_previous: buttonClassNames,
    caption_label: 'text-base sm:text-sm font-medium flex items-center gap-2 h-full',
    day: 'size-[var(--cell-size)] text-sm py-px',
    day_button: cn(
      buttonClassNames,
      'in-[[data-selected]:not(.range-middle)]:transition-[color,background-color,border-radius,box-shadow] in-data-[disabled]:pointer-events-none focus-visible:z-1 in-data-[selected]:bg-primary-500 in-data-[selected]:text-white in-data-[disabled]:color-faint in-data-[disabled]:line-through in-data-[outside]:color-faint in-data-[selected]:in-data-[outside]:text-white outline-none focus-visible:ring-primary-500/40 focus-visible:ring-[3px] in-[.range-start:not(.range-end)]:rounded-e-none in-[.range-end:not(.range-start)]:rounded-s-none in-[.range-middle]:rounded-none in-[.range-middle]:in-data-[selected]:bg-hover in-[.range-middle]:in-data-[selected]:color-base'
    ),
    dropdown: 'absolute bg-base inset-0 opacity-0',
    dropdown_root:
      "relative has-focus:border-primary-500/60 has-focus:ring-primary-500/40 has-focus:ring-[3px] border border-base shadow-xs rounded-lg px-[calc(0.75rem-1px)] h-9 sm:h-8 [&_svg:not([class*='opacity-'])]:opacity-80 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:-me-1",
    dropdowns:
      'w-full flex items-center text-base sm:text-sm justify-center h-[var(--cell-size)] gap-1.5 *:[span]:font-medium',
    hidden: 'invisible',
    month: 'w-full',
    month_caption:
      'relative mx-[var(--cell-size)] px-1 mb-1 flex h-[var(--cell-size)] items-center justify-center z-2',
    months: 'relative flex flex-col sm:flex-row gap-2',
    nav: 'absolute top-0 flex w-full justify-between z-1',
    outside: 'color-muted data-[selected]:bg-hover data-[selected]:color-muted',
    range_end: 'range-end',
    range_middle: 'range-middle',
    range_start: 'range-start',
    today:
      '*:after:pointer-events-none *:after:absolute *:after:bottom-1 *:after:start-1/2 *:after:z-1 *:after:size-[3px] *:after:-translate-x-1/2 *:after:rounded-full *:after:bg-primary-500 [&[data-selected]:not(.range-middle)>*]:after:bg-base [&[data-disabled]>*]:after:bg-ambient *:after:transition-colors',
    week_number: 'size-[var(--cell-size)] p-0 text-xs font-medium color-faint',
    weekday: 'size-[var(--cell-size)] p-0 text-xs font-medium color-faint',
  }
  const mergedClassNames: typeof defaultClassNames = Object.keys(defaultClassNames).reduce(
    (acc, key) => {
      const userClass = classNames?.[key as keyof typeof classNames]
      const baseClass = defaultClassNames[key as keyof typeof defaultClassNames]

      acc[key as keyof typeof defaultClassNames] = userClass ? cn(baseClass, userClass) : baseClass

      return acc
    },
    { ...defaultClassNames } as typeof defaultClassNames
  )

  const defaultComponents = {
    Chevron: ({
      className,
      orientation,
      ...props
    }: {
      className?: string
      orientation?: 'left' | 'right' | 'up' | 'down'
    }) => {
      if (orientation === 'left') {
        return (
          <ChevronLeftIcon
            className={cn(className, 'rtl:rotate-180')}
            {...props}
            aria-hidden="true"
          />
        )
      }

      if (orientation === 'right') {
        return (
          <ChevronRightIcon
            className={cn(className, 'rtl:rotate-180')}
            {...props}
            aria-hidden="true"
          />
        )
      }

      return <ChevronsUpDownIcon className={className} {...props} aria-hidden="true" />
    },
  }

  const mergedComponents = {
    ...defaultComponents,
    ...userComponents,
  }

  const dayPickerProps = {
    'className': cn('w-fit [--cell-size:2.5rem] sm:[--cell-size:2.25rem]', className),
    'classNames': mergedClassNames,
    'components': mergedComponents,
    'data-slot': 'calendar',
    'formatters': {
      formatMonthDropdown: (date: Date) => date.toLocaleString('default', { month: 'short' }),
    } as React.ComponentProps<typeof DayPicker>['formatters'],
    mode,
    showOutsideDays,
    ...props,
  }

  return <DayPicker {...(dayPickerProps as React.ComponentProps<typeof DayPicker>)} />
}

export { Calendar }
