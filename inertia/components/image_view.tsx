import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { XIcon } from 'lucide-react'
import { cn } from '~/lib/utils'

interface ImageViewProps {
  src: string
  alt?: string
  caption?: string
  /** Classes for the trigger button wrapping the thumbnail */
  className?: string
  /** The thumbnail markup - usually an <img> of the same source */
  children: React.ReactNode
}

/**
 * Full-viewport image lightbox. Wraps a thumbnail (the children) in a trigger;
 * clicking it opens the image scaled to fit the viewport at its original
 * aspect ratio. Used by the photos gallery and the ::blog-image comark
 * component, so both share one viewer.
 */
export function ImageView({ src, alt, caption, className, children }: ImageViewProps) {
  const label = caption || alt || 'View image'

  return (
    <DialogPrimitive.Root>
      <DialogPrimitive.Trigger
        aria-label={label}
        className={cn(
          'block cursor-zoom-in outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40',
          className
        )}
      >
        {children}
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-modal-backdrop bg-black/85 backdrop-blur-sm transition-opacity duration-200 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />

        {/* Clicks on the area around the popup count as outside clicks and dismiss */}
        <div className="fixed inset-0 z-modal-content flex items-center justify-center p-4 sm:p-8">
          <DialogPrimitive.Popup
            aria-label={label}
            className="flex max-h-full max-w-full flex-col items-center gap-3 outline-none transition-[scale,opacity] duration-200 data-[ending-style]:scale-97 data-[starting-style]:scale-97 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0"
          >
            {/* max constraints only, so the browser keeps the intrinsic ratio */}
            <img
              src={src}
              alt={alt ?? caption ?? ''}
              className={cn(
                'max-w-full rounded',
                caption ? 'max-h-[calc(100dvh-8rem)]' : 'max-h-[calc(100dvh-4rem)]'
              )}
            />
            {caption && <p className="text-center text-sm text-white/70">{caption}</p>}
          </DialogPrimitive.Popup>

          <DialogPrimitive.Close
            aria-label="Close image view"
            className="absolute right-3 top-3 inline-flex size-9 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white/90 outline-none transition hover:bg-black/60 focus-visible:ring-2 focus-visible:ring-white/50"
          >
            <XIcon className="size-5" />
          </DialogPrimitive.Close>
        </div>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
