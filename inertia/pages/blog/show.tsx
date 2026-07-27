import DefaultLayout from '~/layouts/default'
import { Head } from '@inertiajs/react'
import { Data } from '@generated/data'
import { Link } from '@adonisjs/inertia/react'
import { ArrowLeftIcon, ChevronRight, MapPinIcon } from 'lucide-react'
import { ArticleComark } from '~/components/comark/article_comark'
import { Badge } from '~/components/ui/badge'
import { formatDate } from '~/lib/format'
import { InertiaProps } from '~/types'
import { ImageView } from '~/components/image_view';

type PageProps = InertiaProps<{ article: Data.Article }>

export default function BlogShow({ article }: PageProps) {
  return (
    <div className="px-5">
      <Head title={article.title} />
      <article className="container mx-auto max-w-2xl pb-20">
        <div className="pt-12">
          <Link
            route="home"
            className="inline-flex items-center gap-1.5 text-sm color-muted hover:color-base underline"
          >
            <ChevronRight className="size-4" />
            cd ..
          </Link>

          <h1 className="mt-6 text-4xl font-medium leading-tight">{article.title}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm color-muted">
            <time className="font-mono tabular-nums">{formatDate(article.publishedAt)}</time>
            {article.locationName && (
              <Badge variant="secondary" render={<Link route="blog.globe" />}>
                <MapPinIcon className="size-3" />
                {article.locationName}
              </Badge>
            )}
          </div>

          {article.coverImage && (
            <ImageView src={article.coverImage}>
              <img
                src={article.coverImage}
                alt={article.title}
                className="mt-8 w-full rounded-lg border border-base"
              />
            </ImageView>
          )}
        </div>

        <div className="mt-8">
          <ArticleComark>{article.content}</ArticleComark>
        </div>
      </article>
    </div>
  )
}

BlogShow.layout = (page: React.ReactElement) => <DefaultLayout>{page}</DefaultLayout>
