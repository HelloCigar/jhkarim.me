import type * as React from 'react'

import { cn } from '~/lib/utils'

function Table({ className, ...props }: React.ComponentProps<'table'>) {
  return (
    <div className="relative w-full overflow-x-auto" data-slot="table-container">
      <table
        className={cn(
          'w-full caption-bottom text-sm',
          className
        )}
        data-slot="table"
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<'thead'>) {
  return (
    <thead
      className={cn(
        '[&_tr]:border-b [&_tr]:border-base',
        className
      )}
      data-slot="table-header"
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<'tbody'>) {
  return (
    <tbody
      className={cn(
        'relative [&_tr:last-child]:border-0',
        className
      )}
      data-slot="table-body"
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<'tfoot'>) {
  return (
    <tfoot
      className={cn(
        'border-t border-base bg-secondary font-medium [&>tr]:last:border-b-0',
        className
      )}
      data-slot="table-footer"
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<'tr'>) {
  return (
    <tr
      className={cn(
        'border-b border-base transition-colors hover:bg-hover data-[state=selected]:bg-active',
        className
      )}
      data-slot="table-row"
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<'th'>) {
  return (
    <th
      className={cn(
        'h-10 whitespace-nowrap px-2.5 text-left align-middle font-medium color-muted leading-none has-[[role=checkbox]]:w-px has-[[role=checkbox]]:pe-0',
        className
      )}
      data-slot="table-head"
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<'td'>) {
  return (
    <td
      className={cn(
        'whitespace-nowrap p-2.5 align-middle leading-none has-[[role=checkbox]]:pe-0',
        className
      )}
      data-slot="table-cell"
      {...props}
    />
  )
}

function TableCaption({ className, ...props }: React.ComponentProps<'caption'>) {
  return (
    <caption
      className={cn('mt-4 color-muted text-sm', className)}
      data-slot="table-caption"
      {...props}
    />
  )
}

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption }
