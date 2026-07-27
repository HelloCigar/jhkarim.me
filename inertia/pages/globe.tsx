import DefaultLayout from '~/layouts/default'
import { Head, router } from '@inertiajs/react'
import { Data } from '@generated/data'
import { useEffect, useMemo, useRef } from 'react'
import { cellToLatLng, latLngToCell } from 'h3-js'
import type { GlobeInstance } from 'globe.gl'
import { urlFor } from '~/client'
import { formatDate } from '~/lib/format'
import { InertiaProps } from '~/types'
import { useTheme, type Theme } from '~/hooks/use_theme'

type PageProps = InertiaProps<{ articles: Data.Article[] }>

/**
 * H3 resolution of the land dot grid. Article markers are snapped to this same
 * grid so a highlighted marker sits exactly on a land dot instead of floating
 * somewhere between them.
 */
const HEX_RESOLUTION = 3

/** The globe opens on the Philippines rather than spinning. */
const INITIAL_POINT_OF_VIEW = { lat: 12.8797, lng: 121.774, altitude: 2 }

const globeThemes = {
  light: { land: '#8497b4', marker: '#b91c1c' },
  dark: { land: '#264a70', marker: '#f59e0b' },
} as const satisfies Record<Theme, { land: string; marker: string }>

/** A dot on the grid that has at least one article tagged to it. */
type Marker = { lat: number; lng: number; articles: Data.Article[] }

/**
 * Reads an element's own background as plain sRGB. This paints the colour onto
 * a canvas rather than handing the computed string straight to three.js: UnoCSS
 * compiles these to `color-mix(in oklab, ...)`, which computes to an `oklab()`
 * string that THREE.Color cannot parse - it silently leaves the colour black.
 * Rasterising it means any colour the browser understands survives the trip.
 */
function readBackgroundColor(element: HTMLElement) {
  const context = document.createElement('canvas').getContext('2d')
  if (!context) return '#000000'

  context.fillStyle = getComputedStyle(element).backgroundColor
  context.fillRect(0, 0, 1, 1)
  const [r, g, b] = context.getImageData(0, 0, 1, 1).data

  return `rgb(${r}, ${g}, ${b})`
}

/**
 * The sphere takes the container's own background colour, so it reads as empty
 * space and only the dots describe the land - it still occludes the far side of
 * the globe, which is what gives the flat dot field its sense of depth. Reading
 * it back off the element keeps that colour defined in exactly one place, the
 * stylesheet, rather than duplicated here.
 */
function applyGlobeTheme(globe: GlobeInstance, container: HTMLElement, theme: Theme) {
  const { land, marker } = globeThemes[theme]

  // No texture is ever set, so the globe keeps its default (coloured) material.
  globe.globeMaterial().color.set(readBackgroundColor(container))
  globe.hexPolygonColor(() => land).pointColor(() => marker)
}

/**
 * Collapses articles onto the dot grid. Two articles in the same city share a
 * cell at this resolution, so they have to share a dot - otherwise they would
 * stack in the exact same spot with only the top one hoverable.
 */
function buildMarkers(articles: Data.Article[]): Marker[] {
  const byCell = new Map<string, Marker>()

  for (const article of articles) {
    const { latitude, longitude } = article
    if (latitude === null || longitude === null) continue

    const cell = latLngToCell(latitude, longitude, HEX_RESOLUTION)
    let marker = byCell.get(cell)

    if (!marker) {
      const [lat, lng] = cellToLatLng(cell)
      marker = { lat, lng, articles: [] }
      byCell.set(cell, marker)
    }

    marker.articles.push(article)
  }

  return [...byCell.values()]
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

/** Entries past this are summarised, so a busy dot cannot outgrow the viewport. */
const TOOLTIP_MAX_ENTRIES = 4

function articleHtml(article: Data.Article, withImage: boolean) {
  const image =
    withImage && article.coverImage
      ? `<img src="${escapeHtml(article.coverImage)}" alt="" />`
      : ''
  const location = article.locationName
    ? `<div class="globe-tooltip-location">${escapeHtml(article.locationName)}</div>`
    : ''

  return `
    <div class="globe-tooltip-entry">
      ${image}
      <div class="globe-tooltip-title">${escapeHtml(article.title)}</div>
      ${location}
      <div class="globe-tooltip-date">${formatDate(article.publishedAt)}</div>
    </div>
  `
}

function tooltipHtml({ articles }: Marker) {
  // Cover images only when the dot holds a single article - stacking several
  // full cards would run the tooltip off the bottom of the screen.
  const shown = articles.slice(0, TOOLTIP_MAX_ENTRIES)
  const entries = shown.map((article) => articleHtml(article, articles.length === 1)).join('')
  const remaining = articles.length - shown.length
  const more =
    remaining > 0 ? `<div class="globe-tooltip-more">+${remaining} more</div>` : ''

  return `<div class="globe-tooltip">${entries}${more}</div>`
}

export default function GlobePage({ articles }: PageProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const globeRef = useRef<GlobeInstance | undefined>(undefined)
  const { theme } = useTheme()

  const markers = useMemo(() => buildMarkers(articles), [articles])

  // Read by the async globe factory below, which may resolve after a theme flip
  const themeRef = useRef(theme)
  themeRef.current = theme

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let globe: GlobeInstance | undefined
    let disposed = false

    const observer = new ResizeObserver(() => {
      if (globe && container) {
        globe.width(container.clientWidth).height(container.clientHeight)
      }
    })

    Promise.all([
      import('globe.gl'),
      fetch('/geo/land-110m.json').then((res) => res.json() as Promise<{ features: object[] }>),
    ]).then(([{ default: Globe }, land]) => {
      if (disposed || !container) return

      globe = new Globe(container)
        .backgroundColor('rgba(0,0,0,0)')
        .width(container.clientWidth)
        .height(container.clientHeight)
        .showAtmosphere(false)
        .hexPolygonsData(land.features)
        .hexPolygonResolution(HEX_RESOLUTION)
        .hexPolygonUseDots(true)
        .hexPolygonMargin(0.3)
        .hexPolygonAltitude(0.002)
        // The transition rebuilds every merged dot geometry on each frame, which
        // is far too expensive at this dot count - build them once instead.
        .hexPolygonsTransitionDuration(0)
        .pointsData(markers as unknown as object[])
        .pointLat((d) => (d as Marker).lat)
        .pointLng((d) => (d as Marker).lng)
        .pointAltitude(0.012)
        .pointRadius(0.5)
        .pointResolution(16)
        .pointLabel((d) => tooltipHtml(d as Marker))
        .onPointClick((d) => {
          const [article] = (d as Marker).articles
          if (article) router.visit(urlFor('blog.show', { slug: article.slug }))
        })

      // Keep only a flat white ambient light, reusing the one globe.gl already
      // built. The default directional light would shade a whole hemisphere of
      // dots; here every dot reads the same wherever it sits on the sphere.
      const [ambient] = globe.lights()
      ambient.color.set(0xffffff)
      ambient.intensity = Math.PI
      globe.lights([ambient])

      applyGlobeTheme(globe, container, themeRef.current)
      globeRef.current = globe

      globe.pointOfView(INITIAL_POINT_OF_VIEW, 0)

      observer.observe(container)
    })

    return () => {
      disposed = true
      observer.disconnect()
      globeRef.current = undefined
      globe?._destructor()
    }
  }, [markers])

  useEffect(() => {
    const container = containerRef.current
    if (globeRef.current && container) applyGlobeTheme(globeRef.current, container, theme)
  }, [theme])

  return (
    <div className="relative h-[calc(100dvh-4.5rem)] overflow-hidden">
      <Head title="Globe" />
      {/* The sphere is painted this exact colour, so the globe has no edge. */}
      <div ref={containerRef} className="absolute inset-0 bg-#e8eef7 dark:bg-#020409" />

      <div className="pointer-events-none absolute inset-x-4 top-4 z-nav rounded-lg border border-base bg-base/80 p-4 backdrop-blur sm:inset-x-auto sm:left-5 sm:top-5 sm:max-w-70">
        <h1 className="text-lg font-medium">Around the world</h1>
        <p className="mt-1 text-sm color-muted">
          Every article written somewhere on the map. Hover a highlighted dot for a peek, click
          it to read.
        </p>
        <p className="mt-2 font-mono tabular-nums text-xs color-faint">
          {markers.length} {markers.length === 1 ? 'place' : 'places'}
        </p>
      </div>
    </div>
  )
}

// The sphere's own surface covers the viewport, so the branch canvas behind it
// would only ever be wasted frames.
GlobePage.layout = (page: React.ReactElement) => (
  <DefaultLayout background={false}>{page}</DefaultLayout>
)
