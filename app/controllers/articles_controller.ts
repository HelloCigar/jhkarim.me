import Article from '#models/article'
import ArticlePolicy from '#policies/article_policy'
import ArticleTransformer from '#transformers/article_transformer'
import {
  createArticleValidator,
  listArticleValidator,
  updateArticleValidator,
} from '#validators/article'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

/**
 * Admin CRUD for blog articles. Every action is authorized through
 * the class based ArticlePolicy (AdonisJS Bouncer).
 */
export default class ArticlesController {
  /**
   * Display a list of articles in the admin area
   */
  async index({ request, inertia, bouncer }: HttpContext) {
    await bouncer.with(ArticlePolicy).authorize('viewList')

    const { page = 1, perPage = 30 } = await request.validateUsing(listArticleValidator)
    const articles = await Article.query().orderBy('createdAt', 'desc').paginate(page, perPage)

    return inertia.render('admin/articles/index', {
      articles: ArticleTransformer.paginate(articles.all(), articles.getMeta()),
    })
  }

  /**
   * Render the editor for a new article
   */
  async create({ inertia, bouncer }: HttpContext) {
    await bouncer.with(ArticlePolicy).authorize('create')

    return inertia.render('admin/articles/editor', { article: null })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, auth, bouncer, session }: HttpContext) {
    await bouncer.with(ArticlePolicy).authorize('create')

    const user = await auth.getUserOrFail()
    const { published, ...data } = await request.validateUsing(createArticleValidator)

    const article = await Article.create({
      ...data,
      content: data.content ?? '',
      userId: user.id,
      publishedAt: published ? DateTime.now() : null,
    })

    session.flash('success', 'Article created')
    return response.redirect().toRoute('articles.edit', { id: article.id })
  }

  /**
   * Redirect the resource show route to the editor
   */
  async show({ params, response }: HttpContext) {
    return response.redirect().toRoute('articles.edit', { id: params.id })
  }

  /**
   * Render the editor for an existing article
   */
  async edit({ params, inertia, bouncer }: HttpContext) {
    const article = await Article.findOrFail(params.id)
    await bouncer.with(ArticlePolicy).authorize('edit', article)

    return inertia.render('admin/articles/editor', {
      article: ArticleTransformer.transform(article),
    })
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response, bouncer, session }: HttpContext) {
    const article = await Article.findOrFail(params.id)
    await bouncer.with(ArticlePolicy).authorize('edit', article)

    const { published, ...data } = await request.validateUsing(updateArticleValidator)

    article.merge({
      ...data,
      content: data.content ?? '',
      excerpt: data.excerpt ?? null,
      coverImage: data.coverImage ?? null,
      locationName: data.locationName ?? null,
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
      publishedAt: published ? (article.publishedAt ?? DateTime.now()) : null,
    })
    await article.save()

    session.flash('success', 'Article updated')
    return response.redirect().toRoute('articles.edit', { id: article.id })
  }

  /**
   * Delete an article
   */
  async destroy({ params, response, bouncer, session }: HttpContext) {
    const article = await Article.findOrFail(params.id)
    await bouncer.with(ArticlePolicy).authorize('delete', article)

    await article.delete()

    session.flash('success', 'Article deleted')
    return response.redirect().toRoute('articles.index')
  }
}
