import { client } from '~/client'

export type GeocodeResult = {
  name: string
  state: string | null
  country: string
  latitude: number
  longitude: number
  label: string
}

/**
 * Look up coordinates for a place name through the admin geocoding
 * endpoint. Returns the matches, ordered by upstream relevance.
 */
export async function geocode(query: string): Promise<GeocodeResult[]> {
  const [data, err] = await client.api.geocoding.search({ query: { q: query, limit: 5 } }).safe()

  if (err) {
    if (err.isValidationError())
      throw new Error(err.response.errors.map((e) => e.message).join(', '))
    if (err.isStatus(429)) throw new Error('Too many lookups. Try again in a minute.')
    if (err.isStatus(403)) throw new Error('Not allowed')
    throw new Error('Could not reach the geocoding service')
  }

  return data.results
}
