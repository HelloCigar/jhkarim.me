import { cn } from '~/lib/utils'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-sm bg-#8881',
        className
      )}
      data-slot="skeleton"
      {...props}
    />
  )
}

export { Skeleton }
