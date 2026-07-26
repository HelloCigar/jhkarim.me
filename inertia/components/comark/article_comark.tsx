import { ComarkClient } from '@comark/react'
import highlight from '@comark/react/plugins/highlight'
import BlogImage from './blog_image'
import CodeSnippet from './code_snippet'
import MarkdownImage from './markdown_image'
import { cn } from '~/lib/utils'

/**
 * Shared plugin/component wiring so the editor preview and the
 * public article page render markdown exactly the same way.
 */
const plugins = [highlight()]

const components = {
  'blog-image': BlogImage,
  'img': MarkdownImage,
  'pre': CodeSnippet,
}

interface ArticleComarkProps {
  children: string
  className?: string
  streaming?: boolean
}

export function ArticleComark({ children, className, streaming }: ArticleComarkProps) {
  return (
    <ComarkClient
      plugins={plugins}
      components={components}
      streaming={streaming}
      className={cn('article-prose', className)}
    >
      {children}
    </ComarkClient>
  )
}
