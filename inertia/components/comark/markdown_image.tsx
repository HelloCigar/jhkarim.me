import { ImageView } from '~/components/image_view'

interface MarkdownImageProps {
  src?: string
  alt?: string
  title?: string
}

/**
 * Comark override for plain markdown images (`![alt](src)`), so they open in
 * the same full-viewport viewer as `::blog-image`.
 */
export default function MarkdownImage({ src, alt, title }: MarkdownImageProps) {
  if (!src) return null

  return (
    <ImageView src={src} alt={alt} caption={title} className="mx-auto w-fit max-w-full">
      <img src={src} alt={alt ?? ''} title={title} loading="lazy" className="max-w-full" />
    </ImageView>
  )
}
