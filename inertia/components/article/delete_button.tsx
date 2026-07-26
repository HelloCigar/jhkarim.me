import { Data } from '@generated/data'
import { Trash2Icon } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog'
import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'

interface Props {
  article: Data.Article
}

export default function ArticleDeleteButton({ article }: Props) {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="destructive-outline" size="icon-sm" />}>
        <Trash2Icon />
      </AlertDialogTrigger>
      <AlertDialogPopup className="sm:max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete article</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete &quot;{article.title}&quot;. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogClose render={<Button variant="ghost" />}>Cancel</AlertDialogClose>
          <Form route="articles.destroy" routeParams={{ id: article.id }}>
            {({ processing }) => (
              <Button variant="destructive" type="submit" disabled={processing}>
                Delete
              </Button>
            )}
          </Form>
        </AlertDialogFooter>
      </AlertDialogPopup>
    </AlertDialog>
  )
}
