import { useLayoutEffect, useRef } from 'react'
import { Link } from '@adonisjs/inertia/react'

/**
 * Animated "jhkarim" signature. The stroke length is measured on mount so the
 * draw-in animation (see .signature-text in app.css) traces the actual glyph
 * outlines instead of an approximated dash length.
 */
export function Logo({
  width = 100,
  height = 24,
  className,
}: {
  width?: number
  height?: number
  className?: string
}) {
  const textRef = useRef<SVGTextElement>(null)

  useLayoutEffect(() => {
    const length = textRef.current?.getComputedTextLength()
    if (length) textRef.current?.style.setProperty('--signature-length', String(length))
  }, [])

  return (
    <Link route="home">
      {/* `width`/`height` are the fallback size; a `className` sizing the svg
          overrides them, so the mark can scale per breakpoint. */}
      <svg
        width={width}
        height={height}
        viewBox="0 0 190 50"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        <text
          ref={textRef}
          x="95"
          y="36"
          textAnchor="middle"
          fontSize="32"
          fontFamily="'Segoe Script', 'Bradley Hand', 'Brush Script MT', cursive"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="signature-text"
        >
          jhkarim
        </text>
      </svg>
    </Link>
  )
}
