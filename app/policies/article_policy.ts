import type User from '#models/user'
import type Article from '#models/article'
import { BasePolicy } from '@adonisjs/bouncer'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'

/**
 * The blog has a single author: the admin account created with
 * the "node ace make:admin" command. Every write action on the
 * articles resource is gated by this policy at the controller level.
 */
export default class ArticlePolicy extends BasePolicy {
  viewList(user: User): AuthorizerResponse {
    return user !== null
  }

  create(user: User): AuthorizerResponse {
    return user !== null
  }

  edit(_user: User, _article: Article): AuthorizerResponse {
    return true
  }

  delete(user: User, article: Article): AuthorizerResponse {
    return user.id === article.userId
  }
}
