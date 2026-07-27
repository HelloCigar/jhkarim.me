import DashboardLayout from '~/layouts/dashboard'
import { Data } from '@generated/data'
import { Link } from '@adonisjs/inertia/react'
import {
  ArrowLeftIcon,
  BoldIcon,
  ClipboardCopyIcon,
  ExternalLinkIcon,
  FileCodeIcon,
  Heading2Icon,
  Heading3Icon,
  ImagePlusIcon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  CodeIcon,
  MapPinIcon,
  StrikethroughIcon,
  TextQuoteIcon,
  UploadIcon,
} from 'lucide-react'
import { useRef, useState } from 'react'
import { ArticleComark } from '~/components/comark/article_comark'
import { Button } from '~/components/ui/button'
import { Field, FieldError, FieldLabel } from '~/components/ui/field'
import { Form } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Separator } from '~/components/ui/separator'
import { SidebarTrigger } from '~/components/ui/sidebar'
import { Spinner } from '~/components/ui/spinner'
import { Switch } from '~/components/ui/switch'
import { toastManager } from '~/components/ui/toast'
import { geocode, type GeocodeResult } from '~/lib/geocode'
import { pickImage, uploadImage } from '~/lib/upload'
import { InertiaProps } from '~/types'
import { Head } from '@inertiajs/react';

type PageProps = InertiaProps<{ article: Data.Article | null }>

const NEW_ARTICLE_TEMPLATE = `# A new adventure

Write your story here. Standard **markdown** works, and so do the
custom components below.

::blog-image{src="" alt="" caption="A picture is worth a thousand words"}
::

\`\`\`ts [example.ts]
export const hello = 'world'
\`\`\`
`

function slugify(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function ToolbarButton({ title, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      title={title}
      aria-label={title}
      {...props}
    />
  )
}

export default function ArticleEditor({ article }: PageProps) {
  const isEdit = article !== null

  const [title, setTitle] = useState(article?.title ?? '')
  const [slug, setSlug] = useState(article?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(isEdit)
  const [content, setContent] = useState(article?.content ?? NEW_ARTICLE_TEMPLATE)
  const [coverImage, setCoverImage] = useState(article?.coverImage ?? '')
  const [published, setPublished] = useState(article?.isPublished ?? false)
  const [uploading, setUploading] = useState(false)

  const [locationName, setLocationName] = useState(article?.locationName ?? '')
  const [latitude, setLatitude] = useState(article?.latitude?.toString() ?? '')
  const [longitude, setLongitude] = useState(article?.longitude?.toString() ?? '')
  const [geocoding, setGeocoding] = useState(false)
  const [matches, setMatches] = useState<GeocodeResult[]>([])

  const contentRef = useRef<HTMLTextAreaElement>(null)

  function updateTitle(value: string) {
    setTitle(value)
    if (!slugTouched) setSlug(slugify(value))
  }

  function applyEdit(next: string, selectionStart: number, selectionEnd: number) {
    setContent(next)
    requestAnimationFrame(() => {
      const textarea = contentRef.current
      if (!textarea) return
      textarea.focus()
      textarea.setSelectionRange(selectionStart, selectionEnd)
    })
  }

  function insertAtCursor(snippet: string) {
    const textarea = contentRef.current
    if (!textarea) return

    const start = textarea.selectionStart ?? content.length
    const end = textarea.selectionEnd ?? content.length
    const next = content.slice(0, start) + snippet + content.slice(end)
    const cursor = start + snippet.length
    applyEdit(next, cursor, cursor)
  }

  /**
   * Wrap the current selection (or a placeholder) with markdown markers,
   * e.g. wrapSelection('**') makes the selection bold.
   */
  function wrapSelection(prefix: string, suffix = prefix, placeholder = 'text') {
    const textarea = contentRef.current
    if (!textarea) return

    const start = textarea.selectionStart ?? content.length
    const end = textarea.selectionEnd ?? content.length
    const selected = content.slice(start, end) || placeholder
    const next = content.slice(0, start) + prefix + selected + suffix + content.slice(end)
    applyEdit(next, start + prefix.length, start + prefix.length + selected.length)
  }

  /**
   * Prefix every line touched by the selection, e.g. prefixLines('- ')
   * turns the selection into a bullet list. `numbered` uses "1. 2. 3."
   */
  function prefixLines(prefix: string, numbered = false) {
    const textarea = contentRef.current
    if (!textarea) return

    const start = textarea.selectionStart ?? 0
    const end = textarea.selectionEnd ?? 0
    const lineStart = content.lastIndexOf('\n', start - 1) + 1
    const lineEndIndex = content.indexOf('\n', end)
    const lineEnd = lineEndIndex === -1 ? content.length : lineEndIndex

    const block = content.slice(lineStart, lineEnd)
    const prefixed = block
      .split('\n')
      .map((line, i) => (numbered ? `${i + 1}. ${line}` : `${prefix}${line}`))
      .join('\n')

    const next = content.slice(0, lineStart) + prefixed + content.slice(lineEnd)
    applyEdit(next, lineStart, lineStart + prefixed.length)
  }

  function insertLink() {
    const textarea = contentRef.current
    if (!textarea) return

    const start = textarea.selectionStart ?? content.length
    const end = textarea.selectionEnd ?? content.length
    const selected = content.slice(start, end) || 'link text'
    const next = `${content.slice(0, start)}[${selected}](url)${content.slice(end)}`
    const urlStart = start + selected.length + 3
    applyEdit(next, urlStart, urlStart + 3)
  }

  function onEditorKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (!event.ctrlKey && !event.metaKey) return

    const key = event.key.toLowerCase()
    if (key === 'b') {
      event.preventDefault()
      wrapSelection('**')
    } else if (key === 'i') {
      event.preventDefault()
      wrapSelection('*')
    } else if (key === 'k') {
      event.preventDefault()
      insertLink()
    }
  }

  async function insertImage() {
    const file = await pickImage()
    if (!file) return

    setUploading(true)
    try {
      const url = await uploadImage(file)
      insertAtCursor(`\n::blog-image{src="${url}" alt="" caption=""}\n::\n`)
    } catch (error) {
      toastManager.add({
        type: 'error',
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Could not upload the image',
      })
    } finally {
      setUploading(false)
    }
  }

  function insertCodeSnippet() {
    insertAtCursor('\n```ts [example.ts]\nconst answer = 42\n```\n')
  }

  /**
   * Upload an image and put its URL on the clipboard, so it can be
   * pasted anywhere (cover image field, markdown, another article...).
   */
  async function uploadAndCopy() {
    const file = await pickImage()
    if (!file) return

    setUploading(true)
    try {
      const url = await uploadImage(file)
      try {
        await navigator.clipboard.writeText(url)
        toastManager.add({
          type: 'success',
          title: 'Image uploaded',
          description: `URL copied to clipboard: ${url}`,
        })
      } catch {
        toastManager.add({
          type: 'success',
          title: 'Image uploaded',
          description: `Could not access the clipboard — the URL is ${url}`,
        })
      }
    } catch (error) {
      toastManager.add({
        type: 'error',
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Could not upload the image',
      })
    } finally {
      setUploading(false)
    }
  }

  async function uploadCover() {
    const file = await pickImage()
    if (!file) return

    setUploading(true)
    try {
      setCoverImage(await uploadImage(file))
    } catch (error) {
      toastManager.add({
        type: 'error',
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Could not upload the image',
      })
    } finally {
      setUploading(false)
    }
  }

  function applyMatch(match: GeocodeResult) {
    setLocationName(match.label)
    setLatitude(match.latitude.toString())
    setLongitude(match.longitude.toString())
    setMatches([])
  }

  /**
   * Resolve the location field into coordinates. A single hit is
   * unambiguous and fills straight in, anything else is offered as a list
   * to pick from — there are a lot of Londons.
   */
  async function findCoordinates() {
    const query = locationName.trim()
    if (query.length < 2) return

    setGeocoding(true)
    setMatches([])
    try {
      const results = await geocode(query)

      if (results.length === 0) {
        toastManager.add({
          type: 'error',
          title: 'No match',
          description: `Could not find "${query}"`,
        })
      } else if (results.length === 1) {
        applyMatch(results[0])
      } else {
        setMatches(results)
      }
    } catch (error) {
      toastManager.add({
        type: 'error',
        title: 'Lookup failed',
        description: error instanceof Error ? error.message : 'Could not look up the location',
      })
    } finally {
      setGeocoding(false)
    }
  }

  const formProps = article
    ? ({ route: 'articles.update', routeParams: { id: article.id } } as const)
    : ({ route: 'articles.store' } as const)

  // Desktop is a locked app-like split view; on smaller screens the page
  // scrolls normally so the editor and preview each get real height.
  return (

    <Form {...formProps} className="flex min-h-dvh flex-col gap-0 lg:h-dvh">
      {({ processing }) => (
        <>
        <Head title={article ? `Edit: ${article.title}` : 'New Article'}></Head>
          <header className="flex h-15 shrink-0 items-center gap-2 px-3">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Button
              variant="ghost"
              size="icon-sm"
              render={<Link route="articles.index" />}
              aria-label="Back to articles"
            >
              <ArrowLeftIcon />
            </Button>
            <span className="min-w-0 truncate text-sm font-medium">
              {article ? `Edit: ${article.title}` : 'New article'}
            </span>
            {article && published && (
              <Link
                route="blog.show"
                routeParams={{ slug: article.slug }}
                className="inline-flex items-center gap-1 text-xs color-muted hover:color-base"
              >
                <ExternalLinkIcon className="size-3.5" />
                View
              </Link>
            )}
            <div className="ml-auto flex items-center gap-4">
              <Label className="flex items-center gap-2 text-sm color-muted">
                <Switch checked={published} onCheckedChange={setPublished} />
                Published
              </Label>
              <input type="hidden" name="published" value={published ? 'true' : 'false'} />
              <Button type="submit" disabled={processing || uploading}>
                {processing ? (
                  <>
                    <Spinner />
                    Saving...
                  </>
                ) : (
                  'Save'
                )}
              </Button>
            </div>
          </header>

          <div className="grid shrink-0 grid-cols-1 gap-x-4 gap-y-3 px-4 pb-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field name="title">
              <FieldLabel>Title</FieldLabel>
              <Input value={title} onChange={(e) => updateTitle(e.target.value)} />
              <FieldError />
            </Field>
            <Field name="slug">
              <FieldLabel>Slug</FieldLabel>
              <Input
                value={slug}
                className="font-mono"
                onChange={(e) => {
                  setSlugTouched(true)
                  setSlug(e.target.value)
                }}
              />
              <FieldError />
            </Field>
            <Field name="excerpt" className="sm:col-span-2">
              <FieldLabel>Excerpt</FieldLabel>
              <Input
                defaultValue={article?.excerpt ?? ''}
                placeholder="One or two sentences shown on the timeline"
              />
              <FieldError />
            </Field>
            <Field name="coverImage">
              <FieldLabel>Cover image</FieldLabel>
              <div className="flex gap-2">
                <Input
                  value={coverImage}
                  className="font-mono"
                  placeholder="/uploads/..."
                  onChange={(e) => setCoverImage(e.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={uploadCover}
                  disabled={uploading}
                  aria-label="Upload cover image"
                >
                  <UploadIcon />
                </Button>
              </div>
              <FieldError />
            </Field>
            <Field name="locationName" className="relative">
              <FieldLabel>Location</FieldLabel>
              <div className="flex w-full gap-2">
                <Input
                  value={locationName}
                  placeholder="Manila, Philippines"
                  onChange={(e) => setLocationName(e.target.value)}
                  onKeyDown={(e) => {
                    // Enter would submit the whole article, look up instead
                    if (e.key !== 'Enter') return
                    e.preventDefault()
                    findCoordinates()
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={findCoordinates}
                  disabled={geocoding || locationName.trim().length < 2}
                  title="Find coordinates"
                  aria-label="Find coordinates for this location"
                >
                  {geocoding ? <Spinner /> : <MapPinIcon />}
                </Button>
              </div>
              <FieldError />
              {matches.length > 0 && (
                <ul className="absolute top-full z-10 mt-1 w-full overflow-hidden rounded border border-base bg-base shadow-lg">
                  {matches.map((match) => (
                    <li key={`${match.latitude},${match.longitude}`}>
                      <button
                        type="button"
                        className="flex w-full flex-col items-start px-3 py-2 text-left hover:bg-hover"
                        onClick={() => applyMatch(match)}
                      >
                        <span className="text-sm color-base">{match.label}</span>
                        <span className="font-mono text-xs color-muted tabular-nums">
                          {match.latitude.toFixed(4)}, {match.longitude.toFixed(4)}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </Field>
            <Field name="latitude">
              <FieldLabel>Latitude</FieldLabel>
              <Input
                type="number"
                step="any"
                min={-90}
                max={90}
                className="font-mono tabular-nums"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="14.5995"
              />
              <FieldError />
            </Field>
            <Field name="longitude">
              <FieldLabel>Longitude</FieldLabel>
              <Input
                type="number"
                step="any"
                min={-180}
                max={180}
                className="font-mono tabular-nums"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="120.9842"
              />
              <FieldError />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-2 px-2 pb-2 lg:min-h-0 lg:flex-1 lg:grid-cols-2">
            <div className="flex min-h-0 flex-col overflow-hidden rounded-lg border border-base">
              <div className="flex h-10 shrink-0 items-center gap-0.5 overflow-x-auto border-b border-base px-2">
                <ToolbarButton title="Bold (Ctrl+B)" onClick={() => wrapSelection('**')}>
                  <BoldIcon />
                </ToolbarButton>
                <ToolbarButton title="Italic (Ctrl+I)" onClick={() => wrapSelection('*')}>
                  <ItalicIcon />
                </ToolbarButton>
                <ToolbarButton title="Strikethrough" onClick={() => wrapSelection('~~')}>
                  <StrikethroughIcon />
                </ToolbarButton>
                <ToolbarButton title="Inline code" onClick={() => wrapSelection('`', '`', 'code')}>
                  <CodeIcon />
                </ToolbarButton>

                <Separator orientation="vertical" className="mx-1 data-[orientation=vertical]:h-4" />

                <ToolbarButton title="Heading 2" onClick={() => prefixLines('## ')}>
                  <Heading2Icon />
                </ToolbarButton>
                <ToolbarButton title="Heading 3" onClick={() => prefixLines('### ')}>
                  <Heading3Icon />
                </ToolbarButton>

                <Separator orientation="vertical" className="mx-1 data-[orientation=vertical]:h-4" />

                <ToolbarButton title="Link (Ctrl+K)" onClick={insertLink}>
                  <LinkIcon />
                </ToolbarButton>
                <ToolbarButton title="Quote" onClick={() => prefixLines('> ')}>
                  <TextQuoteIcon />
                </ToolbarButton>
                <ToolbarButton title="Bullet list" onClick={() => prefixLines('- ')}>
                  <ListIcon />
                </ToolbarButton>
                <ToolbarButton title="Numbered list" onClick={() => prefixLines('', true)}>
                  <ListOrderedIcon />
                </ToolbarButton>

                <Separator orientation="vertical" className="mx-1 data-[orientation=vertical]:h-4" />

                <ToolbarButton title="Code block" onClick={insertCodeSnippet}>
                  <FileCodeIcon />
                </ToolbarButton>
                <ToolbarButton
                  title="Upload image & insert at cursor"
                  onClick={insertImage}
                  disabled={uploading}
                >
                  {uploading ? <Spinner /> : <ImagePlusIcon />}
                </ToolbarButton>

                <div className="ml-auto">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={uploadAndCopy}
                    disabled={uploading}
                    title="Upload an image and copy its URL to the clipboard"
                  >
                    {uploading ? <Spinner /> : <ClipboardCopyIcon />}
                    Upload & copy URL
                  </Button>
                </div>
              </div>
              <textarea
                ref={contentRef}
                name="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={onEditorKeyDown}
                spellCheck={false}
                className="min-h-0 flex-1 resize-none bg-base p-4 font-mono text-13px leading-relaxed color-base outline-none placeholder:color-faint"
                placeholder="Write your article in markdown..."
              />
            </div>

            <div className="flex min-h-0 flex-col overflow-hidden rounded-lg border border-base">
              <div className="flex h-10 shrink-0 items-center border-b border-base px-3">
                <span className="text-xs font-medium color-muted">Preview</span>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
                <ArticleComark streaming>{content}</ArticleComark>
              </div>
            </div>
          </div>
        </>
      )}
    </Form>
  )
}

ArticleEditor.layout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>
