import env from '#start/env'
import cache from '@adonisjs/cache/services/main'
import redis from '@adonisjs/redis/services/main'
import string from '@adonisjs/core/helpers/string'
import { Exception } from '@adonisjs/core/exceptions'

const ENDPOINT = 'https://api.openweathermap.org/geo/1.0/direct'

/**
 * OpenWeather allows 60 calls per minute on the free plan. The window is
 * tracked as a sorted set of call timestamps so a burst that straddles two
 * clock minutes cannot slip through, the way it would with a fixed window.
 */
const RATE_LIMIT_KEY = 'geocoding:calls'
const RATE_LIMIT = 60
const RATE_WINDOW_MS = 60_000

const REQUEST_TIMEOUT_MS = 5_000

/**
 * Coordinates of a place do not move, so lookups are cached aggressively.
 * Repeat searches for the same query never touch the upstream quota.
 */
const CACHE_TTL = '30d'

/**
 * Shape of a single entry in the direct geocoding response. Only the fields
 * we care about are declared, "state" is absent for many countries.
 */
type OpenWeatherLocation = {
  name: string
  lat: number
  lon: number
  country: string
  state?: string
}

export type GeocodingResult = {
  name: string
  state: string | null
  country: string
  latitude: number
  longitude: number
  /**
   * Human readable "City, State, Country" used to label the suggestions
   */
  label: string
}

export class GeocodingRateLimitException extends Exception {
  static status = 429
  static code = 'E_GEOCODING_RATE_LIMIT'
  static message = 'Too many location lookups. Please try again in a minute.'
}

export class GeocodingUnavailableException extends Exception {
  static status = 502
  static code = 'E_GEOCODING_UNAVAILABLE'
  static message = 'The geocoding service is unavailable. Please try again later.'
}

/**
 * Turns a location name into coordinates through the OpenWeather
 * geocoding API, so the article editor can autofill latitude/longitude.
 */
export default class GeocodingService {
  /**
   * Look up a place by name. Returns an empty array when nothing matches.
   */
  async search(query: string, limit: number): Promise<GeocodingResult[]> {
    const normalized = this.#normalize(query)
    if (normalized.length === 0) return []

    return cache.getOrSet({
      key: `geocode:${normalized}:${limit}`,
      ttl: CACHE_TTL,
      tags: ['geocoding'],
      factory: () => this.#lookup(normalized, limit),
    })
  }

  /**
   * Collapse whitespace and casing so that "Manila,  PH" and "manila, ph"
   * resolve to the same cache entry.
   */
  #normalize(query: string) {
    return query
      .trim()
      .replace(/\s*,\s*/g, ',')
      .replace(/\s+/g, ' ')
      .toLowerCase()
  }

  /**
   * Perform the upstream call. Only reached on a cache miss, so a token is
   * spent per real network call rather than per user search.
   */
  async #lookup(query: string, limit: number): Promise<GeocodingResult[]> {
    if (!(await this.#consumeToken())) {
      throw new GeocodingRateLimitException()
    }

    const url = new URL(ENDPOINT)
    url.searchParams.set('q', query)
    url.searchParams.set('limit', String(limit))
    url.searchParams.set('appid', env.get('GEOCODING_API_KEY'))

    let response: Response
    try {
      response = await fetch(url, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) })
    } catch {
      throw new GeocodingUnavailableException()
    }

    /**
     * Upstream also rate limits, surface that as a 429 rather than a 502
     * so the client can tell the two apart.
     */
    if (response.status === 429) throw new GeocodingRateLimitException()
    if (!response.ok) throw new GeocodingUnavailableException()

    const locations = (await response.json()) as OpenWeatherLocation[]

    return locations.map((location) => ({
      name: location.name,
      state: location.state ?? null,
      country: location.country,
      latitude: location.lat,
      longitude: location.lon,
      label: [location.name, location.state, location.country].filter(Boolean).join(', '),
    }))
  }

  /**
   * Drop the calls that aged out of the window, then take a slot if the
   * budget allows it. Returns false when the minute is already spent.
   */
  async #consumeToken(): Promise<boolean> {
    const now = Date.now()

    await redis.zremrangebyscore(RATE_LIMIT_KEY, 0, now - RATE_WINDOW_MS)

    const used = await redis.zcard(RATE_LIMIT_KEY)
    if (used >= RATE_LIMIT) return false

    await redis.zadd(RATE_LIMIT_KEY, now, `${now}:${string.random(8)}`)
    await redis.pexpire(RATE_LIMIT_KEY, RATE_WINDOW_MS)

    return true
  }
}
