import DefaultLayout from '~/layouts/default'
import { Head } from '@inertiajs/react'
import { Link } from '@adonisjs/inertia/react'
import { ImageIcon } from 'lucide-react'
import { ImageView } from '~/components/image_view'
import { Button } from '~/components/ui/button'
import { InertiaProps } from '~/types'

type Photo = { key: string; url: string }
type PageProps = InertiaProps<{ photos: Photo[]; nextToken: string | null }>

export default function PhotosPage({ photos, nextToken }: PageProps) {
  return (
    <div className="px-4 sm:px-5">
      <Head title="Photos" />
      <div className="container mx-auto max-w-5xl pb-20 pt-12">
        <h1 className="text-3xl font-medium">Photos</h1>
        <p className="mt-1 text-sm color-muted">
          Every picture from every story, in one place. Click one to see it in full.
        </p>

        {photos.length === 0 ? (
          <div className="mt-12 flex flex-col items-center gap-2 rounded-lg border border-base border-dashed py-16 color-faint">
            <ImageIcon className="size-8" aria-hidden="true" />
            <p className="text-sm">No photos yet</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4">
            {photos.map((photo) => (
              <ImageView
                key={photo.key}
                src={photo.url}
                className="group aspect-square overflow-hidden rounded-lg border border-base bg-secondary"
              >
                {/* The tiles crop to a uniform square; the viewer shows the original */}
                <img
                  src={photo.url}
                  alt=""
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </ImageView>
            ))}
          </div>
        )}

        {nextToken && (
          <div className="mt-8 text-center">
            <Button
              variant="outline"
              render={<Link href={`/photos?pagination_token=${encodeURIComponent(nextToken)}`} />}
            >
              Load more
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

PhotosPage.layout = (page: React.ReactElement) => <DefaultLayout>{page}</DefaultLayout>
