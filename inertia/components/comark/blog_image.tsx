import { ImageIcon } from 'lucide-react'
import { ImageView } from '~/components/image_view'

interface BlogImageProps {
  src?: string
  alt?: string
  caption?: string
  width?: number | string
}

/**
 * Comark component for article images.
 *
 * ```markdown
 * ::blog-image{src="/uploads/sunset.jpg" alt="Sunset in Palawan" caption="Sunset in Palawan"}
 * ::
 * ```
 */
export default function BlogImage({ src, alt, caption, width }: BlogImageProps) {
  if (!src) {
    return (
      <div className="my-6 flex h-40 items-center justify-center rounded-lg border border-base border-dashed color-faint">
        <ImageIcon className="size-6" aria-hidden="true" />
        <span className="ml-2 text-sm">Missing image source</span>
      </div>
    )
  }

  return (
    <figure className="my-6">
      <ImageView src={src} alt={alt} caption={caption} className="mx-auto w-fit max-w-full">
        <img
          src={src}
          alt={alt ?? caption ?? ''}
          width={width}
          loading="lazy"
          className="max-w-full rounded-lg border border-base"
        />
      </ImageView>
      {caption && (
        <figcaption className="mt-2 text-center text-sm color-muted">{caption}</figcaption>
      )}
    </figure>
  )
}
