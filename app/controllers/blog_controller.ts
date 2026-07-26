import Article from '#models/article'
import ArticleTransformer from '#transformers/article_transformer'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * Public, read-only pages of the blog. No authentication required.
 */
export default class BlogController {
  /**
   * Timeline of published articles
   */
  async index({ request, inertia }: HttpContext) {
    const page = Number(request.input('page', 1)) || 1
    const articles = await Article.query()
      .whereNotNull('publishedAt')
      .orderBy('publishedAt', 'desc')
      .paginate(page, 15)

    return inertia.render('home', {
      articles: ArticleTransformer.paginate(articles.all(), articles.getMeta()),
    })
  }

  /**
   * A single published article, looked up by slug
   */
  async show({ params, inertia }: HttpContext) {
    const article = await Article.query()
      .where('slug', params.slug)
      .whereNotNull('publishedAt')
      .firstOrFail()

    return inertia.render('blog/show', {
      article: ArticleTransformer.transform(article),
    })
  }

  /**
   * Globe view of every published article that has coordinates
   */
  async globe({ inertia }: HttpContext) {
    const articles = await Article.query()
      .whereNotNull('publishedAt')
      .whereNotNull('latitude')
      .whereNotNull('longitude')
      .orderBy('publishedAt', 'desc')

    return inertia.render('globe', {
      articles: ArticleTransformer.transform(articles),
    })
  }
}
