import { BaseTransformer } from '@adonisjs/core/transformers'
import Article from '#models/article'

export default class ArticleTransformer extends BaseTransformer<Article> {
  toObject() {
    /**
     * Derive the flags from the raw column values rather than the model
     * getters. Articles read back from the cache are plain JSON objects,
     * so neither the getters nor the instance level $columns survive.
     */
    return {
      ...this.pick(this.resource, Article.$columns),
      isPublished: this.resource.publishedAt !== null,
      hasLocation: this.resource.latitude !== null && this.resource.longitude !== null,
    }
  }
}
