import ArticlePolicy from '#policies/article_policy'
import GeocodingService from '#services/geocoding_service'
import { geocodeValidator } from '#validators/geocoding'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * Place name lookup backing the location field of the article editor.
 *
 * Gated behind the article policy on purpose: the upstream quota is tied
 * to a single API key, so this must not be reachable by the public.
 */
@inject()
export default class GeocodingController {
  constructor(private geocoding: GeocodingService) {}

  async search({ request, response, bouncer }: HttpContext) {
    await bouncer.with(ArticlePolicy).authorize('create')

    const { q, limit = 5 } = await request.validateUsing(geocodeValidator)

    return response.json({ results: await this.geocoding.search(q, limit) })
  }
}
