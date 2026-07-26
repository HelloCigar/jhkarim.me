/* eslint-disable @typescript-eslint/consistent-type-imports */
import { BaseTransformer } from '@adonisjs/core/transformers'
import Article from '#models/article'

export default class ArticleTransformer extends BaseTransformer<Article> {
  toObject() {
    return {
      ...this.pick(this.resource, this.resource.$columns),
      isPublished: this.resource.isPublished,
      hasLocation: this.resource.hasLocation,
    }
  }
}
