import Article from '#models/article'
import ArticlePolicy from '#policies/article_policy'
import ArticleTransformer from '#transformers/article_transformer'
import type { HttpContext } from '@adonisjs/core/http'

export default class AdminController {
  /**
   * Blog dashboard: article stats and the latest entries
   */
  async index({ inertia, bouncer }: HttpContext) {
    await bouncer.with(ArticlePolicy).authorize('viewList')

    const [total, published, located, recent] = await Promise.all([
      Article.query().count('* as total').firstOrFail(),
      Article.query().whereNotNull('publishedAt').count('* as total').firstOrFail(),
      Article.query()
        .whereNotNull('latitude')
        .whereNotNull('longitude')
        .count('* as total')
        .firstOrFail(),
      Article.query().orderBy('updatedAt', 'desc').limit(5),
    ])

    const totalCount = Number(total.$extras.total)
    const publishedCount = Number(published.$extras.total)

    return inertia.render('admin/dashboard', {
      stats: {
        total: totalCount,
        published: publishedCount,
        drafts: totalCount - publishedCount,
        located: Number(located.$extras.total),
      },
      recent: ArticleTransformer.transform(recent),
    })
  }
}
