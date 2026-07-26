import { ArticleSchema } from '#database/schema'
import { type BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import { belongsTo } from '@adonisjs/lucid/orm'

export default class Article extends ArticleSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  get isPublished() {
    return this.publishedAt !== null
  }

  get hasLocation() {
    return this.latitude !== null && this.longitude !== null
  }
}
