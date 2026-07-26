import { useRef, useState } from 'react'
import { CheckIcon, CopyIcon } from 'lucide-react'

interface CodeSnippetProps {
  language?: string
  filename?: string
  highlights?: number[]
  children: React.ReactNode
}

/**
 * Comark override for fenced code blocks (the `pre` tag).
 * Renders a framed snippet with a filename/language header and
 * a copy button. Syntax colors come from the shiki highlight plugin.
 *
 * ````markdown
 * ```ts [app/models/article.ts] {2}
 * const answer = 42
 * ```
 * ````
 */
export default function CodeSnippet({ language, filename, children }: CodeSnippetProps) {
  const preRef = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)

  async function copy() {
    const text = preRef.current?.innerText ?? ''
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="code-snippet group my-6 overflow-hidden rounded-lg border border-base bg-secondary">
      <div className="flex h-9 items-center gap-2 border-b border-base px-3">
        <span className="min-w-0 truncate font-mono text-xs color-muted">
          {filename ?? language ?? 'code'}
        </span>
        {filename && language && (
          <span className="font-mono text-xs color-faint">{language}</span>
        )}
        <button
          type="button"
          onClick={copy}
          aria-label="Copy code"
          className="ml-auto inline-flex size-6 cursor-pointer items-center justify-center rounded color-faint transition-colors hover:bg-hover hover:color-base"
        >
          {copied ? <CheckIcon className="size-3.5 color-scale-green" /> : <CopyIcon className="size-3.5" />}
        </button>
      </div>
      <pre ref={preRef} className="overflow-x-auto p-4 text-13px leading-relaxed font-mono">
        {children}
      </pre>
    </div>
  )
}
