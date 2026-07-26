import DashboardLayout from '~/layouts/dashboard'
import { Data } from '@generated/data'
import { Link } from '@adonisjs/inertia/react'
import { MapPinIcon, PencilIcon, PlusIcon } from 'lucide-react'
import ArticleDeleteButton from '~/components/article/delete_button'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { SidebarTrigger } from '~/components/ui/sidebar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
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

export default function ArticlesIndex({ articles }: PageProps) {
  return (
    <>
      <header className="flex h-15 shrink-0 items-center gap-2 px-3">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
        <span className="text-sm font-medium">Articles</span>
        <Button variant="outline" className="ml-auto" render={<Link route="articles.create" />}>
          <PlusIcon />
          New article
        </Button>
      </header>

      <main className="flex flex-1 flex-col gap-4 px-2 pb-2">
        <div className="min-h-screen flex-1 rounded-lg border border-base md:min-h-min">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Published</TableHead>
                <TableHead className="text-right">Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center color-muted">
                    No articles yet. Write your first one!
                  </TableCell>
                </TableRow>
              )}
              {articles.data.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="max-w-90 font-medium">
                    <Link
                      route="articles.edit"
                      routeParams={{ id: article.id }}
                      className="block truncate hover:underline underline-offset-4"
                    >
                      {article.title}
                    </Link>
                    <span className="block truncate font-mono text-xs color-faint">
                      /{article.slug}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={article.isPublished ? 'success' : 'warning'}>
                      {article.isPublished ? 'Published' : 'Draft'}
                    </Badge>
                  </TableCell>
                  <TableCell className="color-muted">
                    {article.hasLocation ? (
                      <span className="inline-flex items-center gap-1">
                        <MapPinIcon className="size-3.5" />
                        {article.locationName ?? `${article.latitude}, ${article.longitude}`}
                      </span>
                    ) : (
                      '—'
                    )}
                  </TableCell>
                  <TableCell className="font-mono tabular-nums color-muted">
                    {formatDate(article.publishedAt)}
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums color-muted">
                    {formatDate(article.updatedAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon-sm"
                        render={<Link route="articles.edit" routeParams={{ id: article.id }} />}
                      >
                        <PencilIcon />
                      </Button>
                      <ArticleDeleteButton article={article} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </>
  )
}

ArticlesIndex.layout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>
