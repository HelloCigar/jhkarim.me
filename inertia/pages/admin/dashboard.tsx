import DashboardLayout from '~/layouts/dashboard'
import { Data } from '@generated/data'
import { Link } from '@adonisjs/inertia/react'
import { PlusIcon } from 'lucide-react'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
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
import { InertiaProps } from '~/types'
import { formatDate } from '~/lib/format'

type PageProps = InertiaProps<{
  stats: {
    total: number
    published: number
    drafts: number
    located: number
  }
  recent: Data.Article[]
}>

const statCards = [
  { key: 'total', label: 'Articles', description: 'Everything you have written' },
  { key: 'published', label: 'Published', description: 'Visible on the timeline' },
  { key: 'drafts', label: 'Drafts', description: 'Still in the works' },
  { key: 'located', label: 'On the globe', description: 'Articles with coordinates' },
] as const

export default function AdminDashboard({ stats, recent }: PageProps) {
  return (
    <>
      <header className="flex h-15 shrink-0 items-center gap-2 px-3">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
        <span className="text-sm font-medium">Dashboard</span>
        <Button variant="outline" className="ml-auto" render={<Link route="articles.create" />}>
          <PlusIcon />
          New article
        </Button>
      </header>

      <main className="flex flex-1 flex-col gap-4 px-2 pb-2">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {statCards.map((card) => (
            <Card key={card.key} className="py-5 px-2">
              <CardHeader>
                <CardDescription>{card.label}</CardDescription>
                <CardTitle className="text-3xl font-mono tabular-nums">
                  {stats[card.key]}
                </CardTitle>
                <CardDescription className="text-xs">{card.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="flex-1 rounded-lg border border-base">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm font-medium">Recently updated</span>
            <Link route="articles.index" className="text-sm color-muted hover:color-base">
              All articles
            </Link>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center color-muted">
                    No articles yet. Write your first one!
                  </TableCell>
                </TableRow>
              )}
              {recent.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium">
                    <Link
                      route="articles.edit"
                      routeParams={{ id: article.id }}
                      className="hover:underline underline-offset-4"
                    >
                      {article.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant={article.isPublished ? 'success' : 'warning'}>
                      {article.isPublished ? 'Published' : 'Draft'}
                    </Badge>
                  </TableCell>
                  <TableCell className="color-muted">{article.locationName ?? '—'}</TableCell>
                  <TableCell className="text-right font-mono tabular-nums color-muted">
                    {formatDate(article.updatedAt)}
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

AdminDashboard.layout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>
