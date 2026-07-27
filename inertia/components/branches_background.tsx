import { useEffect, useRef } from 'react'

/**
 * Thin branches that grow in from the edges of the viewport and stop once they
 * run off it. Ported from the canvas sketch on antfu.me.
 *
 * The growth is breadth-first rather than recursive: every branch tip is a
 * pending step, and each frame drains the queue by one segment. Recursing
 * straight to the leaves would draw the finished tree in a single frame.
 */

const R180 = Math.PI
const R90 = Math.PI / 2
/** Widest a fork may turn away from its parent. */
const R15 = Math.PI / 12

/** Branches fork eagerly up to this depth, then thin out. */
const MIN_BRANCH = 30
/** Upper bound on one segment, in CSS pixels. */
const SEGMENT_LENGTH = 6
const FRAME_INTERVAL = 1000 / 40

/**
 * A flat grey stroked once and left alone - the alpha is baked into the pixels
 * as they are drawn, so adapting the colour to the theme would mean clearing
 * the canvas and regrowing the whole tree. The wrapper's opacity handles the
 * theme instead, which costs nothing and cannot interrupt the animation.
 */
const STROKE = '#88888840'

/** Clears the middle, where the article text sits, and keeps the edges. */
const MASK = 'radial-gradient(circle, transparent, black)'

type Step = () => void

function polarToCart(x: number, y: number, radius: number, theta: number) {
  return [x + radius * Math.cos(theta), y + radius * Math.sin(theta)] as const
}

function setupCanvas(canvas: HTMLCanvasElement, width: number, height: number) {
  const ctx = canvas.getContext('2d')!
  const dpi = window.devicePixelRatio || 1

  // Backing store at device resolution, CSS box at viewport resolution, so the
  // hairlines stay hairlines on a retina screen instead of blurring.
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  canvas.width = width * dpi
  canvas.height = height * dpi

  ctx.scale(dpi, dpi)
  ctx.lineWidth = 1
  ctx.strokeStyle = STROKE

  return ctx
}

export function BranchesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let frame = 0
    let resizeTimer = 0
    let width = 0
    let height = 0

    const start = () => {
      cancelAnimationFrame(frame)

      width = window.innerWidth
      height = window.innerHeight

      const ctx = setupCanvas(canvas, width, height)
      let steps: Step[] = []

      // `depth` is shared down a branch by reference, so a fork inherits how far
      // along the trunk it split off rather than starting its own count.
      const step = (x: number, y: number, rad: number, depth = { value: 0 }) => {
        const [nx, ny] = polarToCart(x, y, Math.random() * SEGMENT_LENGTH, rad)
        depth.value += 1

        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(nx, ny)
        ctx.stroke()

        // Off screen - let the branch die instead of growing forever.
        if (nx < -100 || nx > width + 100 || ny < -100 || ny > height + 100) return

        const rate = depth.value <= MIN_BRANCH ? 0.8 : 0.5
        if (Math.random() < rate) steps.push(() => step(nx, ny, rad + Math.random() * R15, depth))
        if (Math.random() < rate) steps.push(() => step(nx, ny, rad - Math.random() * R15, depth))
      }

      /** 0.2 - 0.8, keeping a trunk off the very corners of the screen. */
      const randomMiddle = () => Math.random() * 0.6 + 0.2

      steps = [
        () => step(randomMiddle() * width, -5, R90),
        () => step(randomMiddle() * width, height + 5, -R90),
        () => step(-5, randomMiddle() * height, 0),
        () => step(width + 5, randomMiddle() * height, R180),
      ]

      // Two trunks are plenty on a phone, and half the work.
      if (width < 500) steps = steps.slice(0, 2)

      if (reduceMotion) {
        // Resolve the whole tree in one pass and paint the result, still.
        while (steps.length) {
          const pending = steps
          steps = []
          pending.forEach((run) => run())
        }
        return
      }

      let last = performance.now()

      const tick = () => {
        frame = requestAnimationFrame(tick)
        if (performance.now() - last < FRAME_INTERVAL) return
        last = performance.now()

        if (!steps.length) {
          cancelAnimationFrame(frame)
          return
        }

        const pending = steps
        steps = []
        pending.forEach((run) => {
          // Half of the tips sit out the frame, which keeps the growing edge
          // ragged instead of advancing as one clean ring.
          if (Math.random() < 0.5) steps.push(run)
          else run()
        })
      }

      frame = requestAnimationFrame(tick)
    }

    const onResize = () => {
      // Mobile browsers fire resize as the address bar hides; regrowing the
      // whole tree over a sliver of height is more distracting than the gap.
      const grewSideways = window.innerWidth !== width
      const grewTall = Math.abs(window.innerHeight - height) > 120
      if (!grewSideways && !grewTall) return

      clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(start, 200)
    }

    start()
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  // No z-index on purpose. `html` and `body` both carry an opaque `bg-base`, and
  // nothing between them and here forms a stacking context, so a negative
  // z-index would drop this into the root context's negative layer - painted
  // before body's background and therefore buried by it. Left at `auto` it
  // paints with the other positioned boxes instead, above that background.
  // The layout renders this first and marks `main` relative, which is what puts
  // every page on top of it.
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 opacity-60 dark:opacity-100 print:hidden"
      style={{ maskImage: MASK, WebkitMaskImage: MASK }}
    >
      <canvas ref={canvasRef} />
    </div>
  )
}
