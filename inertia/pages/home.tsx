import DefaultLayout from '~/layouts/default'
import { Data } from '@generated/data'
import { Link } from '@adonisjs/inertia/react'
import { MapPinIcon } from 'lucide-react'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { formatDate } from '~/lib/format'
import { InertiaProps } from '~/types'

type PageProps = InertiaProps<{
  articles: {
    data: Data.Article[]
    metadata: {
      total: number
      perPage: number
      currentPage: number
      lastPage: number
      firstPage: number
    }
  }
}>

export default function Home({ articles }: PageProps) {
  const { currentPage, lastPage } = articles.metadata

  return (
    <div className="px-5">
      <div className="container mx-auto flex max-w-2xl flex-col pb-20">
        <div className="pt-16 pb-10">
          <h1 className="text-4xl font-medium">Field notes</h1>
          <p className="mt-3 color-muted">
            Stories, snippets and places — in chronological order.
          </p>
        </div>

        {articles.data.length === 0 && (
          <p className="py-10 color-muted">Nothing published yet. Check back soon!</p>
        )}

        <ol className="relative border-l border-base">
          {articles.data.map((article) => (
            <li key={article.id} className="relative pb-12 pl-8 last:pb-0">
              <span
                aria-hidden="true"
                className="absolute -left-1.25 top-1.5 size-2.5 rounded-full border-2 border-base bg-secondary"
              />
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm color-muted">
                <time className="font-mono tabular-nums">{formatDate(article.publishedAt)}</time>
                {article.locationName && (
                  <Badge variant="secondary">
                    <MapPinIcon className="size-3" />
                    {article.locationName}
                  </Badge>
                )}
              </div>
              <h2 className="mt-2 text-xl font-medium">
                <Link
                  route="blog.show"
                  routeParams={{ slug: article.slug }}
                  className="hover:underline underline-offset-4"
                >
                  {article.title}
                </Link>
              </h2>
              {article.excerpt && <p className="mt-2 color-muted">{article.excerpt}</p>}
              {article.coverImage && (
                <Link route="blog.show" routeParams={{ slug: article.slug }} className="block">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    loading="lazy"
                    className="mt-4 max-h-72 w-full rounded-lg border border-base object-cover"
                  />
                </Link>
              )}
            </li>
          ))}
        </ol>

        {lastPage > 1 && (
          <div className="mt-12 flex items-center justify-between">
            {currentPage > 1 ? (
              <Button variant="outline" render={<Link href={`/?page=${currentPage - 1}`} />}>
                Newer
              </Button>
            ) : (
              <span />
            )}
            <span className="font-mono tabular-nums text-sm color-muted">
              {currentPage} / {lastPage}
            </span>
            {currentPage < lastPage ? (
              <Button variant="outline" render={<Link href={`/?page=${currentPage + 1}`} />}>
                Older
              </Button>
            ) : (
              <span />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

Home.layout = (page: React.ReactElement) => <DefaultLayout>{page}</DefaultLayout>
